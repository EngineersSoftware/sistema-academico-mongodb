/**
 * @fileoverview Script para crear colecciones en la base de datos de la universidad.
 * @description Crea las colecciones programas, materias, profesores, estudiantes e inscripciones con esquemas de validación.
 * @author Andres Hernandez
 */

// Limpiar la base de datos
db.dropDatabase();

// Crear colección programas
db.createCollection("programas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos_totales"],
      properties: {
        codigo: { bsonType: "string", description: "Código único del programa - requerido" },
        nombre: { bsonType: "string", description: "Nombre del programa - requerido" },
        creditos_totales: { bsonType: "int", minimum: 0, description: "Créditos totales del programa - requerido" }
      }
    }
  }
});

// Crear colección materias
db.createCollection("materias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "creditos", "prerrequisitos"],
      properties: {
        codigo: { bsonType: "string", description: "Código único de la materia - requerido" },
        nombre: { bsonType: "string", description: "Nombre de la materia - requerido" },
        creditos: { bsonType: "int", minimum: 0, description: "Créditos de la materia - requerido" },
        prerrequisitos: { bsonType: "array", items: { bsonType: "objectId" }, description: "Lista de IDs de materias prerrequisito" }
      }
    }
  }
});

// Crear colección profesores
db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "email", "especialidades", "materias_asignadas"],
      properties: {
        codigo: { bsonType: "string", description: "Código único del profesor - requerido" },
        nombre: { bsonType: "string", description: "Nombre completo - requerido" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "Email institucional válido" },
        especialidades: { bsonType: "array", items: { bsonType: "string" }, description: "Lista de especialidades" },
        materias_asignadas: { bsonType: "array", items: { bsonType: "objectId" }, description: "Lista de IDs de materias asignadas" }
      }
    }
  }
});

// Crear colección estudiantes
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
            id: { bsonType: "objectId", description: "ID del programa - requerido" },
            nombre: { bsonType: "string", description: "Nombre del programa - requerido" }
          }
        },
        semestre_actual: { bsonType: "int", minimum: 1, maximum: 12, description: "Semestre actual del estudiante" },
        promedio_acumulado: { bsonType: "double", minimum: 0.0, maximum: 5.0, description: "Promedio acumulado del estudiante" }
      }
    }
  }
});

// Crear colección inscripciones
db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudiante_id", "materia_id", "periodo", "estado"],
      properties: {
        estudiante_id: { bsonType: "objectId", description: "ID del estudiante - requerido" },
        materia_id: { bsonType: "objectId", description: "ID de la materia - requerido" },
        periodo: { bsonType: "string", description: "Período académico - requerido" },
        estado: { enum: ["Inscrito", "Aprobado", "Reprobado", "Retirado"], description: "Estado de la inscripción - requerido" },
        nota_final: { bsonType: ["double", "null"], minimum: 0.0, maximum: 5.0, description: "Nota final, si aplica" }
      }
    }
  }
});

print("Colecciones creadas exitosamente");