/**
 * @fileoverview Script para insertar datos iniciales en las colecciones.
 * @description Inserta al menos 20 documentos realistas con relaciones consistentes por colección.
 * @author Andres Hernandez
 */

db.materias.insertMany([
    { codigo: "ALG-001", nombre: "Algoritmos y Programación", creditos: 4, prerrequisitos: [], programa_codigo: "ING-SIST" },
    { codigo: "CAL-001", nombre: "Cálculo Diferencial", creditos: 3, prerrequisitos: [], programa_codigo: "ING-SIST" },
    { codigo: "BBDD-002", nombre: "Bases de Datos NoSQL", creditos: 4, prerrequisitos: ["ALG-001"], programa_codigo: "ING-SIST" },
    { codigo: "EST-001", nombre: "Estadística para Negocios", creditos: 3, prerrequisitos: [], programa_codigo: "ADMIN" },
    { codigo: "DER-010", nombre: "Introducción al Derecho", creditos: 5, prerrequisitos: [], programa_codigo: "DER" },
    { codigo: "ARQ-005", nombre: "Dibujo Arquitectónico", creditos: 3, prerrequisitos: [], programa_codigo: "ARQUI" },
    { codigo: "FISIO-1", nombre: "Fisiología Humana I", creditos: 6, prerrequisitos: ["BIO-001"], programa_codigo: "MED" },
    { codigo: "IA-601", nombre: "Aprendizaje Automático Avanzado", creditos: 4, prerrequisitos: [], programa_codigo: "M-IA" },
    { codigo: "FIN-101", nombre: "Introducción a las Finanzas", creditos: 2, prerrequisitos: [], programa_codigo: "ADMIN" },
    { codigo: "BIO-001", nombre: "Biología Celular", creditos: 4, prerrequisitos: [], programa_codigo: "BIO" },
    { codigo: "ING-C-1", nombre: "Mecánica de Suelos", creditos: 5, prerrequisitos: ["CAL-001"], programa_codigo: "ING-CIV" },
    { codigo: "COM-202", nombre: "Teorías de la Comunicación", creditos: 3, prerrequisitos: [], programa_codigo: "COM-SOC" },
    { codigo: "SALUD-800", nombre: "Epidemiología", creditos: 3, prerrequisitos: [], programa_codigo: "M-SALUD" },
    { codigo: "FILO-1", nombre: "Lógica Formal", creditos: 4, prerrequisitos: [], programa_codigo: "FILO" },
    { codigo: "QUIM-020", nombre: "Química Orgánica I", creditos: 5, prerrequisitos: ["QUIM-001"], programa_codigo: "QUIM" },
    { codigo: "IND-303", nombre: "Investigación de Operaciones", creditos: 4, prerrequisitos: ["EST-001"], programa_codigo: "ING-IND" },
    { codigo: "LENG-400", nombre: "Sintaxis Avanzada", creditos: 3, prerrequisitos: [], programa_codigo: "LENG" },
    { codigo: "CONT-105", nombre: "Principios de Contabilidad", creditos: 4, prerrequisitos: [], programa_codigo: "CONT" },
    { codigo: "PSICO-1", nombre: "Psicología General", creditos: 3, prerrequisitos: [], programa_codigo: "PSICO" },
    { codigo: "ART-201", nombre: "Historia del Arte Contemporáneo", creditos: 2, prerrequisitos: [], programa_codigo: "ARTES" }
]);

db.profesores.insertMany([
    { codigo: "P001", nombre: "Dra. Ana Bolívar", especialidad: "Algoritmos y BD", materias_asignadas: [{ materia_codigo: "ALG-001", periodo: "2024-2" }, { materia_codigo: "BBDD-002", periodo: "2024-2" }] },
    { codigo: "P002", nombre: "Mg. Luis Torres", especialidad: "Cálculo Avanzado", materias_asignadas: [{ materia_codigo: "CAL-001", periodo: "2024-2" }] },
    { codigo: "P003", nombre: "Dr. Roberto Casas", especialidad: "Derecho Constitucional", materias_asignadas: [{ materia_codigo: "DER-010", periodo: "2024-2" }] },
    { codigo: "P004", nombre: "Arq. Diana Melo", especialidad: "Diseño Urbano", materias_asignadas: [{ materia_codigo: "ARQ-005", periodo: "2024-2" }] },
    { codigo: "P005", nombre: "Dr. Javier Ríos", especialidad: "Medicina Interna", materias_asignadas: [{ materia_codigo: "FISIO-1", periodo: "2024-2" }] },
    { codigo: "P006", nombre: "Dra. Elena Ruiz", especialidad: "Machine Learning", materias_asignadas: [{ materia_codigo: "IA-601", periodo: "2024-2" }] },
    { codigo: "P007", nombre: "Mg. Fernando Castro", especialidad: "Finanzas", materias_asignadas: [{ materia_codigo: "FIN-101", periodo: "2024-2" }] },
    { codigo: "P008", nombre: "Dra. Sofía Vargas", especialidad: "Estadística", materias_asignadas: [{ materia_codigo: "EST-001", periodo: "2024-2" }] },
    { codigo: "P009", nombre: "Dr. Andrés Gómez", especialidad: "Biología Celular", materias_asignadas: [{ materia_codigo: "BIO-001", periodo: "2024-2" }] },
    { codigo: "P010", nombre: "Ing. Sara López", especialidad: "Ingeniería Civil", materias_asignadas: [{ materia_codigo: "ING-C-1", periodo: "2024-2" }] },
    { codigo: "P011", nombre: "Lic. Miguel Prada", especialidad: "Comunicación", materias_asignadas: [{ materia_codigo: "COM-202", periodo: "2024-2" }] },
    { codigo: "P012", nombre: "Dra. Clara Nieves", especialidad: "Salud Pública", materias_asignadas: [{ materia_codigo: "SALUD-800", periodo: "2024-2" }] },
    { codigo: "P013", nombre: "Dr. Daniel Reyes", especialidad: "Filosofía", materias_asignadas: [{ materia_codigo: "FILO-1", periodo: "2024-2" }] },
    { codigo: "P014", nombre: "Dra. Patricia Mora", especialidad: "Química Orgánica", materias_asignadas: [{ materia_codigo: "QUIM-020", periodo: "2024-2" }] },
    { codigo: "P015", nombre: "Ing. Roberto Sanz", especialidad: "Investigación de Operaciones", materias_asignadas: [{ materia_codigo: "IND-303", periodo: "2024-2" }] },
    { codigo: "P016", nombre: "Mg. Isabel Velez", especialidad: "Lingüística", materias_asignadas: [{ materia_codigo: "LENG-400", periodo: "2024-2" }] },
    { codigo: "P017", nombre: "Cont. Carlos Diaz", especialidad: "Contabilidad", materias_asignadas: [{ materia_codigo: "CONT-105", periodo: "2024-2" }] },
    { codigo: "P018", nombre: "Dr. Mario Giraldo", especialidad: "Psicología Clínica", materias_asignadas: [{ materia_codigo: "PSICO-1", periodo: "2024-2" }] },
    { codigo: "P019", nombre: "Lic. Andrea Rojas", especialidad: "Arte Moderno", materias_asignadas: [{ materia_codigo: "ART-201", periodo: "2024-2" }] },
    { codigo: "P020", nombre: "Dr. German Ortiz", especialidad: "Matemáticas Puras", materias_asignadas: [{ materia_codigo: "CAL-001", periodo: "2023-2" }] }
]);

db.estudiantes.insertMany([
    { codigo: "E001", nombre: "Carlos Pérez", email_institucional: "carlos.perez@unal.edu.co", fecha_nacimiento: new Date("2003-05-15"), semestre_actual: 5, programa_codigo: "ING-SIST", estado: "Activo", promedio_acumulado: Double(4.2), creditos_cursados: 60 },
    { codigo: "E002", nombre: "María López", email_institucional: "maria.lopez@unal.edu.co", fecha_nacimiento: new Date("2002-11-20"), semestre_actual: 7, programa_codigo: "ING-SIST", estado: "Activo", promedio_acumulado: Double(3.85), creditos_cursados: 85 },
    { codigo: "E003", nombre: "Juan Gómez", email_institucional: "juan.gomez@unal.edu.co", fecha_nacimiento: new Date("2001-08-01"), semestre_actual: 12, programa_codigo: "ADMIN", estado: "Activo", promedio_acumulado: Double(4.5), creditos_cursados: 140 },
    { codigo: "E004", nombre: "Laura Díaz", email_institucional: "laura.diaz@unal.edu.co", fecha_nacimiento: new Date("2004-03-22"), semestre_actual: 1, programa_codigo: "DER", estado: "Activo", promedio_acumulado: Double(0.0), creditos_cursados: 0 },
    { codigo: "E005", nombre: "David Ochoa", email_institucional: "david.ochoa@unal.edu.co", fecha_nacimiento: new Date("2005-01-10"), semestre_actual: 3, programa_codigo: "ARQUI", estado: "Activo", promedio_acumulado: Double(3.8), creditos_cursados: 30 },
    { codigo: "E006", nombre: "Sofía Vargas", email_institucional: "sofia.vargas@unal.edu.co", fecha_nacimiento: new Date("2002-12-05"), semestre_actual: 9, programa_codigo: "MED", estado: "Activo", promedio_acumulado: Double(4.0), creditos_cursados: 120 },
    { codigo: "E012", nombre: "Luisa Naranjo", email_institucional: "luisa.naranjo@unal.edu.co", fecha_nacimiento: new Date("2003-03-03"), semestre_actual: 6, programa_codigo: "ING-CIV", estado: "Activo", promedio_acumulado: Double(3.3), creditos_cursados: 75 },
    { codigo: "E013", nombre: "Paula Giraldo", email_institucional: "paula.giraldo@unal.edu.co", fecha_nacimiento: new Date("2002-06-25"), semestre_actual: 8, programa_codigo: "COM-SOC", estado: "Activo", promedio_acumulado: Double(4.1), creditos_cursados: 100 },
    { codigo: "E007", nombre: "Pedro Gil", email_institucional: "pedro.gil@unal.edu.co", fecha_nacimiento: new Date("2003-04-12"), semestre_actual: 5, programa_codigo: "ADMIN", estado: "Activo", promedio_acumulado: Double(2.95), creditos_cursados: 55 },
    { codigo: "E008", nombre: "Ana Torres", email_institucional: "ana.torres@unal.edu.co", fecha_nacimiento: new Date("2004-07-25"), semestre_actual: 3, programa_codigo: "DER", estado: "Activo", promedio_acumulado: Double(2.6), creditos_cursados: 25 },
    { codigo: "E016", nombre: "Jairo Montes", email_institucional: "jairo.montes@unal.edu.co", fecha_nacimiento: new Date("2003-07-07"), semestre_actual: 6, programa_codigo: "QUIM", estado: "Activo", promedio_acumulado: Double(3.0), creditos_cursados: 70 },
    { codigo: "E009", nombre: "Felipe Soto", email_institucional: "felipe.soto@unal.edu.co", fecha_nacimiento: new Date("1998-02-18"), semestre_actual: 12, programa_codigo: "ING-SIST", estado: "Graduado", promedio_acumulado: Double(3.7), creditos_cursados: 160 },
    { codigo: "E014", nombre: "Ricardo Vélez", email_institucional: "ricardo.velez@unal.edu.co", fecha_nacimiento: new Date("2001-01-01"), semestre_actual: 10, programa_codigo: "MED", estado: "Graduado", promedio_acumulado: Double(3.9), creditos_cursados: 150 },
    { codigo: "E010", nombre: "Diana Restrepo", email_institucional: "diana.restrepo@unal.edu.co", fecha_nacimiento: new Date("2000-09-30"), semestre_actual: 4, programa_codigo: "LENG", estado: "Inactivo", promedio_acumulado: Double(3.5), creditos_cursados: 40 },
    { codigo: "E011", nombre: "Mario Casas", email_institucional: "mario.casas@unal.edu.co", fecha_nacimiento: new Date("2004-10-10"), semestre_actual: 2, programa_codigo: "BIO", estado: "Retirado", promedio_acumulado: Double(3.1), creditos_cursados: 10 },
    { codigo: "E015", nombre: "Valeria Sierra", email_institucional: "valeria.sierra@unal.edu.co", fecha_nacimiento: new Date("2004-09-19"), semestre_actual: 4, programa_codigo: "FILO", estado: "Activo", promedio_acumulado: Double(3.6), creditos_cursados: 48 },
    { codigo: "E017", nombre: "Natalia Gil", email_institucional: "natalia.gil@unal.edu.co", fecha_nacimiento: new Date("2002-04-24"), semestre_actual: 9, programa_codigo: "ING-IND", estado: "Activo", promedio_acumulado: Double(3.7), creditos_cursados: 110 },
    { codigo: "E018", nombre: "Camilo Arias", email_institucional: "camilo.arias@unal.edu.co", fecha_nacimiento: new Date("2005-02-09"), semestre_actual: 2, programa_codigo: "CONT", estado: "Activo", promedio_acumulado: Double(3.9), creditos_cursados: 20 },
    { codigo: "E019", nombre: "Andrea Paz", email_institucional: "andrea.paz@unal.edu.co", fecha_nacimiento: new Date("2004-11-11"), semestre_actual: 4, programa_codigo: "PSICO", estado: "Activo", promedio_acumulado: Double(3.4), creditos_cursados: 45 },
    { codigo: "E020", nombre: "Esteban Ríos", email_institucional: "esteban.rios@unal.edu.co", fecha_nacimiento: new Date("2003-10-21"), semestre_actual: 8, programa_codigo: "ARQUI", estado: "Activo", promedio_acumulado: Double(3.2), creditos_cursados: 100 }
]);

db.inscripciones.insertMany([
    { 
        estudiante_codigo: "E001", materia_codigo: "ALG-001", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-20"), estado_materia: "Aprobada", calificacion_final: Double(4.5), 
        calificaciones: [
            { tipo: "P1", porcentaje: 30, nota: Double(4.0) }, 
            { tipo: "P2", porcentaje: 30, nota: Double(4.8) }, 
            { tipo: "PF", porcentaje: 40, nota: Double(4.7) }
        ] 
    },
    { 
        estudiante_codigo: "E001", materia_codigo: "CAL-001", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-20"), estado_materia: "Aprobada", calificacion_final: Double(3.2), 
        calificaciones: [
            { tipo: "P1", porcentaje: 50, nota: Double(2.8) }, 
            { tipo: "PF", porcentaje: 50, nota: Double(3.6) }
        ] 
    },
    { 
        estudiante_codigo: "E002", materia_codigo: "CAL-001", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-20"), estado_materia: "Reprobada", calificacion_final: Double(2.5), 
        calificaciones: [
            { tipo: "P1", porcentaje: 40, nota: Double(2.0) }, 
            { tipo: "PF", porcentaje: 60, nota: Double(2.8) }
        ] 
    },
    { 
        estudiante_codigo: "E001", materia_codigo: "BBDD-002", periodo: "2024-2", fecha_inscripcion: new Date("2024-07-25"), estado_materia: "Cursando", calificacion_final: null, 
        calificaciones: [
            { tipo: "Parcial 1", porcentaje: 35, nota: Double(4.0) }
        ] 
    },
    { 
        estudiante_codigo: "E002", materia_codigo: "ALG-001", periodo: "2024-2", fecha_inscripcion: new Date("2024-07-26"), estado_materia: "Cursando", calificacion_final: null, 
        calificaciones: [
            { tipo: "Parcial 1", porcentaje: 30, nota: Double(2.0) }
        ] 
    },
    { 
        estudiante_codigo: "E003", materia_codigo: "EST-001", periodo: "2023-2", fecha_inscripcion: new Date("2023-08-01"), estado_materia: "Aprobada", calificacion_final: Double(4.8), 
        calificaciones: [
            { tipo: "Final", porcentaje: 100, nota: Double(4.8) }
        ] 
    },
    { 
        estudiante_codigo: "E004", materia_codigo: "DER-010", periodo: "2024-2", fecha_inscripcion: new Date("2024-07-28"), estado_materia: "Retirada", calificacion_final: Double(0.0), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E005", materia_codigo: "ARQ-005", periodo: "2023-2", fecha_inscripcion: new Date("2023-08-05"), estado_materia: "Aprobada", calificacion_final: Double(3.5), 
        calificaciones: [
            { tipo: "P1", porcentaje: 30, nota: Double(3.0) }, 
            { tipo: "PF", porcentaje: 70, nota: Double(3.7) }
        ] 
    },
    { 
        estudiante_codigo: "E005", materia_codigo: "FIN-101", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-25"), estado_materia: "Aprobada", calificacion_final: Double(4.0), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E007", materia_codigo: "EST-001", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-28"), estado_materia: "Reprobada", calificacion_final: Double(1.8), 
        calificaciones: [
            { tipo: "P1", porcentaje: 50, nota: Double(1.5) }, 
            { tipo: "PF", porcentaje: 50, nota: Double(2.1) }
        ] 
    },
    { 
        estudiante_codigo: "E012", materia_codigo: "ING-C-1", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-29"), estado_materia: "Aprobada", calificacion_final: Double(3.8), 
        calificaciones: [
            { tipo: "Proyecto", porcentaje: 100, nota: Double(3.8) }
        ] 
    },
    { 
        estudiante_codigo: "E013", materia_codigo: "COM-202", periodo: "2023-2", fecha_inscripcion: new Date("2023-08-10"), estado_materia: "Aprobada", calificacion_final: Double(4.2), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E014", materia_codigo: "FISIO-1", periodo: "2024-2", fecha_inscripcion: new Date("2024-07-30"), estado_materia: "Cursando", calificacion_final: null, 
        calificaciones: [
            { tipo: "Laboratorio", porcentaje: 20, nota: Double(4.5) }
        ] 
    },
    { 
        estudiante_codigo: "E015", materia_codigo: "FILO-1", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-15"), estado_materia: "Aprobada", calificacion_final: Double(3.6), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E017", materia_codigo: "IND-303", periodo: "2023-2", fecha_inscripcion: new Date("2023-08-20"), estado_materia: "Aprobada", calificacion_final: Double(3.1), 
        calificaciones: [
            { tipo: "Trabajo", porcentaje: 50, nota: Double(3.0) }, 
            { tipo: "Final", porcentaje: 50, nota: Double(3.2) }
        ] 
    },
    { 
        estudiante_codigo: "E018", materia_codigo: "CONT-105", periodo: "2024-2", fecha_inscripcion: new Date("2024-07-27"), estado_materia: "Cursando", calificacion_final: null, 
        calificaciones: [
            { tipo: "Quiz 1", porcentaje: 15, nota: Double(5.0) }
        ] 
    },
    { 
        estudiante_codigo: "E019", materia_codigo: "PSICO-1", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-20"), estado_materia: "Aprobada", calificacion_final: Double(4.0), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E020", materia_codigo: "ARQ-005", periodo: "2023-2", fecha_inscripcion: new Date("2023-08-05"), estado_materia: "Aprobada", calificacion_final: Double(3.9), calificaciones: [] 
    },
    { 
        estudiante_codigo: "E008", materia_codigo: "DER-010", periodo: "2024-1", fecha_inscripcion: new Date("2024-01-22"), estado_materia: "Reprobada", calificacion_final: Double(2.9), 
        calificaciones: [
            { tipo: "P1", porcentaje: 50, nota: Double(3.1) }, 
            { tipo: "PF", porcentaje: 50, nota: Double(2.7) }
        ] 
    },
    { 
        estudiante_codigo: "E010", materia_codigo: "LENG-400", periodo: "2023-1", fecha_inscripcion: new Date("2023-01-18"), estado_materia: "Aprobada", calificacion_final: Double(3.5), calificaciones: [] 
    }
]);

