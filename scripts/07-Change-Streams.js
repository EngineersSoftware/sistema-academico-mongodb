/**
 * @fileoverview Script para usar Change Streams en la base de datos de la universidad.
 * @description Monitorea cambios en la colección inscripciones y actualiza promedios de estudiantes.
 * @author Camilo Gomez
 */

/**
 * Monitorear cambios en inscripciones para actualizar promedios de estudiantes.
 */
function monitorearInscripciones() {
  const changeStream = db.inscripciones.watch([
    { $match: { "operationType": "update", "updateDescription.updatedFields.nota_final": { $exists: true } } }
  ]);

  print("Monitoreando cambios en inscripciones...");
  try {
    while (!changeStream.isExhausted()) {
      if (changeStream.hasNext()) {
        const change = changeStream.next();
        const estudianteId = change.documentKey._id;
        const estudiante = db.estudiantes.findOne({ _id: change.fullDocument.estudiante_id });
        if (estudiante) {
          const notas = db.estudiantes.findOne({ _id: estudiante._id }).materias_cursadas;
          const promedio = notas.length > 0
            ? notas.reduce((sum, m) => sum + m.nota_final, 0) / notas.length
            : 0;
          db.estudiantes.updateOne(
            { _id: estudiante._id },
            { $set: { promedio_acumulado: promedio } }
          );
          print(`Promedio actualizado para estudiante ${estudiante.codigo}: ${promedio}`);
        }
      }
    }
  } catch (e) {
    print(`Error en Change Stream: ${e}`);
  } finally {
    changeStream.close();
    print("Change Stream cerrado");
  }
}

// Ejecutar Change Stream (comentar/descomentar para activar)
// monitorearInscripciones();

// Ejemplo: Simular un cambio para probar el Change Stream
try {
  const estudiante = db.estudiantes.findOne({ codigo: "EST001" });
  const materia = db.materias.findOne({ codigo: "MAT004" });
  if (estudiante && materia) {
    db.inscripciones.updateOne(
      { estudiante_id: estudiante._id, materia_id: materia._id, periodo: "2024-2" },
      { $set: { nota_final: 4.2, estado: "Aprobado" } }
    );
    print("Simulación de cambio realizada");
  }
} catch (e) {
  print(`Error en simulación: ${e}`);
}

print("Change Streams configurados exitosamente");