/**
 * @fileoverview Script para validaciones personalizadas en la base de datos de la universidad.
 * @description Incluye funciones para verificar unicidad, correos electrónicos y relaciones entre colecciones.
 * @author Sebastian Ramirez
 */

/**
 * @function esCodigoUnico
 * @description Verifica si un código (ej. de estudiante o materia) es único en una colección.
 * @param {string} coleccion - Nombre de la colección (ej. "estudiantes", "materias").
 * @param {string} codigo - Código a verificar.
 * @returns {boolean} - True si el código es único, false si ya existe.
 */
function esCodigoUnico(coleccion, codigo) {
    const count = db[coleccion].countDocuments({ codigo: codigo });
    if (count > 0) {
        print(`Error: El código ${codigo} ya existe en ${coleccion}.`);
        return false;
    }
    return true;
}

/**
 * @function esEmailInstitucionalValidoYUnico
 * @description Verifica si un email es único y cumple con el formato institucional (@unal.edu.co).
 * @param {string} email - Email a verificar.
 * @param {string} coleccion - Nombre de la colección (ej. "estudiantes", "profesores").
 * @returns {boolean} - True si el email es válido y único, false si no.
 */
function esEmailInstitucionalValidoYUnico(email, coleccion) {
    // Usamos el patrón específico de nuestro schema
    const emailRegex = new RegExp(".*@unal\\.edu\\.co$"); 
    if (!emailRegex.test(email)) {
        print(`Error: El email ${email} no cumple con el formato institucional (@unal.edu.co).`);
        return false;
    }
    // Nota: El campo de email en estudiantes es 'email_institucional'
    const count = db[coleccion].countDocuments({ email_institucional: email }); 
    if (count > 0) {
        print(`Error: El email ${email} ya está registrado en ${coleccion}.`);
        return false;
    }
    return true;
}

/**
 * @function verificarPrerrequisitos
 * @description Verifica si una materia existe y si el estudiante ha aprobado todos sus prerrequisitos.
 * @param {string} codigoMateria - Código de la materia a inscribir.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @returns {boolean} - True si la materia existe y todos los prerrequisitos están aprobados, false si no.
 */
function verificarPrerrequisitos(codigoMateria, codigoEstudiante) {
    const materia = db.materias.findOne({ codigo: codigoMateria });
    if (!materia) {
        print(`Error: La materia con código ${codigoMateria} no existe.`);
        return false;
    }

    const prerrequisitos = materia.prerrequisitos || [];
    
    // Si no hay prerrequisitos, la validación pasa
    if (prerrequisitos.length === 0) {
        return true;
    }

    // Recorrer cada prerrequisito
    for (let prereqCod of prerrequisitos) {
        // Buscar la inscripción aprobada del prerrequisito
        const inscripcionAprobada = db.inscripciones.findOne({
            estudiante_codigo: codigoEstudiante,
            materia_codigo: prereqCod,
            estado_materia: "Aprobada" // Usamos "Aprobada" según nuestro schema
        });

        if (!inscripcionAprobada) {
            print(`Error: El estudiante ${codigoEstudiante} no ha aprobado el prerrequisito ${prereqCod}.`);
            return false;
        }
    }
    return true;
}

/**
 * @function validarInscripcionUnica
 * @description Verifica que un estudiante no esté cursando o haya cursado ya una materia en un período.
 * @param {string} codigoEstudiante - Código del estudiante.
 * @param {string} codigoMateria - Código de la materia.
 * @param {string} periodo - Período académico.
 * @returns {boolean} - True si es posible inscribirse, false si ya existe una inscripción activa o finalizada.
 */
function validarInscripcionUnica(codigoEstudiante, codigoMateria, periodo) {
    // 1. Ya cursada o aprobada (lógica: no puede inscribirla de nuevo si ya la tiene aprobada)
    const yaAprobada = db.inscripciones.countDocuments({
        estudiante_codigo: codigoEstudiante,
        materia_codigo: codigoMateria,
        estado_materia: "Aprobada"
    });

    if (yaAprobada > 0) {
        print(`Error: El estudiante ${codigoEstudiante} ya aprobó la materia ${codigoMateria}.`);
        return false;
    }

    // 2. Ya inscrita y Cursando en el periodo actual
    const yaInscrita = db.inscripciones.countDocuments({
        estudiante_codigo: codigoEstudiante,
        materia_codigo: codigoMateria,
        periodo: periodo,
        estado_materia: "Cursando"
    });
    
    if (yaInscrita > 0) {
        print(`Error: El estudiante ${codigoEstudiante} ya está cursando ${codigoMateria} en el período ${periodo}.`);
        return false;
    }

    return true;
}

