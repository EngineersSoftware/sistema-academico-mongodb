function promedioPorMateria() {
  return db.inscripciones.aggregate([
    { $match: { calificacion: { $ne: null } } },
    { $group: { _id: "$materia_id", promedio: { $avg: "$calificacion" } } },
    { $lookup: { from: "materias", localField: "_id", foreignField: "_id", as: "materia" } },
    { $project: { nombre: { $arrayElemAt: ["$materia.nombre", 0] }, promedio: 1 } },
    { $sort: { promedio: -1 } }
  ]).toArray();
}

function estudiantesEnRiesgo() {
  return db.estudiantes.aggregate([
    { $match: { promedio_acumulado: { $lt: 3.0 }, estado: "Activo" } },
    { $project: { codigo: 1, nombre: 1, email: 1, promedio_acumulado: 1, semestre_actual: 1, nivel_riesgo: { $cond: { if: { $lt: ["$promedio_acumulado", 2.5] }, then: "Alto", else: "Medio" } } } },
    { $sort: { promedio_acumulado: 1 } }
  ]).toArray();
}

function materiasMasReprobadas() {
  return db.inscripciones.aggregate([
    { $match: { estado: "Reprobado" } },
    { $group: { _id: "$materia_id", count: { $sum: 1 } } },
    { $lookup: { from: "materias", localField: "_id", foreignField: "_id", as: "materia" } },
    { $project: { nombre: { $arrayElemAt: ["$materia.nombre", 0] }, count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]).toArray();
}

function cargaProfesores(periodo) {
  return db.profesores.aggregate([
    { $unwind: "$materias_asignadas" },
    { $match: { "materias_asignadas.periodo": periodo } },
    { $group: { _id: "$_id", carga: { $sum: 1 }, nombre: { $first: "$nombre" } } },
    { $sort: { carga: -1 } }
  ]).toArray();
}

function estadisticasGraduacion() {
  return db.estudiantes.aggregate([
    { $match: { estado: "Graduado" } },
    { $group: { _id: "$programa.id", count: { $sum: 1 }, avg_promedio: { $avg: "$promedio_acumulado" } } },
    { $lookup: { from: "programas", localField: "_id", foreignField: "_id", as: "programa" } },
    { $project: { nombre: { $arrayElemAt: ["$programa.nombre", 0] }, count: 1, avg_promedio: 1 } }
  ]).toArray();
}

function rankingEstudiantes(programaNombre) {
  return db.estudiantes.aggregate([
    { $match: { "programa.nombre": programaNombre, estado: "Activo" } },
    { $sort: { promedio_acumulado: -1 } },
    { $limit: 10 },
    { $project: { codigo: 1, nombre: 1, promedio_acumulado: 1 } }
  ]).toArray();
}

function analisisDesercion() {
  return db.estudiantes.aggregate([
    { $match: { estado: "Retirado" } },
    { $group: { _id: "$semestre_actual", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
}