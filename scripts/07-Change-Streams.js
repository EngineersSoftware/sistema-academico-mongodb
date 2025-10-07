/**
 * @fileoverview Script para usar Change Streams en la base de datos de la universidad.
 * @description Monitorea cambios en la colección inscripciones y actualiza promedios de estudiantes.
 * @author Camilo Gomez
 */

/**
 * @function streamAuditoriaEstudiantes
 * @description Monitorea actualizaciones en la colección 'estudiantes' y registra el cambio en una colección de auditoría.
 */
function streamAuditoriaEstudiantes() {
    // Escucha operaciones de 'update' o 'replace' y pide el documento completo resultante.
    const changeStream = db.estudiantes.watch([
        { $match: { "operationType": { $in: ["update", "replace"] } } }
    ], { fullDocument: 'updateLookup' });

    print("Change Stream: Auditoría de cambios en estudiantes activado...");
    
    // --- Lógica del Handler ---
    changeStream.on('change', (change) => {
        const codigoEstudiante = change.fullDocument.codigo;
        
        // Se recomienda que la colección 'auditoria' sea creada previamente.
        db.auditoria_estudiantes.insertOne({
            fecha: new Date(),
            tipo_operacion: change.operationType,
            estudiante_codigo: codigoEstudiante,
            // Capturar el detalle de lo que se cambió (útil para auditoría)
            detalle: change.updateDescription ? change.updateDescription.updatedFields : change.fullDocument 
        });
        print(`[AUDITORÍA] Cambio registrado para estudiante: ${codigoEstudiante}`);
    });
}

/**
 * @function streamNotificacionRiesgo
 * @description Monitorea el promedio de estudiantes y alerta si baja a menos de 3.0.
 */
function streamNotificacionRiesgo() {
    const changeStream = db.estudiantes.watch([
        { 
            $match: { 
                "operationType": "update",
                // Filtra solo si el campo promedio_acumulado fue modificado
                "updateDescription.updatedFields.promedio_acumulado": { $exists: true } 
            } 
        }
    ], { fullDocument: 'updateLookup' }); // Necesitamos el documento después del cambio

    print("Change Stream: Notificación de riesgo académico activado...");
    
    // --- Lógica del Handler ---
    changeStream.on('change', (change) => {
        const estudiante = change.fullDocument;
        const promedioActual = estudiante.promedio_acumulado;

        if (estudiante.estado === "Activo" && promedioActual < 3.0) {
            // Lógica de negocio: Simular envío de alerta
            print(` ALERTA DE RIESGO para ${estudiante.nombre} (${estudiante.codigo}) en ${estudiante.programa_codigo}. Promedio: ${promedioActual.toFixed(2)}.`);
            
            // Aquí iría la llamada a un servicio externo (ej. email)
            // enviarAlertaRiesgo(estudiante.email_institucional, promedioActual); 
        }
    });
}

/**
 * @function streamActualizarCreditos
 * @description Monitorea la aprobación de materias para incrementar los créditos cursados del estudiante.
 */
function streamActualizarCreditos() {
    const changeStream = db.inscripciones.watch([
        { 
            $match: { 
                "operationType": "update",
                // Filtra cuando el estado cambia a Aprobada (o cuando se inserta con ese estado)
                "updateDescription.updatedFields.estado_materia": "Aprobada" 
            } 
        }
    ], { fullDocument: 'updateLookup' });

    print("Change Stream: Actualización automática de créditos activado...");
    
    // --- Lógica del Handler ---
    changeStream.on('change', (change) => {
        const inscripcion = change.fullDocument;
        const codigoMateria = inscripcion.materia_codigo;
        const codigoEstudiante = inscripcion.estudiante_codigo;

        // 1. Obtener los créditos de la materia (se requiere una búsqueda rápida)
        const materia = db.materias.findOne({ codigo: codigoMateria });
        if (!materia) {
            print(`Error: Materia ${codigoMateria} no encontrada para actualizar créditos.`);
            return;
        }

        // 2. Ejecutar la actualización en la colección 'estudiantes'
        db.estudiantes.updateOne(
            { codigo: codigoEstudiante },
            { $inc: { creditos_cursados: materia.creditos } }
        );
        
        print(`[CRÉDITOS] Se añadieron ${materia.creditos} créditos a ${codigoEstudiante} por aprobación de ${codigoMateria}.`);
    });
}

/**
 * @function streamValidacionCupos
 * @description Monitorea nuevas inscripciones para verificar y alertar si se excede el cupo máximo de una materia.
 */
function streamValidacionCupos() {
    const changeStream = db.inscripciones.watch([
        // Solo nos interesa cuando se crea una nueva inscripción
        { $match: { "operationType": "insert" } } 
    ], { fullDocument: 'default' });

    print("Change Stream: Validación de cupos por materia activado...");
    
    // --- Lógica del Handler ---
    changeStream.on('change', (change) => {
        const nuevaInscripcion = change.fullDocument;
        const codigoMateria = nuevaInscripcion.materia_codigo;
        
        // 1. Obtener el cupo máximo (asumimos que existe un campo 'cupo_maximo' en 'materias')
        const materia = db.materias.findOne({ codigo: codigoMateria });
        const CUPO_MAXIMO = materia ? (materia.cupo_maximo || 30) : 30; // 30 por defecto
        
        // 2. Contar inscripciones activas para esta materia
        const totalInscritos = db.inscripciones.countDocuments({ 
            materia_codigo: codigoMateria, 
            estado_materia: { $in: ["Cursando", "Inscrito"] } 
        });
        
        // 3. Reaccionar al sobrecupo
        if (totalInscritos > CUPO_MAXIMO) {
             print(` ¡ALERTA DE SOBRECUPOS! La materia ${codigoMateria} tiene ${totalInscritos} inscritos, excediendo el límite de ${CUPO_MAXIMO}.`);
             
             // Aquí iría la lógica para bloquear futuras inscripciones (ej: actualizar el estado de la materia a "Cerrada")
        }
    });
}

/**
 * @function streamHistorialCalificaciones
 * @description Crea un registro histórico cada vez que las notas de una inscripción son modificadas.
 */
function streamHistorialCalificaciones() {
    const changeStream = db.inscripciones.watch([
        { 
            $match: { 
                "operationType": "update",
                // Filtra si se actualiza el array de parciales o la nota final
                $or: [
                    { "updateDescription.updatedFields.calificaciones": { $exists: true } },
                    { "updateDescription.updatedFields.calificacion_final": { $exists: true } }
                ]
            } 
        }
    ], { fullDocument: 'preAndPostImage' }); // Necesitamos el estado ANTES y DESPUÉS del cambio

    print("Change Stream: Historial de calificaciones activado...");
    
    // --- Lógica del Handler ---
    changeStream.on('change', (change) => {
        // Se asume la existencia de 'inscripcion_historial'
        db.inscripcion_historial.insertOne({
            fecha_modificacion: new Date(),
            operacion: "ACTUALIZACION_NOTA",
            inscripcion_id: change.documentKey._id,
            // Guardamos el estado previo del documento para auditoría
            estado_anterior: change.fullDocumentBeforeChange
        });
        print(`[HISTORIAL] Registro de modificación de notas guardado para inscripción ID: ${change.documentKey._id}`);
    });
}

