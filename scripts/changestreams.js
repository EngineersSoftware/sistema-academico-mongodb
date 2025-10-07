const changeStreamEstudiantes = db.estudiantes.watch();
changeStreamEstudiantes.on("change", function(change) {
  const auditoria = {
    fecha: new Date(),
    operacion: change.operationType,
    coleccion: "estudiantes",
    documento_id: change.documentKey._id,
    cambios: change.updateDescription || {},
    usuario: "sistema"
  };
  db.auditoria.insertOne(auditoria);
  print("Auditoría registrada: " + change.operationType);
});

const changeStreamRiesgo = db.estudiantes.watch([{ $match: { operationType: "update", "updateDescription.updatedFields.promedio_acumulado": { $lt: 3.0 } } }]);
changeStreamRiesgo.on("change", function(change) {
  print("Alerta: Estudiante " + change.documentKey._id + " en riesgo académico");
});

const changeStreamAprobacion = db.inscripciones.watch([{ $match: { operationType: "update", "updateDescription.updatedFields.estado": "Aprobado" } }]);
changeStreamAprobacion.on("change", function(change) {
  const insc = db.inscripciones.findOne({ _id: change.documentKey._id });
  const mat = db.materias.findOne({ _id: insc.materia_id });
  db.estudiantes.updateOne({ _id: insc.estudiante_id }, { $inc: { creditos_cursados: mat.creditos } });
  print("Créditos actualizados para estudiante " + insc.estudiante_id);
});

const changeStreamCupos = db.inscripciones.watch([{ $match: { operationType: "insert" } }]);
changeStreamCupos.on("change", function(change) {
  const doc = change.fullDocument;
  const count = db.inscripciones.countDocuments({ materia_id: doc.materia_id, periodo: doc.periodo });
  if (count > 30) {
    db.inscripciones.deleteOne({ _id: doc._id });
    print("Cupo excedido para materia " + doc.materia_id + ", inscripción revertida");
  }
});

const changeStreamCalif = db.inscripciones.watch([{ $match: { operationType: "update", "updateDescription.updatedFields.calificacion": { $exists: true } } }]);
changeStreamCalif.on("change", function(change) {
  db.historial_calif.insertOne({
    inscripcion_id: change.documentKey._id,
    old_calif: change.updateDescription.removedFields ? change.updateDescription.removedFields.calificacion : null,
    new_calif: change.updateDescription.updatedFields.calificacion,
    fecha: new Date()
  });
  print("Cambio de calificación registrado");
});