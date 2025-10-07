/**
 * Inserta datos iniciales para las colecciones programas, materias y estudiantes.
 * Captura los _id de programas y materias en arrays progIds y matIds.
 * Usa valores double para nota_final y promedio_acumulado.
 * Asegura 20 documentos por colección con datos realistas y casos especiales.
 */

// Insertar 20 programas y capturar sus _id
let progIds = db.programas.insertMany([
  { codigo: "ISOFT", nombre: "Ingeniería de Software", creditos_totales: 140, semestres: 10, requisitos_graduacion: ["Proyecto de grado", "Pasantía"], plan_estudio: [] },
  { codigo: "MED", nombre: "Medicina", creditos_totales: 180, semestres: 12, requisitos_graduacion: ["Rotaciones clínicas"], plan_estudio: [] },
  { codigo: "DER", nombre: "Derecho", creditos_totales: 150, semestres: 10, requisitos_graduacion: ["Examen estatal"], plan_estudio: [] },
  { codigo: "ADM", nombre: "Administración de Empresas", creditos_totales: 130, semestres: 8, requisitos_graduacion: ["Plan de negocio"], plan_estudio: [] },
  { codigo: "BIO", nombre: "Biología", creditos_totales: 135, semestres: 9, requisitos_graduacion: ["Tesis"], plan_estudio: [] },
  { codigo: "CIV", nombre: "Ingeniería Civil", creditos_totales: 160, semestres: 10, requisitos_graduacion: ["Proyecto estructural"], plan_estudio: [] },
  { codigo: "PSI", nombre: "Psicología", creditos_totales: 140, semestres: 10, requisitos_graduacion: ["Práctica clínica"], plan_estudio: [] },
  { codigo: "ECO", nombre: "Economía", creditos_totales: 120, semestres: 8, requisitos_graduacion: ["Análisis económico"], plan_estudio: [] },
  { codigo: "ARQ", nombre: "Arquitectura", creditos_totales: 170, semestres: 11, requisitos_graduacion: ["Diseño final"], plan_estudio: [] },
  { codigo: "COM", nombre: "Comunicación Social", creditos_totales: 130, semestres: 8, requisitos_graduacion: ["Portafolio"], plan_estudio: [] },
  { codigo: "ELE", nombre: "Ingeniería Eléctrica", creditos_totales: 150, semestres: 10, requisitos_graduacion: ["Proyecto eléctrico"], plan_estudio: [] },
  { codigo: "FIL", nombre: "Filosofía", creditos_totales: 120, semestres: 8, requisitos_graduacion: ["Ensayo"], plan_estudio: [] },
  { codigo: "QUI", nombre: "Química", creditos_totales: 140, semestres: 9, requisitos_graduacion: ["Laboratorio avanzado"], plan_estudio: [] },
  { codigo: "MAT", nombre: "Matemáticas", creditos_totales: 130, semestres: 8, requisitos_graduacion: ["Teorema original"], plan_estudio: [] },
  { codigo: "HIS", nombre: "Historia", creditos_totales: 120, semestres: 8, requisitos_graduacion: ["Investigación histórica"], plan_estudio: [] },
  { codigo: "ENF", nombre: "Enfermería", creditos_totales: 150, semestres: 10, requisitos_graduacion: ["Práctica hospitalaria"], plan_estudio: [] },
  { codigo: "FIS", nombre: "Física", creditos_totales: 140, semestres: 9, requisitos_graduacion: ["Experimento"], plan_estudio: [] },
  { codigo: "LIT", nombre: "Literatura", creditos_totales: 120, semestres: 8, requisitos_graduacion: ["Análisis literario"], plan_estudio: [] },
  { codigo: "MUS", nombre: "Música", creditos_totales: 130, semestres: 8, requisitos_graduacion: ["Concierto"], plan_estudio: [] },
  { codigo: "ART", nombre: "Artes Plásticas", creditos_totales: 140, semestres: 9, requisitos_graduacion: ["Exposición"], plan_estudio: [] }
]).insertedIds;
print("20 programas insertados. IDs: " + Object.values(progIds));

// Insertar 20 materias y capturar sus _id
let matIds = db.materias.insertMany([
  { codigo: "BD101", nombre: "Bases de Datos I", creditos: 4, prerrequisitos: [], contenido: "Introducción a NoSQL", tipo: "Obligatoria" },
  { codigo: "MAT101", nombre: "Matemáticas Básicas", creditos: 3, prerrequisitos: [], contenido: "Álgebra lineal", tipo: "Fundamentación" },
  { codigo: "HIS201", nombre: "Historia del Derecho", creditos: 3, prerrequisitos: ["DER101"], contenido: "Historia legal", tipo: "Obligatoria" },
  { codigo: "ADM101", nombre: "Introducción a Administración", creditos: 3, prerrequisitos: [], contenido: "Gestión básica", tipo: "Obligatoria" },
  { codigo: "BIO101", nombre: "Biología General", creditos: 4, prerrequisitos: [], contenido: "Células y ecosistemas", tipo: "Fundamentación" },
  { codigo: "CIV201", nombre: "Estructuras I", creditos: 4, prerrequisitos: ["MAT101"], contenido: "Diseño estructural", tipo: "Obligatoria" },
  { codigo: "PSI101", nombre: "Psicología Introductoria", creditos: 3, prerrequisitos: [], contenido: "Comportamiento humano", tipo: "Obligatoria" },
  { codigo: "ECO101", nombre: "Economía Básica", creditos: 3, prerrequisitos: [], contenido: "Microeconomía", tipo: "Fundamentación" },
  { codigo: "ARQ101", nombre: "Diseño Arquitectónico I", creditos: 5, prerrequisitos: [], contenido: "Planos básicos", tipo: "Obligatoria" },
  { codigo: "COM101", nombre: "Comunicación Oral", creditos: 3, prerrequisitos: [], contenido: "Técnicas de habla", tipo: "Electiva" },
  { codigo: "ELE101", nombre: "Circuitos Eléctricos", creditos: 4, prerrequisitos: ["MAT101"], contenido: "Ohm y Kirchhoff", tipo: "Obligatoria" },
  { codigo: "FIL101", nombre: "Filosofía Antigua", creditos: 3, prerrequisitos: [], contenido: "Sócrates y Platón", tipo: "Fundamentación" },
  { codigo: "QUI101", nombre: "Química General", creditos: 4, prerrequisitos: [], contenido: "Átomos y moléculas", tipo: "Obligatoria" },
  { codigo: "MAT201", nombre: "Cálculo Avanzado", creditos: 4, prerrequisitos: ["MAT101"], contenido: "Integrales", tipo: "Obligatoria" },
  { codigo: "HIS101", nombre: "Historia Mundial", creditos: 3, prerrequisitos: [], contenido: "Épocas históricas", tipo: "Electiva" },
  { codigo: "ENF101", nombre: "Anatomía Humana", creditos: 4, prerrequisitos: [], contenido: "Sistemas corporales", tipo: "Obligatoria" },
  { codigo: "FIS101", nombre: "Física Clásica", creditos: 4, prerrequisitos: ["MAT101"], contenido: "Mecánica newtoniana", tipo: "Fundamentación" },
  { codigo: "LIT101", nombre: "Literatura Universal", creditos: 3, prerrequisitos: [], contenido: "Obras clásicas", tipo: "Electiva" },
  { codigo: "MUS101", nombre: "Teoría Musical", creditos: 3, prerrequisitos: [], contenido: "Notas y escalas", tipo: "Obligatoria" },
  { codigo: "ART101", nombre: "Dibujo Básico", creditos: 3, prerrequisitos: [], contenido: "Técnicas de arte", tipo: "Fundamentación" }
]).insertedIds;
print("20 materias insertadas. IDs: " + Object.values(matIds));

// Insertar 20 estudiantes usando progIds y matIds
