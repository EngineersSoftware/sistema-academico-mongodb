/**
 * @fileoverview Script para realizar agregaciones en la base de datos de la universidad.
 * @description Genera reportes analíticos complejos usando pipelines de agregación.
 * @author Camilo Gomez
 */

/**
 * @function calcularPromedioPorMateria
 * @description Calcula el promedio general de calificaciones (calificacion_final) para todas las materias.
 * @returns {Array} Lista de materias con su promedio, ordenadas de mayor a menor rendimiento.
 */
function calcularPromedioPorMateria() {
    return db.inscripciones.aggregate([
        {
            $match: {
                estado_materia: { $in: ["Aprobada", "Reprobada"] },
                calificacion_final: { $ne: null } // Solo materias finalizadas
            }
        },
        {
            $group: {
                _id: "$materia_codigo", // Agrupar por código de materia
                promedio: { $avg: "$calificacion_final" }, // Calcular el promedio de las notas finales
                total_inscritos: { $sum: 1 }
            }
        },
        {
            $sort: { promedio: -1 } // Ordenar por promedio descendente
        },
        {
            $lookup: { // Traer el nombre de la materia (JOIN con la colección materias)
                from: "materias",
                localField: "_id",
                foreignField: "codigo",
                as: "detalle_materia"
            }
        },
        {
            $unwind: "$detalle_materia"
        },
        {
            $project: {
                _id: 0,
                materia_codigo: "$_id",
                nombre: "$detalle_materia.nombre",
                promedio: { $round: ["$promedio", 2] }, // Redondear a 2 decimales
                total_inscritos: 1
            }
        }
    ]);
}

/**
 * @function listarEstudiantesEnRiesgo
 * @description Lista a todos los estudiantes activos cuyo promedio acumulado es inferior a 3.0.
 * @returns {Array} Lista de estudiantes en riesgo, ordenada por promedio ascendente.
 */
function listarEstudiantesEnRiesgo() {
    const LIMITE_RIESGO = 3.0;
    
    return db.estudiantes.aggregate([
        {
            $match: {
                estado: "Activo",
                promedio_acumulado: { $lt: LIMITE_RIESGO } // Promedio menor a 3.0
            }
        },
        {
            $sort: { promedio_acumulado: 1 } // Los más bajos primero
        },
        {
            $project: {
                _id: 0,
                codigo: 1,
                nombre: 1,
                programa_codigo: 1,
                promedio_acumulado: { $round: ["$promedio_acumulado", 2] },
                alerta: {
                    $concat: ["Riesgo: Promedio bajo ", { $toString: "$promedio_acumulado" }]
                }
            }
        }
    ]);
}

/**
 * @function reporteMateriasMasReprobadas
 * @description Calcula la tasa de reprobación por materia (número de reprobados / total de inscritos).
 * @returns {Array} Lista de materias, ordenadas por tasa de reprobación descendente.
 */
function reporteMateriasMasReprobadas() {
    return db.inscripciones.aggregate([
        {
            $group: {
                _id: "$materia_codigo",
                total_inscritos: { $sum: 1 },
                total_reprobados: { 
                    $sum: { 
                        $cond: [{ $eq: ["$estado_materia", "Reprobada"] }, 1, 0] 
                    } 
                }
            }
        },
        {
            $project: {
                _id: 0,
                materia_codigo: "$_id",
                total_inscritos: 1,
                total_reprobados: 1,
                // Calcular la tasa de reprobación (usando $divide y $multiply para el porcentaje)
                tasa_reprobacion: {
                    $round: [
                        { $multiply: [{ $divide: ["$total_reprobados", "$total_inscritos"] }, 100] }, 
                        2
                    ]
                }
            }
        },
        {
            $sort: { tasa_reprobacion: -1 } // Ordenar de mayor tasa a menor
        }
    ]);
}

/**
 * @function calcularCargaAcademica
 * @description Calcula el número de materias asignadas a cada profesor en un período dado.
 * @param {string} periodo - Período académico a consultar (ej: "2024-2").
 * @returns {Array} Lista de profesores con su carga académica para ese período.
 */
function calcularCargaAcademica(periodo) {
    return db.profesores.aggregate([
        {
            $unwind: "$materias_asignadas" // Desnormalizar el array de materias
        },
        {
            $match: {
                "materias_asignadas.periodo": periodo // Filtrar por el período específico
            }
        },
        {
            $group: {
                _id: "$codigo", // Agrupar por código de profesor
                nombre: { $first: "$nombre" },
                total_materias: { $sum: 1 },
                materias: { $push: "$materias_asignadas.materia_codigo" }
            }
        },
        {
            $sort: { total_materias: -1 }
        },
        {
            $project: {
                _id: 0,
                codigo: "$_id",
                nombre: 1,
                periodo: periodo,
                total_materias: 1,
                materias_impartidas: "$materias"
            }
        }
    ]);
}

/**
 * @function rankingMejoresEstudiantes
 * @description Genera un ranking de los 5 mejores estudiantes por cada programa académico, basado en el promedio acumulado.
 * @returns {Array} Lista de los mejores estudiantes por programa.
 */
function rankingMejoresEstudiantes() {
    return db.estudiantes.aggregate([
        {
            $match: {
                estado: "Activo",
                promedio_acumulado: { $gt: 0.0 } // Excluir estudiantes sin notas
            }
        },
        {
            $sort: { promedio_acumulado: -1 } // Ordenar globalmente de mayor a menor promedio
        },
        {
            // Agrupar y rankear dentro de cada grupo (programa)
            $group: {
                _id: "$programa_codigo",
                mejores_estudiantes: { $push: { codigo: "$codigo", nombre: "$nombre", promedio: "$promedio_acumulado" } }
            }
        },
        {
            $project: {
                _id: 0,
                programa_codigo: "$_id",
                // Aplicar $slice para tomar solo los primeros 5 de cada array
                top_5_estudiantes: { $slice: ["$mejores_estudiantes", 5] } 
            }
        },
        {
            $sort: { programa_codigo: 1 }
        }
    ]);
}

/**
 * @function analisisDesercion
 * @description Calcula el total de estudiantes en estado "Retirado" e "Inactivo" por programa.
 * @returns {Array} Reporte de deserción por programa.
 */
function analisisDesercion() {
    return db.estudiantes.aggregate([
        {
            $match: {
                estado: { $in: ["Retirado", "Inactivo"] } // Estudiantes desertados
            }
        },
        {
            $group: {
                _id: "$programa_codigo",
                total_desertores: { $sum: 1 },
                total_retirados: { 
                    $sum: { 
                        $cond: [{ $eq: ["$estado", "Retirado"] }, 1, 0] 
                    } 
                },
                total_inactivos: { 
                    $sum: { 
                        $cond: [{ $eq: ["$estado", "Inactivo"] }, 1, 0] 
                    } 
                }
            }
        },
        {
            // Opcional: Calcular el porcentaje de deserción respecto al total de estudiantes en el programa.
            // Esto requeriría un $lookup o un conteo previo del total de estudiantes.
            $sort: { total_desertores: -1 }
        },
        {
            $project: {
                _id: 0,
                programa_codigo: "$_id",
                total_desertores: 1,
                total_retirados: 1,
                total_inactivos: 1
            }
        }
    ]);
}

