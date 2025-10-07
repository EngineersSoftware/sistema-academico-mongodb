/**
 * @fileoverview Script para realizar agregaciones en la base de datos de la universidad.
 * @description Genera reportes analíticos complejos usando pipelines de agregación.
 * @author Camilo Gomez
 */

/**
 * Reporte: Promedio de notas por programa.
 */
function promedioNotasPorPrograma() {
  print("Promedio de notas por programa:");
  db.estudiantes.aggregate([
    { $unwind: "$materias_cursadas" },
    {
      $group: {
        _id: "$programa.nombre",
        promedio_notas: { $avg: "$materias_cursadas.nota_final" },
        total_estudiantes: { $addToSet: "$_id" }
      }
    },
    {
      $project: {
        programa: "$_id",
        promedio_notas: { $round: ["$promedio_notas", 2] },
        total_estudiantes: { $size: "$total_estudiantes" }
      }
    },
    { $sort: { promedio_notas: -1 } }
  ]).forEach(doc => printjson(doc));
}
promedioNotasPorPrograma();

/**
 * Reporte: Estudiantes con más materias reprobadas.
 */
function estudiantesConMasReprobaciones() {
  print("Estudiantes con más materias reprobadas:");
  db.inscripciones.aggregate([
    { $match: { estado: "Reprobado" } },
    {
      $lookup: {
        from: "estudiantes",
        localField: "estudiante_id",
        foreignField: "_id",
        as: "estudiante_detalles"
      }
    },
    { $unwind: "$estudiante_detalles" },
    {
      $group: {
        _id: {
          codigo: "$estudiante_detalles.codigo",
          nombre: "$estudiante_detalles.nombre"
        },
        reprobaciones: { $sum: 1 }
      }
    },
    {
      $project: {
        codigo: "$_id.codigo",
        nombre: "$_id.nombre",
        reprobaciones: 1
      }
    },
    { $sort: { reprobaciones: -1 } },
    { $limit: 5 }
  ]).forEach(doc => printjson(doc));
}
estudiantesConMasReprobaciones();

/**
 * Reporte: Profesores con mayor carga académica.
 */
function profesoresMayorCarga() {
  print("Profesores con mayor carga académica:");
  db.profesores.aggregate([
    {
      $lookup: {
        from: "materias",
        localField: "materias_asignadas",
        foreignField: "_id",
        as: "materias_detalles"
      }
    },
    {
      $project: {
        codigo: 1,
        nombre: 1,
        numero_materias: { $size: "$materias_asignadas" },
        creditos_totales: { $sum: "$materias_detalles.creditos" }
      }
    },
    { $sort: { numero_materias: -1, creditos_totales: -1 } }
  ]).forEach(doc => printjson(doc));
}
profesoresMayorCarga();

/**
 * Reporte: Materias con mayor número de inscripciones.
 */
function materiasMasInscritas() {
  print("Materias con mayor número de inscripciones:");
  db.inscripciones.aggregate([
    {
      $lookup: {
        from: "materias",
        localField: "materia_id",
        foreignField: "_id",
        as: "materia_detalles"
      }
    },
    { $unwind: "$materia_detalles" },
    {
      $group: {
        _id: {
          codigo: "$materia_detalles.codigo",
          nombre: "$materia_detalles.nombre"
        },
        inscripciones: { $sum: 1 }
      }
    },
    {
      $project: {
        codigo: "$_id.codigo",
        nombre: "$_id.nombre",
        inscripciones: 1
      }
    },
    { $sort: { inscripciones: -1 } }
  ]).forEach(doc => printjson(doc));
}
materiasMasInscritas();

print("Agregaciones completadas exitosamente");