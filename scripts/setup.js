db.createCollection("programas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos_totales", "semestres", "requisitos_graduacion"],
      properties: {
        codigo: { bsonType: "string", description: "Código único del programa - requerido" },
        nombre: { bsonType: "string", description: "Nombre del programa - requerido" },
        creditos_totales: { bsonType: "int", minimum: 100, maximum: 200, description: "Créditos totales requeridos" },
        semestres: { bsonType: "int", minimum: 8, maximum: 12, description: "Número de semestres" },
        requisitos_graduacion: { bsonType: "array", items: { bsonType: "string" }, description: "Requisitos como 'proyecto de grado'" },
        plan_estudio: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["semestre", "materias"],
            properties: {
              semestre: { bsonType: "int", minimum: 1, maximum: 12 },
              materias: { bsonType: "array", items: { bsonType: "objectId" } }
            }
          }
        }
      }
    }
  }
});

db.createCollection("materias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos", "prerrequisitos"],
      properties: {
        codigo: { bsonType: "string", description: "Código único de la materia - requerido" },
        nombre: { bsonType: "string", description: "Nombre de la materia - requerido" },
        creditos: { bsonType: "int", minimum: 1, maximum: 6, description: "Créditos de la materia" },
        prerrequisitos: { bsonType: "array", items: { bsonType: "string" }, description: "Códigos de prerrequisitos" },
        contenido: { bsonType: "string", description: "Descripción programática" },
        tipo: { enum: ["Obligatoria", "Electiva", "Fundamentación"], description: "Tipo de materia" }
      }
    }
  }
});

db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "email", "programa"],
      properties: {
        codigo: { bsonType: "string", description: "Código único del estudiante - requerido" },
        nombre: { bsonType: "string", description: "Nombre completo - requerido" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "Email institucional válido" },
        programa: {
          bsonType: "object",
          required: ["id", "nombre"],
          properties: {
            id: { bsonType: "objectId" },
            nombre: { bsonType: "string" }
          }
        },
        fecha_nacimiento: { bsonType: "date", description: "Fecha de nacimiento válida" },
        semestre_actual: { bsonType: "int", minimum: 1, maximum: 12, description: "Semestre actual" },
        promedio_acumulado: { bsonType: "double", minimum: 0.0, maximum: 5.0, description: "Promedio acumulado" },
        estado: { enum: ["Activo", "Inactivo", "Graduado", "Retirado"], description: "Estado válido del estudiante" },
        materias_cursadas: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["materia_id", "codigo", "nombre", "periodo", "nota_final", "creditos"],
            properties: {
              materia_id: { bsonType: "objectId" },
              codigo: { bsonType: "string" },
              nombre: { bsonType: "string" },
              periodo: { bsonType: "string" },
              nota_final: { bsonType: "double", minimum: 0.0, maximum: 5.0 },
              creditos: { bsonType: "int", minimum: 1, maximum: 6 }
            }
          }
        },
        creditos_cursados: { bsonType: "int", minimum: 0 }
      }
    }
  }
});

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "email", "especialidades"],
      properties: {
        codigo: { bsonType: "string", description: "Código único del profesor - requerido" },
        nombre: { bsonType: "string", description: "Nombre completo - requerido" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "Email institucional válido" },
        especialidades: { bsonType: "array", items: { bsonType: "string" }, description: "Áreas de expertise" },
        materias_asignadas: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["materia_id", "periodo"],
            properties: {
              materia_id: { bsonType: "objectId" },
              periodo: { bsonType: "string" },
              horario: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudiante_id", "materia_id", "periodo", "estado"],
      properties: {
        estudiante_id: { bsonType: "objectId", description: "Referencia al estudiante" },
        materia_id: { bsonType: "objectId", description: "Referencia a la materia" },
        periodo: { bsonType: "string", description: "Período académico (e.g., '2025-1')" },
        fecha_inscripcion: { bsonType: "date" },
        estado: { enum: ["Inscrito", "Cursando", "Aprobado", "Reprobado", "Retirado"], description: "Estado válido" },
        calificacion: { bsonType: "double", minimum: 0.0, maximum: 5.0, description: "Calificación final (opcional hasta fin de período)" }
      }
    }
  }
});

db.createCollection("auditoria");
db.createCollection("historial_calif");

db.estudiantes.createIndex({ codigo: 1 }, { unique: true });
db.profesores.createIndex({ codigo: 1 }, { unique: true });
db.materias.createIndex({ codigo: 1 }, { unique: true });
db.programas.createIndex({ codigo: 1 }, { unique: true });
db.inscripciones.createIndex({ estudiante_id: 1, materia_id: 1, periodo: 1 }, { unique: true });
