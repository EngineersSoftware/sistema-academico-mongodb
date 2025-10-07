/**
 * @fileoverview Script con funciones CRUD para la base de datos de la universidad.
 * @description Proporciona funciones para crear, leer, actualizar y eliminar documentos en todas las colecciones.
 * @author Sebastian Ramirez
 */

/**
 * Crear un nuevo programa.
 * @param {Object} programa - Objeto con datos del programa.
 * @returns {Object} Resultado de la inserción.
 */
function crearPrograma(programa) {
  if (!esCodigoUnico("programas", programa.codigo)) return null;
  return db.programas.insertOne(programa);
}

/**
 * Leer un programa por código.
 * @param {string} codigo - Código del programa.
 * @returns {Object} Documento del programa.
 */
function leerPrograma(codigo) {
  return db.programas.findOne({ codigo: codigo });
}

/**
 * Actualizar créditos totales de un programa.
 * @param {string} codigo - Código del programa.
 * @param {number} creditos - Nuevos créditos totales.
 * @returns {Object} Resultado de la actualización.
 */
function actualizarCreditosPrograma(codigo, creditos) {
  return db.programas.updateOne(
    { codigo: codigo },
    { $set: { creditos_totales: creditos } }
  );
}

/**
 * Eliminar un programa por código.
 * @param {string} codigo - Código del programa.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarPrograma(codigo) {
  return db.programas.deleteOne({ codigo: codigo });
}

/**
 * Crear un nuevo estudiante.
 * @param {Object} estudiante - Objeto con datos del estudiante.
 * @returns {Object} Resultado de la inserción.
 */
function crearEstudiante(estudiante) {
  if (!validarEstudianteAntesDeInsertar(estudiante)) return null;
  return db.estudiantes.insertOne(estudiante);
}

/**
 * Leer un estudiante por código.
 * @param {string} codigo - Código del estudiante.
 * @returns {Object} Documento del estudiante.
 */
function leerEstudiante(codigo) {
  return db.estudiantes.findOne({ codigo: codigo });
}

/**
 * Actualizar el estado de un estudiante.
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
 * Eliminar un estudiante por código.
 * @param {string} codigo - Código del estudiante.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarEstudiante(codigo) {
  return db.estudiantes.deleteOne({ codigo: codigo });
}

/**
 * Crear una nueva inscripción.
 * @param {Object} inscripcion - Objeto con datos de la inscripción.
 * @returns {Object} Resultado de la inserción.
 */
function crearInscripcion(inscripcion) {
  if (!verificarPrerrequisitos(inscripcion.materia_id, inscripcion.estudiante_id)) return null;
  return db.inscripciones.insertOne(inscripcion);
}

/**
 * Leer inscripciones por estudiante y período.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} periodo - Período académico.
 * @returns {Array} Lista de inscripciones.
 */
function leerInscripcionesEstudiante(codigoEstudiante, periodo) {
  const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
  if (!estudiante) return [];
  return db.inscripciones.find({ estudiante_id: estudiante._id, periodo: periodo }).toArray();
}

/**
 * Actualizar la nota final de una inscripción.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @param {number} notaFinal - Nueva nota final.
 * @returns {Object} Resultado de la actualización.
 */
function actualizarNotaInscripcion(codigoEstudiante, codigoMateria, periodo, notaFinal) {
  const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
  const materia = db.materias.findOne({ codigo: codigoMateria });
  if (!estudiante || !materia) return null;
  return db.inscripciones.updateOne(
    { estudiante_id: estudiante._id, materia_id: materia._id, periodo: periodo },
    { $set: { nota_final: notaFinal, estado: notaFinal >= 3.0 ? "Aprobado" : "Reprobado" } }
  );
}

/**
 * Eliminar una inscripción.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @returns {Object} Resultado de la eliminación.
 */
function eliminarInscripcion(codigoEstudiante, codigoMateria, periodo) {
  const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
  const materia = db.materias.findOne({ codigo: codigoMateria });
  if (!estudiante || !materia) return null;
  return db.inscripciones.deleteOne({ estudiante_id: estudiante._id, materia_id: materia._id, periodo: periodo });
}

// Ejemplo de uso
try {
  // Crear un programa
  crearPrograma({ codigo: "PROG021", nombre: "Ingeniería Biomédica", creditos_totales: 160 });
  print("Programa creado: PROG021");

  // Leer un programa
  printjson(leerPrograma("PROG001"));

  // Actualizar créditos de un programa
  actualizarCreditosPrograma("PROG001", 165);
  print("Créditos de PROG001 actualizados");

  // Crear un estudiante
  const nuevoEstudiante = {
    codigo: "EST022",
    nombre: "Ana María Pérez",
    email: "ana.perez@universidad.edu.co",
    programa: { id: db.programas.findOne({ codigo: "PROG001" })._id, nombre: "Ingeniería de Software" },
    semestre_actual: 1,
    promedio_acumulado: 0,
    estado: "Activo",
    materias_cursadas: [],
    contacto: { telefono: "+57 320 123 4567", direccion: "Calle 80 #90-210, Bogotá", ciudad: "Bogotá" }
  };
  crearEstudiante(nuevoEstudiante);
  print("Estudiante creado: EST022");

  // Actualizar estado de un estudiante
  actualizarEstadoEstudiante("EST003", "Inactivo");
  print("Estado de EST003 actualizado");

  // Crear una inscripción
  const nuevaInscripcion = {
    estudiante_id: db.estudiantes.findOne({ codigo: "EST001" })._id,
    materia_id: db.materias.findOne({ codigo: "MAT004" })._id,
    periodo: "2024-2",
    estado: "Inscrito",
    nota_final: null
  };
  crearInscripcion(nuevaInscripcion);
  print("Inscripción creada para EST001 en MAT004");

  // Leer inscripciones
  printjson(leerInscripcionesEstudiante("EST001", "2024-2"));

  // Actualizar nota de inscripción
  actualizarNotaInscripcion("EST001", "MAT004", "2024-2", 4.5);
  print("Nota de inscripción actualizada para EST001 en MAT004");
} catch (e) {
  print("Error en operaciones CRUD: " + e);
}

print("Operaciones CRUD completadas exitosamente");