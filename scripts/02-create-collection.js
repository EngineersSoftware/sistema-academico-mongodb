/**
 * @fileoverview Script para crear colecciones en la base de datos de la universidad.
 * @description Crea las colecciones programas, materias, profesores, estudiantes e inscripciones con esquemas de validación.
 * @author Andres Hernandez
 */

// Limpiar la base de datos
db.dropDatabase();

// Crear colección estudiantes
// Eliminar la colección si existe (opcional, pero útil para scripts limpios)
db.estudiantes.drop();

// Crear la colección con la validación
db.createCollection("estudiantes", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'codigo',
                'nombre',
                'email_institucional',
                'fecha_nacimiento',
                'semestre_actual',
                'programa_codigo',
                'estado',
                'promedio_acumulado',
                'creditos_cursados'
            ],
            properties: {
                codigo: {
                    bsonType: 'string',
                    description: 'Código único del estudiante (ej: E001).',
                    minLength: 4
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre completo del estudiante.'
                },
                email_institucional: {
                    bsonType: 'string',
                    description: 'Correo electrónico institucional.',
                    pattern: '@unal\\.edu\\.co$'
                },
                fecha_nacimiento: {
                    bsonType: 'date',
                    description: 'Fecha de nacimiento.'
                },
                semestre_actual: {
                    bsonType: 'int',
                    description: 'Semestre que cursa actualmente (mínimo 1, máximo 12).',
                    minimum: 1,
                    maximum: 12
                },
                programa_codigo: {
                    bsonType: 'string',
                    description: 'Código del programa académico.'
                },
                estado: {
                    bsonType: 'string',
                    description: 'Estado académico del estudiante.',
                    enum: ['Activo', 'Inactivo', 'Retirado', 'Graduado']
                },
                promedio_acumulado: {
                    bsonType: 'double', 
                    description: 'Promedio general acumulado (rango 0.0 a 5.0).',
                    minimum: 0.0,
                    maximum: 5.0
                },
                creditos_cursados: {
                    bsonType: 'int',
                    description: 'Total de créditos cursados. Mínimo 0.',
                    minimum: 0
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

// Crear colección materias
// De esta manera se elimina la colección si existe
db.materias.drop();

db.createCollection("materias", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'codigo',
                'nombre',
                'creditos',
                'programa_codigo'
            ],
            properties: {
                codigo: {
                    bsonType: 'string',
                    description: 'Código de la materia (ej: BBDD-002).'
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre completo de la materia.'
                },
                creditos: {
                    bsonType: 'int',
                    description: 'Número de créditos académicos (mínimo 1).',
                    minimum: 1
                },
                prerrequisitos: {
                    bsonType: 'array',
                    description: 'Lista de códigos de materias prerrequisito.'
                },
                programa_codigo: {
                    bsonType: 'string',
                    description: 'Código del programa al que pertenece la materia.'
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});


// Crear colección profesores
// De esta manera se elimina la colección si existe
db.profesores.drop();

db.createCollection("profesores", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'codigo',
                'nombre',
                'especialidad'
            ],
            properties: {
                codigo: {
                    bsonType: 'string',
                    description: 'Código único del profesor (ej: P001).'
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre completo del profesor.'
                },
                especialidad: {
                    bsonType: 'string',
                    description: 'Área principal de especialidad.'
                },
                materias_asignadas: {
                    bsonType: 'array',
                    description: 'Lista de materias que dicta en el período actual.',
                    items: {
                        bsonType: 'object',
                        required: ['materia_codigo', 'periodo'],
                        properties: {
                            materia_codigo: {
                                bsonType: 'string'
                            },
                            periodo: {
                                bsonType: 'string'
                            }
                        }
                    }
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});


// Crear colección inscripciones
// De esta manera se elimina la colección si existe
db.inscripciones.drop();

db.createCollection("inscripciones", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'estudiante_codigo',
                'materia_codigo',
                'periodo',
                'fecha_inscripcion',
                'estado_materia'
            ],
            properties: {
                estudiante_codigo: {
                    bsonType: 'string',
                    description: 'Código del estudiante (referencia a estudiantes.codigo).'
                },
                materia_codigo: {
                    bsonType: 'string',
                    description: 'Código de la materia (referencia a materias.codigo).'
                },
                periodo: {
                    bsonType: 'string',
                    description: 'Período académico (ej: \'2024-2\').'
                },
                fecha_inscripcion: {
                    bsonType: 'date',
                    description: 'Fecha en la que se realizó la inscripción.'
                },
                estado_materia: {
                    bsonType: 'string',
                    enum: [
                        'Cursando',
                        'Aprobada',
                        'Reprobada',
                        'Retirada'
                    ],
                    description: 'Estado final del estudiante en la materia.'
                },
                calificacion_final: {
                    bsonType: [
                        'double',
                        'null'
                    ],
                    minimum: 0,
                    maximum: 5,
                    description: 'Nota final. Rango 0.0 a 5.0.'
                },
                calificaciones: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        properties: {
                            tipo: {
                                bsonType: 'string'
                            },
                            porcentaje: {
                                bsonType: 'int',
                                minimum: 1,
                                maximum: 100
                            },
                            nota: {
                                bsonType: 'double',
                                minimum: 0,
                                maximum: 5
                            }
                        }
                    },
                    description: 'Detalle de calificaciones parciales.'
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});