function inscribirMultiples(codigoEstudiante, codigosMaterias, periodo) {
  const session = db.getMongo().startSession();
  session.startTransaction();
  try {
    const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
    if (!estudiante) throw "Estudiante no encontrado";
    let creditosNuevos = 0;
    codigosMaterias.forEach(codMat => {
      const materia = db.materias.findOne({ codigo: codMat });
      if (!materia) throw "Materia no encontrada: " + codMat;
      db.inscripciones.insertOne({
        estudiante_id: estudiante._id,
        materia_id: materia._id,
        periodo: periodo,
        fecha_inscripcion: new Date(),
        estado: "Inscrito"
      }, { session });
      creditosNuevos += materia.creditos;
    });
    db.estudiantes.updateOne({ _id: estudiante._id }, { $inc: { creditos_cursados: creditosNuevos } }, { session });
    session.commitTransaction();
    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return { error: error };
  } finally {
    session.endSession();
  }
}

function registrarCalificacion(inscId, nuevaCalif) {
  const session = db.getMongo().startSession();
  session.startTransaction();
  try {
    const insc = db.inscripciones.findOne({ _id: inscId });
    if (!insc) throw "Inscripción no encontrada";
    const estado = nuevaCalif >= 3.0 ? "Aprobado" : "Reprobado";
    db.inscripciones.updateOne({ _id: inscId }, { $set: { calificacion: nuevaCalif, estado: estado } }, { session });
    const hist = db.estudiantes.findOne({ _id: insc.estudiante_id }).materias_cursadas;
    const notas = hist.map(m => m.nota_final);
    notas.push(nuevaCalif);
    const avg = notas.reduce((a, b) => a + b, 0) / notas.length;
    db.estudiantes.updateOne({ _id: insc.estudiante_id }, { $set: { promedio_acumulado: avg } }, { session });
    if (estado === "Aprobado") {
      const mat = db.materias.findOne({ _id: insc.materia_id });
      db.estudiantes.updateOne({ _id: insc.estudiante_id }, { $push: { materias_cursadas: { materia_id: mat._id, codigo: mat.codigo, nombre: mat.nombre, periodo: insc.periodo, nota_final: nuevaCalif, creditos: mat.creditos } } }, { session });
    }
    session.commitTransaction();
    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return { error: error };
  } finally {
    session.endSession();
  }
}

function retirarMateria(inscId) {
  const session = db.getMongo().startSession();
  session.startTransaction();
  try {
    const insc = db.inscripciones.findOne({ _id: inscId });
    if (!insc || insc.estado === "Aprobado") throw "No se puede retirar";
    const mat = db.materias.findOne({ _id: insc.materia_id });
    db.inscripciones.updateOne({ _id: inscId }, { $set: { estado: "Retirado" } }, { session });
    db.estudiantes.updateOne({ _id: insc.estudiante_id }, { $inc: { creditos_cursados: -mat.creditos } }, { session });
    session.commitTransaction();
    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return { error: error };
  } finally {
    session.endSession();
  }
}

function graduarEstudiante(codigo) {
  const session = db.getMongo().startSession();
  session.startTransaction();
  try {
    const est = db.estudiantes.findOne({ codigo: codigo });
    if (!est || est.estado !== "Activo" || est.creditos_cursados < db.programas.findOne({ _id: est.programa.id }).creditos_totales) throw "No cumple requisitos";
    db.estudiantes.updateOne({ codigo: codigo }, { $set: { estado: "Graduado" } }, { session });
    session.commitTransaction();
    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return { error: error };
  } finally {
    session.endSession();
  }
}