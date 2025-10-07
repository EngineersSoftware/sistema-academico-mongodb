/**
 * @fileoverview Script para realizar transacciones en la base de datos de la universidad.
 * @description Incluye transacciones para operaciones atómicas como inscripciones y actualizaciones de promedio.
 * @author Sebastian Ramirez
 */


/**
 * @function inscripcionMultipleMaterias_VALIDADA
 * @description Inscribe a un estudiante en una lista de materias, verificando prerrequisitos y unicidad atómicamente.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} periodo - Período académico (ej: "2024-2").
 * @param {Array<string>} codigosMaterias - Lista de códigos de materias.
 * @returns {string} Mensaje de éxito o error.
 */
function inscripcionMultipleMaterias_VALIDADA(codigoEstudiante, periodo, codigosMaterias) {
    const session = db.getMongo().startSession();
    
    try {
        // 1. Validaciones previas (fuera de la transacción, por eficiencia)
        if (!db.estudiantes.findOne({ codigo: codigoEstudiante })) {
            throw new Error(`Estudiante con código ${codigoEstudiante} no encontrado.`);
        }

        const inscripciones = [];
        const fecha = new Date();

        // 2. Bucle de validación de prerrequisitos y unicidad (aún fuera de la transacción)
        for (const mat_cod of codigosMaterias) {
            if (!validarInscripcionUnica(codigoEstudiante, mat_cod, periodo)) {
                throw new Error(`Validación de unicidad fallida para la materia ${mat_cod}.`);
            }
            if (!verificarPrerrequisitos(mat_cod, codigoEstudiante)) {
                 // La función ya imprime el error específico del prerrequisito
                throw new Error(`Fallo en prerrequisitos para la materia ${mat_cod}.`);
            }
            
            // Si pasa todas las validaciones, se prepara la inserción
            inscripciones.push({
                estudiante_codigo: codigoEstudiante,
                materia_codigo: mat_cod,
                periodo: periodo,
                fecha_inscripcion: fecha,
                estado_materia: "Cursando",
                calificacion_final: null,
                calificaciones: []
            });
        }
        
        // --- INICIO DE LA TRANSACCIÓN ---
        session.startTransaction();

        // 3. Inserción masiva atómica (Todo o nada)
        if (inscripciones.length > 0) {
            db.inscripciones.insertMany(inscripciones, { session });
        }

        session.commitTransaction();
        return ` Inscripción exitosa de ${inscripciones.length} materias para el estudiante ${codigoEstudiante}.`;

    } catch (e) {
        if (session.inTransaction()) {
            session.abortTransaction();
        }
        return ` Error en la inscripción. Transacción abortada: ${e.message}`;
    } finally {
        session.endSession();
    }
}

// Ejemplo de uso:
/*
// inscripcionMultipleMaterias("E001", "2025-1", ["MAT005", "FIS001", "IND-303"]);
*/

/**
 * @function registrarNotaYActualizarPromedio
 * @description Registra la nota final de una materia y recalcula el promedio general del estudiante.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {number} notaFinal - Nota final (0.0 a 5.0).
 * @param {string} periodo - Período académico.
 * @returns {string} Mensaje de éxito o error.
 */
function registrarNotaYActualizarPromedio(codigoEstudiante, codigoMateria, notaFinal, periodo) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();

        const estado = notaFinal >= 3.0 ? "Aprobada" : "Reprobada";
        
        // 1. Obtener documentos necesarios dentro de la transacción
        const inscripcion = db.inscripciones.findOne({ 
            estudiante_codigo: codigoEstudiante, 
            materia_codigo: codigoMateria, 
            periodo: periodo
        }, { session });

        const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante }, { session });
        const materia = db.materias.findOne({ codigo: codigoMateria }, { session });

        if (!inscripcion || !estudiante || !materia) {
            throw new Error("Estudiante, materia o inscripción no encontrados.");
        }
        if (inscripcion.estado_materia !== "Cursando") {
            throw new Error("La materia ya tiene un estado final o no está cursando.");
        }

        // 2. Actualizar la Inscripción
        db.inscripciones.updateOne(
            { _id: inscripcion._id },
            { 
                $set: { 
                    estado_materia: estado,
                    calificacion_final: Double(notaFinal)
                } 
            },
            { session }
        );

        // 3. Recálculo de Promedio y Créditos
        const creditosMateria = materia.creditos;
        let nuevosCreditosCursados = estudiante.creditos_cursados;
        let nuevoPonderadoTotal = estudiante.promedio_acumulado * estudiante.creditos_cursados;
        let nuevoPromedio = estudiante.promedio_acumulado;

        // Si es la primera nota registrada, o si se aprueba, actualizar créditos
        if (estado === "Aprobada" || estado === "Reprobada") {
            // Lógica compleja: Recalcular promedio acumulado total
            // Se necesita obtener TODAS las notas Aprobadas/Reprobadas para el cálculo exacto
            
            // Paso A: Obtener todas las inscripciones finalizadas (Aprobada o Reprobada)
            const todasLasInscripciones = db.inscripciones.find(
                { 
                    estudiante_codigo: codigoEstudiante, 
                    estado_materia: { $in: ["Aprobada", "Reprobada"] } 
                }, 
                { session }
            ).toArray();
            
            let totalPonderado = 0;
            let totalCreditos = 0;
            
            for (const item of todasLasInscripciones) {
                // Obtener créditos para esta materia (se necesita lookup en 'materias' o guardarlos en 'inscripciones')
                // Para simplificar, asumiremos que los créditos se pueden obtener de la colección 'materias'
                const matInfo = db.materias.findOne({ codigo: item.materia_codigo }, { session });
                const creditos = matInfo ? matInfo.creditos : 0;
                
                totalPonderado += item.calificacion_final * creditos;
                totalCreditos += creditos;
            }

            // Si el total de créditos es 0 (ej: es la primera nota), evitamos división por cero
            nuevoPromedio = totalCreditos > 0 ? (totalPonderado / totalCreditos) : notaFinal;
            nuevosCreditosCursados = totalCreditos;
        }

        // 4. Actualizar el Estudiante
        db.estudiantes.updateOne(
            { _id: estudiante._id },
            { 
                $set: { 
                    promedio_acumulado: Double(nuevoPromedio), // Clave: usar Double()
                    creditos_cursados: nuevosCreditosCursados
                } 
            },
            { session }
        );

        session.commitTransaction();
        return ` Nota registrada (${notaFinal}, ${estado}) para ${codigoMateria}. Promedio actualizado a ${nuevoPromedio.toFixed(2)}.`;

    } catch (e) {
        if (session.inTransaction()) {
            session.abortTransaction();
        }
        return ` Error al registrar nota. Transacción abortada: ${e.message}`;
    } finally {
        session.endSession();
    }
}

// Ejemplo de uso:
/*
// registrarNotaYActualizarPromedio("E002", "ALG-001", 3.0, "2024-2");
*/

/**
 * @function retirarMateria
 * @description Registra el retiro de una materia por el estudiante y revierte el impacto en el promedio/créditos.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @returns {string} Mensaje de éxito o error.
 */
function retirarMateria(codigoEstudiante, codigoMateria, periodo) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();

        // 1. Validar la inscripción y el estado actual
        const inscripcionQuery = { 
            estudiante_codigo: codigoEstudiante, 
            materia_codigo: codigoMateria, 
            periodo: periodo,
            estado_materia: "Cursando" // Solo se puede retirar si está Cursando
        };

        const inscripcion = db.inscripciones.findOne(inscripcionQuery, { session });
        if (!inscripcion) {
            throw new Error("Inscripción no encontrada o ya finalizada/retirada.");
        }
        
        // 2. Actualizar la Inscripción a "Retirada"
        db.inscripciones.updateOne(
            { _id: inscripcion._id },
            { 
                $set: { 
                    estado_materia: "Retirada",
                    calificacion_final: Double(0.0) // Nota de 0.0, aunque no afecta el promedio
                } 
            },
            { session }
        );

        // 3. Recalcular el promedio y créditos (el promedio no cambia por un retiro, pero los créditos cursados podrían ajustarse)
        // Ya que la materia está Cursando, no debería haber contribuido a los créditos cursados ni al promedio. 
        // Solo necesitamos mantener la consistencia con la lógica del sistema.
        
        // **La actualización del estudiante se omite aquí ya que solo afectaría si el retiro anula una nota final,
        // lo cual se previene al exigir estado_materia: "Cursando" en la query.**

        session.commitTransaction();
        return ` Retiro de materia ${codigoMateria} para ${codigoEstudiante} registrado exitosamente.`;

    } catch (e) {
        if (session.inTransaction()) {
            session.abortTransaction();
        }
        return ` Error al retirar materia. Transacción abortada: ${e.message}`;
    } finally {
        session.endSession();
    }
}

// Ejemplo de uso:
/*
// retirarMateria("E004", "DER-010", "2024-2");
*/

/**
 * @function graduarEstudiante
 * @description Valida los requisitos de graduación (ej: créditos) y actualiza el estado del estudiante a "Graduado".
 * @param {string} codigoEstudiante - Código del estudiante.
 * @returns {string} Mensaje de éxito o error.
 */
function graduarEstudiante(codigoEstudiante) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();

        const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante }, { session });
        if (!estudiante) {
            throw new Error(`Estudiante con código ${codigoEstudiante} no encontrado.`);
        }
        if (estudiante.estado === "Graduado") {
            throw new Error("El estudiante ya está graduado.");
        }

        // 1. Validación de Requisitos (Simulación: Total de Créditos)
        // Se asume que el programa requiere 160 créditos
        const CREDITOS_REQUERIDOS = 160; 
        if (estudiante.creditos_cursados < CREDITOS_REQUERIDOS) {
            throw new Error(`Créditos insuficientes. Requeridos: ${CREDITOS_REQUERIDOS}, Cursados: ${estudiante.creditos_cursados}.`);
        }
        
        // 2. Actualizar el Estudiante a "Graduado"
        db.estudiantes.updateOne(
            { _id: estudiante._id },
            { 
                $set: { 
                    estado: "Graduado",
                    fecha_graduacion: new Date()
                } 
            },
            { session }
        );

        // 3. Opcional: Desvincular inscripciones futuras (si las hubiera) o archivar el registro.
        // db.inscripciones.deleteMany({ estudiante_codigo: codigoEstudiante, estado_materia: "Cursando" }, { session });

        session.commitTransaction();
        return ` ¡Felicidades! Estudiante ${codigoEstudiante} graduado exitosamente.`;

    } catch (e) {
        if (session.inTransaction()) {
            session.abortTransaction();
        }
        return ` Error en la graduación. Transacción abortada: ${e.message}`;
    } finally {
        session.endSession();
    }
}

// Ejemplo de uso (Nota: E003 tiene 140 créditos, fallaría la validación por créditos)
/*
// graduarEstudiante("E003");
*/