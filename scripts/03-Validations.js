/**
 * @fileoverview Script para validaciones personalizadas en la base de datos de la universidad.
 * @description Incluye funciones para verificar unicidad, correos electrónicos y relaciones entre colecciones.
 * @author Sebastian Ramirez
 */

/**
 * Verifica si un código es único en una colección.
 * @param {string} coleccion - Nombre de la colección (ej. "estudiantes", "programas").
 * @param {string} codigo - Código a verificar.
 * @returns {boolean} - True si el código es único, false si ya existe.
 */
function esCodigoUnico(coleccion, codigo) {
  const count = db[coleccion].countDocuments({ codigo: codigo });
  if (count > 0) {
    print(`Error: El código ${codigo} ya existe en ${coleccion}`);
    return false;
  }
  return true;
}

/**
 * Verifica si un email es único y cumple con el formato.
 * @param {string} email - Email a verificar.
 * @param {string} coleccion - Nombre de la colección (ej. "estudiantes", "profesores").
 * @returns {boolean} - True si el email es válido y único, false si no.
 */
function esEmailValidoYUnico(email, coleccion) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    print(`Error: El email ${email} no tiene un formato válido`);
    return false;
  }
  const count = db[coleccion].countDocuments({ email: email });
  if (count > 0) {
    print(`Error: El email ${email} ya existe en ${coleccion}`);
    return false;
  }
  return true;
}

/**
 * Verifica si un programa existe antes de asignarlo a un estudiante.
 * @param {ObjectId} programaId - ID del programa.
 * @returns {boolean} - True si el programa existe, false si no.
 */
function existePrograma(programaId) {
  const count = db.programas.countDocuments({ _id: programaId });
  if (count === 0) {
    print(`Error: El programa con ID ${programaId} no existe`);
    return false;
  }
  return true;
}

/**
 * Verifica si una materia existe y sus prerrequisitos están aprobados por un estudiante.
 * @param {ObjectId} materiaId - ID de la materia.
 * @param {ObjectId} estudianteId - ID del estudiante.
 * @returns {boolean} - True si la materia existe y los prerrequisitos están aprobados, false si no.
 */
function verificarPrerrequisitos(materiaId, estudianteId) {
  const materia = db.materias.findOne({ _id: materiaId });
  if (!materia) {
    print(`Error: La materia con ID ${materiaId} no existe`);
    return false;
  }
  const prerrequisitos = materia.prerrequisitos || [];
  for (let prereqId of prerrequisitos) {
    const inscripcion = db.inscripciones.findOne({
      estudiante_id: estudianteId,
      materia_id: prereqId,
      estado: "Aprobado"
    });
    if (!inscripcion) {
      const prereq = db.materias.findOne({ _id: prereqId });
      print(`Error: El estudiante no ha aprobado el prerrequisito ${prereq.nombre}`);
      return false;
    }
  }
  return true;
}

// Ejemplo de uso: Validar antes de insertar un estudiante
function validarEstudianteAntesDeInsertar(estudiante) {
  if (!esCodigoUnico("estudiantes", estudiante.codigo)) return false;
  if (!esEmailValidoYUnico(estudiante.email, "estudiantes")) return false;
  if (!existePrograma(estudiante.programa.id)) return false;
  return true;
}

// Ejemplo: Validar un estudiante
const estudianteEjemplo = {
  codigo: "EST021",
  nombre: "Ejemplo Estudiante",
  email: "ejemplo.estudiante@universidad.edu.co",
  programa: { id: db.programas.findOne({ codigo: "PROG001" })._id, nombre: "Ingeniería de Software" },
  semestre_actual: 1,
  promedio_acumulado: 0
};
if (validarEstudianteAntesDeInsertar(estudianteEjemplo)) {
  db.estudiantes.insertOne(estudianteEjemplo);
  print("Estudiante de ejemplo insertado exitosamente");
} else {
  print("Validación fallida para el estudiante de ejemplo");
}

// Ejemplo: Validar prerrequisitos antes de inscribir
function inscribirEstudianteMateria(codigoEstudiante, codigoMateria, periodo) {
  const estudiante = db.estudiantes.findOne({ codigo: codigoEstudiante });
  const materia = db.materias.findOne({ codigo: codigoMateria });
  if (!estudiante || !materia) {
    print(`Error: Estudiante ${codigoEstudiante} o materia ${codigoMateria} no encontrado(s)`);
    return;
  }
  if (verificarPrerrequisitos(materia._id, estudiante._id)) {
    db.inscripciones.insertOne({
      estudiante_id: estudiante._id,
      materia_id: materia._id,
      periodo: periodo,
      estado: "Inscrito",
      nota_final: null
    });
    print(`Inscripción exitosa para ${codigoEstudiante} en ${codigoMateria}`);
  }
}
inscribirEstudianteMateria("EST001", "MAT002", "2024-2");

print("Validaciones completadas exitosamente");