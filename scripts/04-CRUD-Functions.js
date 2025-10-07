/**
 * @function crearEstudiante
 * @description Crea e inserta un nuevo estudiante. Asegura que el promedio sea Double(0.0).
 * @param {Object} estudiante - Objeto con datos del estudiante (debe incluir codigo, nombre, email_institucional, programa_codigo).
 * @returns {Object} Resultado de la inserción.
 */
function crearEstudiante(estudiante) {
    // Simulamos validación básica (ej: no duplicar el código)
    if (db.estudiantes.findOne({ codigo: estudiante.codigo })) {
        print(`Error: El código de estudiante ${estudiante.codigo} ya existe.`);
        return null;
    }

    const nuevoEstudiante = {
        codigo: estudiante.codigo,
        nombre: estudiante.nombre,
        email_institucional: estudiante.email_institucional,
        fecha_nacimiento: estudiante.fecha_nacimiento || new Date(),
        semestre_actual: estudiante.semestre_actual || 1,
        programa_codigo: estudiante.programa_codigo,
        estado: estudiante.estado || "Activo",
        promedio_acumulado: Double(estudiante.promedio_acumulado || 0.0), // Usar Double()
        creditos_cursados: estudiante.creditos_cursados || 0
    };
    
    return db.estudiantes.insertOne(nuevoEstudiante);
}

/**
 * @function leerEstudiante
 * @description Leer un estudiante por código.
 * @param {string} codigo - Código del estudiante.
 * @returns {Object|null} Documento del estudiante o null si no existe.
 */
function leerEstudiante(codigo) {
    return db.estudiantes.findOne({ codigo: codigo });
}

/**
 * @function actualizarEstadoEstudiante
 * @description Actualizar el estado de un estudiante (ej: "Inactivo", "Graduado").
 * @param {string} codigo - Código del estudiante.
 * @param {string} estado - Nuevo estado.
 * @returns {Object} Resultado de la actualización.
 */
function actualizarEstadoEstudiante(codigo, estado) {
    return db.estudiantes.updateOne(
        { codigo: codigo },
        { $set: { estado: estado } }
    );
}

/**
 * @function eliminarEstudiante
 * @description Eliminar un estudiante por código. Debería eliminar inscripciones relacionadas para mantener la integridad.
 * @param {string} codigo - Código del estudiante.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarEstudiante(codigo) {
    // Opcional: Eliminar inscripciones relacionadas para evitar huérfanos
    // db.inscripciones.deleteMany({ estudiante_codigo: codigo });
    return db.estudiantes.deleteOne({ codigo: codigo });
}


/**
 * @function crearMateria
 * @description Crea e inserta una nueva materia.
 * @param {Object} materia - Objeto con datos de la materia (codigo, nombre, creditos, programa_codigo).
 * @returns {Object} Resultado de la inserción.
 */
function crearMateria(materia) {
    if (db.materias.findOne({ codigo: materia.codigo })) {
        print(`Error: El código de materia ${materia.codigo} ya existe.`);
        return null;
    }
    // Asegurar que 'creditos' es un int
    materia.creditos = parseInt(materia.creditos); 
    return db.materias.insertOne(materia);
}

/**
 * @function leerMateria
 * @description Leer una materia por código.
 * @param {string} codigo - Código de la materia.
 * @returns {Object|null} Documento de la materia o null si no existe.
 */
function leerMateria(codigo) {
    return db.materias.findOne({ codigo: codigo });
}

/**
 * @function actualizarCreditosMateria
 * @description Actualizar el número de créditos de una materia.
 * @param {string} codigo - Código de la materia.
 * @param {number} creditos - Nuevo número de créditos.
 * @returns {Object} Resultado de la actualización.
 */
function actualizarCreditosMateria(codigo, creditos) {
    return db.materias.updateOne(
        { codigo: codigo },
        { $set: { creditos: parseInt(creditos) } }
    );
}

/**
 * @function eliminarMateria
 * @description Eliminar una materia por código.
 * @param {string} codigo - Código de la materia.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarMateria(codigo) {
    return db.materias.deleteOne({ codigo: codigo });
}


/**
 * @function crearProfesor
 * @description Crea e inserta un nuevo profesor.
 * @param {Object} profesor - Objeto con datos del profesor (codigo, nombre, especialidad).
 * @returns {Object} Resultado de la inserción.
 */
function crearProfesor(profesor) {
    if (db.profesores.findOne({ codigo: profesor.codigo })) {
        print(`Error: El código de profesor ${profesor.codigo} ya existe.`);
        return null;
    }
    // Inicializar materias asignadas si no se proporciona
    profesor.materias_asignadas = profesor.materias_asignadas || []; 
    return db.profesores.insertOne(profesor);
}

/**
 * @function leerProfesor
 * @description Leer un profesor por código.
 * @param {string} codigo - Código del profesor.
 * @returns {Object|null} Documento del profesor o null si no existe.
 */
function leerProfesor(codigo) {
    return db.profesores.findOne({ codigo: codigo });
}

/**
 * @function asignarMateriaProfesor
 * @description Asigna una materia y período a un profesor.
 * @param {string} codigoProfesor - Código del profesor.
 * @param {string} materia_codigo - Código de la materia a asignar.
 * @param {string} periodo - Período académico (ej: "2024-2").
 * @returns {Object} Resultado de la actualización.
 */
function asignarMateriaProfesor(codigoProfesor, materia_codigo, periodo) {
    return db.profesores.updateOne(
        { codigo: codigoProfesor },
        { 
            $push: { 
                materias_asignadas: { 
                    materia_codigo: materia_codigo, 
                    periodo: periodo 
                } 
            }
        }
    );
}

/**
 * @function eliminarProfesor
 * @description Eliminar un profesor por código.
 * @param {string} codigo - Código del profesor.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarProfesor(codigo) {
    return db.profesores.deleteOne({ codigo: codigo });
}

/**
 * @function crearInscripcion
 * @description Crea una nueva inscripción. Utiliza códigos de estudiante y materia.
 * @param {Object} inscripcion - Objeto con datos de la inscripción (estudiante_codigo, materia_codigo, periodo, etc.).
 * @returns {Object} Resultado de la inserción.
 */
function crearInscripcion(inscripcion) {
    // Validar existencia de estudiante y materia antes de insertar (simulación de FK)
    if (!db.estudiantes.findOne({ codigo: inscripcion.estudiante_codigo })) {
        print(`Error: Estudiante con código ${inscripcion.estudiante_codigo} no encontrado.`);
        return null;
    }
    if (!db.materias.findOne({ codigo: inscripcion.materia_codigo })) {
        print(`Error: Materia con código ${inscripcion.materia_codigo} no encontrada.`);
        return null;
    }

    const nuevaInscripcion = {
        estudiante_codigo: inscripcion.estudiante_codigo,
        materia_codigo: inscripcion.materia_codigo,
        periodo: inscripcion.periodo,
        fecha_inscripcion: inscripcion.fecha_inscripcion || new Date(),
        estado_materia: inscripcion.estado_materia || "Cursando",
        calificacion_final: null, // Siempre null al inicio
        calificaciones: []
    };

    return db.inscripciones.insertOne(nuevaInscripcion);
}

/**
 * @function leerInscripcionesEstudiante
 * @description Leer inscripciones por código de estudiante y período.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} periodo - Período académico.
 * @returns {Array} Lista de inscripciones.
 */
function leerInscripcionesEstudiante(codigoEstudiante, periodo) {
    return db.inscripciones.find({ 
        estudiante_codigo: codigoEstudiante, 
        periodo: periodo 
    }).toArray();
}

/**
 * @function actualizarNotaInscripcion
 * @description Actualizar la nota final de una inscripción. Asegura el uso de Double() y actualiza el estado.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @param {number} notaFinal - Nueva nota final.
 * @returns {Object} Resultado de la actualización.
 */
function actualizarNotaInscripcion(codigoEstudiante, codigoMateria, periodo, notaFinal) {
    const estado = notaFinal >= 3.0 ? "Aprobada" : "Reprobada";
    
    return db.inscripciones.updateOne(
        { 
            estudiante_codigo: codigoEstudiante, 
            materia_codigo: codigoMateria, 
            periodo: periodo,
            estado_materia: { $in: ["Cursando", "Retirada"] } // Solo se actualizan notas finales si no están definidas
        },
        { 
            $set: { 
                calificacion_final: Double(notaFinal), // Clave: usar Double()
                estado_materia: estado 
            } 
        }
    );
}

/**
 * @function eliminarInscripcion
 * @description Eliminar una inscripción por códigos y período. Solo permite eliminar si está 'Cursando' o 'Retirada'.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarInscripcion(codigoEstudiante, codigoMateria, periodo) {
    return db.inscripciones.deleteOne({ 
        estudiante_codigo: codigoEstudiante, 
        materia_codigo: codigoMateria, 
        periodo: periodo,
        estado_materia: { $in: ["Cursando", "Retirada"] }
    });
}