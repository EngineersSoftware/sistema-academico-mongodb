// FUNCIONES CRUD PARA ESTUDIANTES
// CREATE: Insertar nuevo estudiante
function createEstudiante(data) {
  if (!db.programas.findOne({ _id: data.programa.id })) return { error: "Programa no existe" };
  return db.estudiantes.insertOne(data);
}

// READ: Consultar estudiantes con filtro (e.g., por estado)
function readEstudiantes(filtro) {
  return db.estudiantes.find(filtro).toArray();
}

// UPDATE: Actualizar promedio de estudiante
function updateEstudiante(codigo, nuevosDatos) {
  return db.estudiantes.updateOne({ codigo: codigo }, { $set: nuevosDatos });
}

// DELETE: Eliminar estudiante (solo si inactivo)
function deleteEstudiante(codigo) {
  const est = db.estudiantes.findOne({ codigo: codigo });
  if (est && est.estado !== "Inactivo") return { error: "Solo eliminar inactivos" };
  return db.estudiantes.deleteOne({ codigo: codigo });
}

// FUNCIONES CRUD PARA PROFESORES
// CREATE: Insertar nuevo profesor
function createProfesor(data) {
  return db.profesores.insertOne(data);
}

// READ: Consultar profesores por especialidad
function readProfesores(especialidad) {
  return db.profesores.find({ especialidades: especialidad }).toArray();
}

// UPDATE: Agregar materia asignada
function updateProfesor(codigo, nuevaMateria) {
  return db.profesores.updateOne({ codigo: codigo }, { $push: { materias_asignadas: nuevaMateria } });
}

// DELETE: Eliminar profesor (si no tiene materias asignadas)
function deleteProfesor(codigo) {
  const prof = db.profesores.findOne({ codigo: codigo });
  if (prof && prof.materias_asignadas.length > 0) return { error: "No eliminar con materias asignadas" };
  return db.profesores.deleteOne({ codigo: codigo });
}

// FUNCIONES CRUD PARA MATERIAS
// CREATE: Insertar nueva materia
function createMateria(data) {
  return db.materias.insertOne(data);
}

// READ: Consultar materias por tipo
function readMaterias(tipo) {
  return db.materias.find({ tipo: tipo }).toArray();
}

// UPDATE: Actualizar prerrequisitos
function updateMateria(codigo, nuevosPrerreq) {
  return db.materias.updateOne({ codigo: codigo }, { $set: { prerrequisitos: nuevosPrerreq } });
}

// DELETE: Eliminar materia (si no referenciada en inscripciones)
function deleteMateria(codigo) {
  const count = db.inscripciones.countDocuments({ "materia_id": db.materias.findOne({ codigo: codigo })._id });
  if (count > 0) return { error: "No eliminar si hay inscripciones" };
  return db.materias.deleteOne({ codigo: codigo });
}

// FUNCIONES CRUD PARA PROGRAMAS
// CREATE: Insertar nuevo programa
function createPrograma(data) {
  return db.programas.insertOne(data);
}

// READ: Consultar todos los programas
function readProgramas() {
  return db.programas.find().toArray();
}

// UPDATE: Agregar requisito de graduación
function updatePrograma(codigo, nuevoReq) {
  return db.programas.updateOne({ codigo: codigo }, { $push: { requisitos_graduacion: nuevoReq } });
}

// DELETE: Eliminar programa (si no hay estudiantes)
function deletePrograma(codigo) {
  const count = db.estudiantes.countDocuments({ "programa.id": db.programas.findOne({ codigo: codigo })._id });
  if (count > 0) return { error: "No eliminar si hay estudiantes" };
  return db.programas.deleteOne({ codigo: codigo });
}

// FUNCIONES CRUD PARA INSCRIPCIONES
// CREATE: Inscribir estudiante
function inscribirEstudiante(codigoEstudiante, codigoMateria, periodo) {
  const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
  if (!estudiante) return { error: "Estudiante no encontrado" };
  const materia = db.materias.findOne({ codigo: codigoMateria });
  if (!materia) return { error: "Materia no encontrada" };
  const resultado = db.inscripciones.insertOne({
    estudiante_id: estudiante._id,
    materia_id: materia._id,
    periodo: periodo,
    fecha_inscripcion: new Date(),
    estado: "Inscrito"
  });
  return { success: true, mensaje: "Inscripción realizada exitosamente" };
}

// READ: Consultar inscripciones por período
function readInscripciones(periodo) {
  return db.inscripciones.find({ periodo: periodo }).toArray();
}

// UPDATE: Actualizar estado y calificación
function updateInscripcion(id, nuevoEstado, calif) {
  return db.inscripciones.updateOne({ _id: id }, { $set: { estado: nuevoEstado, calificacion: calif } });
}

// DELETE: Eliminar inscripción (solo si no aprobado)
function deleteInscripcion(id) {
  const insc = db.inscripciones.findOne({ _id: id });
  if (insc && insc.estado === "Aprobado") return { error: "No se puede eliminar aprobada" };
  return db.inscripciones.deleteOne({ _id: id });
}