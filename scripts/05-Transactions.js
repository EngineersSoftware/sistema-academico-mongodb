/**
 * @fileoverview Script para realizar transacciones en la base de datos de la universidad.
 * @description Incluye transacciones para operaciones atómicas como inscripciones y actualizaciones de promedio.
 * @author Sebastian Ramirez
 */

/**
 * Inscribir un estudiante en una materia y actualizar su promedio en una transacción.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @param {number} notaFinal - Nota final (opcional).
 */
function inscribirYActualizarPromedio(codigoEstudiante, codigoMateria, periodo, notaFinal = null) {
  const session = db.getMongo().startSession();
  session.startTransaction();
  try {
    const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante }, { session });
    const materia = db.materias.findOne({ codigo: codigoMateria }, { session });
    if (!estudiante || !materia) {
      throw new Error(`Estudiante ${codigoEstudiante} o materia ${codigoMateria} no encontrado(s)`);
    }
    if (!verificarPrerrequisitos(materia._id, estudiante._id)) {
      throw new Error("Prerrequisitos no cumplidos");
    }

    // Insertar inscripción
    db.inscripciones.insertOne({
      estudiante_id: estudiante._id,
      materia_id: materia._id,
      periodo: periodo,
      estado: notaFinal ? (notaFinal >= 3.0 ? "Aprobado" : "Reprobado") : "Inscrito",
      nota_final: notaFinal
    }, { session });

    // Actualizar materias_cursadas y promedio_acumulado
    if (notaFinal) {
      db.estudiantes.updateOne(
        { codigo: codigoEstudiante },
        {
          $push: {
            materias_cursadas: {
              materia_id: materia._id,
              codigo: materia.codigo,
              nombre: materia.nombre,
              periodo: periodo,
              nota_final: notaFinal,
              creditos: materia.creditos
            }
          }
        },
        { session }
      );
      const notas = db.estudiantes.findOne({ codigo: codigoEstudiante }, { session }).materias_cursadas;
      const promedio = notas.length > 0
        ? notas.reduce((sum, m) => sum + m.nota_final, 0) / notas.length
        : 0;
      db.estudiantes.updateOne(
        { codigo: codigoEstudiante },
        { $set: { promedio_acumulado: promedio } },
        { session }
      );
    }

    session.commitTransaction();
    print(`Inscripción y actualización exitosa para ${codigoEstudiante} en ${codigoMateria}`);
  } catch (e) {
    session.abortTransaction();
    print(`Error en transacción: ${e}`);
  } finally {
    session.endSession();
  }
}

// Ejemplo: Inscribir estudiante con nota
inscribirYActualizarPromedio("EST002", "MAT005", "2024-2", 4.3);

// Ejemplo: Inscribir estudiante sin nota
inscribirYActualizarPromedio("EST003", "MAT006", "2024-2");

print("Transacciones completadas exitosamente");