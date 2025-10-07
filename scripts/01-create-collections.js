/**
 * @fileoverview Script para insertar datos iniciales en las colecciones.
 * @description Inserta al menos 20 documentos realistas con relaciones consistentes por colección.
 * @author Andres Hernandez
 */

// Insertar 20 programas
const progResult = db.programas.insertMany([
  { codigo: "PROG001", nombre: "Ingeniería de Software", creditos_totales: 160 },
  { codigo: "PROG002", nombre: "Medicina", creditos_totales: 240 },
  { codigo: "PROG003", nombre: "Derecho", creditos_totales: 180 },
  { codigo: "PROG004", nombre: "Administración de Empresas", creditos_totales: 150 },
  { codigo: "PROG005", nombre: "Psicología", creditos_totales: 140 },
  { codigo: "PROG006", nombre: "Ingeniería Civil", creditos_totales: 170 },
  { codigo: "PROG007", nombre: "Biología", creditos_totales: 160 },
  { codigo: "PROG008", nombre: "Arquitectura", creditos_totales: 180 },
  { codigo: "PROG009", nombre: "Economía", creditos_totales: 150 },
  { codigo: "PROG010", nombre: "Comunicación Social", creditos_totales: 140 },
  { codigo: "PROG011", nombre: "Ingeniería Eléctrica", creditos_totales: 160 },
  { codigo: "PROG012", nombre: "Enfermería", creditos_totales: 150 },
  { codigo: "PROG013", nombre: "Historia", creditos_totales: 140 },
  { codigo: "PROG014", nombre: "Matemáticas", creditos_totales: 160 },
  { codigo: "PROG015", nombre: "Física", creditos_totales: 170 },
  { codigo: "PROG016", nombre: "Química", creditos_totales: 160 },
  { codigo: "PROG017", nombre: "Educación Física", creditos_totales: 140 },
  { codigo: "PROG018", nombre: "Diseño Gráfico", creditos_totales: 150 },
  { codigo: "PROG019", nombre: "Turismo", creditos_totales: 140 },
  { codigo: "PROG020", nombre: "Ingeniería Mecánica", creditos_totales: 170 }
]);
const progIds = Object.values(progResult.insertedIds);
const progNombres = [
  "Ingeniería de Software", "Medicina", "Derecho", "Administración de Empresas", "Psicología",
  "Ingeniería Civil", "Biología", "Arquitectura", "Economía", "Comunicación Social",
  "Ingeniería Eléctrica", "Enfermería", "Historia", "Matemáticas", "Física",
  "Química", "Educación Física", "Diseño Gráfico", "Turismo", "Ingeniería Mecánica"
];

// Verificar programas
if (db.programas.countDocuments() !== 20) {
  throw new Error("No se insertaron 20 programas. Encontrados: " + db.programas.countDocuments());
}
print("Programas insertados: " + db.programas.countDocuments());

// Insertar 20 materias
const mat1 = db.materias.insertOne({ codigo: "MAT001", nombre: "Cálculo I", creditos: 4, prerrequisitos: [] }).insertedId;
const mat2 = db.materias.insertOne({ codigo: "MAT002", nombre: "Bases de Datos", creditos: 3, prerrequisitos: [mat1] }).insertedId;
const mat3 = db.materias.insertOne({ codigo: "MAT003", nombre: "Física I", creditos: 4, prerrequisitos: [] }).insertedId;
const mat7 = db.materias.insertOne({ codigo: "MAT007", nombre: "Anatomía Humana", creditos: 5, prerrequisitos: [] }).insertedId;

const matResult = db.materias.insertMany([
  { codigo: "MAT004", nombre: "Química General", creditos: 3, prerrequisitos: [] },
  { codigo: "MAT005", nombre: "Historia del Arte", creditos: 2, prerrequisitos: [] },
  { codigo: "MAT006", nombre: "Programación I", creditos: 4, prerrequisitos: [] },
  { codigo: "MAT008", nombre: "Derecho Constitucional", creditos: 3, prerrequisitos: [] },
  { codigo: "MAT009", nombre: "Economía Básica", creditos: 3, prerrequisitos: [] },
  { codigo: "MAT010", nombre: "Psicología General", creditos: 3, prerrequisitos: [] },
  { codigo: "MAT011", nombre: "Ingeniería de Software", creditos: 4, prerrequisitos: [mat2] },
  { codigo: "MAT012", nombre: "Biología Celular", creditos: 4, prerrequisitos: [] },
  { codigo: "MAT013", nombre: "Arquitectura I", creditos: 5, prerrequisitos: [] },
  { codigo: "MAT014", nombre: "Estadística", creditos: 3, prerrequisitos: [mat1] },
  { codigo: "MAT015", nombre: "Comunicación Oral", creditos: 2, prerrequisitos: [] },
  { codigo: "MAT016", nombre: "Electricidad Básica", creditos: 4, prerrequisitos: [mat3] },
  { codigo: "MAT017", nombre: "Enfermería Clínica", creditos: 4, prerrequisitos: [mat7] },
  { codigo: "MAT018", nombre: "Historia Antigua", creditos: 3, prerrequisitos: [] },
  { codigo: "MAT019", nombre: "Álgebra Lineal", creditos: 4, prerrequisitos: [mat1] },
  { codigo: "MAT020", nombre: "Mecánica", creditos: 4, prerrequisitos: [mat3] }
]);
const matIds = [mat1, mat2, mat3, mat7].concat(Object.values(matResult.insertedIds));

// Verificar materias
if (db.materias.countDocuments() !== 20) {
  throw new Error("No se insertaron 20 materias. Encontradas: " + db.materias.countDocuments());
}
print("Materias insertadas: " + db.materias.countDocuments());

// Obtener códigos, nombres y créditos de materias
const materias = db.materias.find().toArray();
const matCodigos = materias.map(m => m.codigo);
const matNombres = materias.map(m => m.nombre);
const matCreditos = materias.map(m => m.creditos);

// Insertar 20 profesores
db.profesores.insertMany([
  { codigo: "PROF001", nombre: "Dr. Juan Pérez", email: "juan.perez@uni.edu", especialidades: ["Matemáticas"], materias_asignadas: [matIds[0], matIds[1]] },
  { codigo: "PROF002", nombre: "Dra. María López", email: "maria.lopez@uni.edu", especialidades: ["Física"], materias_asignadas: [matIds[2]] },
  { codigo: "PROF003", nombre: "Dr. Carlos Ramírez", email: "carlos.ramirez@uni.edu", especialidades: ["Química"], materias_asignadas: [matIds[3], matIds[4]] },
  { codigo: "PROF004", nombre: "Dra. Ana Gómez", email: "ana.gomez@uni.edu", especialidades: ["Historia"], materias_asignadas: [matIds[5]] },
  { codigo: "PROF005", nombre: "Dr. Luis Martínez", email: "luis.martinez@uni.edu", especialidades: ["Programación"], materias_asignadas: [matIds[6], matIds[7]] },
  { codigo: "PROF006", nombre: "Dra. Sofia Hernández", email: "sofia.hernandez@uni.edu", especialidades: ["Medicina"], materias_asignadas: [matIds[8]] },
  { codigo: "PROF007", nombre: "Dr. Pedro Sánchez", email: "pedro.sanchez@uni.edu", especialidades: ["Derecho"], materias_asignadas: [matIds[9], matIds[10]] },
  { codigo: "PROF008", nombre: "Dra. Laura Díaz", email: "laura.diaz@uni.edu", especialidades: ["Economía"], materias_asignadas: [matIds[11]] },
  { codigo: "PROF009", nombre: "Dr. Miguel Torres", email: "miguel.torres@uni.edu", especialidades: ["Psicología"], materias_asignadas: [matIds[12], matIds[13]] },
  { codigo: "PROF010", nombre: "Dra. Elena Ruiz", email: "elena.ruiz@uni.edu", especialidades: ["Ingeniería"], materias_asignadas: [matIds[14]] },
  { codigo: "PROF011", nombre: "Dr. Javier Vargas", email: "javier.vargas@uni.edu", especialidades: ["Biología"], materias_asignadas: [matIds[15], matIds[16]] },
  { codigo: "PROF012", nombre: "Dra. Carmen Morales", email: "carmen.morales@uni.edu", especialidades: ["Arquitectura"], materias_asignadas: [matIds[17]] },
  { codigo: "PROF013", nombre: "Dr. Roberto Ortega", email: "roberto.ortega@uni.edu", especialidades: ["Estadística"], materias_asignadas: [matIds[18], matIds[19]] },
  { codigo: "PROF014", nombre: "Dra. Patricia Navarro", email: "patricia.navarro@uni.edu", especialidades: ["Comunicación"], materias_asignadas: [matIds[0]] },
  { codigo: "PROF015", nombre: "Dr. Francisco Jiménez", email: "francisco.jimenez@uni.edu", especialidades: ["Electricidad"], materias_asignadas: [matIds[1], matIds[2]] },
  { codigo: "PROF016", nombre: "Dra. Isabel Castro", email: "isabel.castro@uni.edu", especialidades: ["Enfermería"], materias_asignadas: [matIds[3]] },
  { codigo: "PROF017", nombre: "Dr. Antonio Mendoza", email: "antonio.mendoza@uni.edu", especialidades: ["Historia"], materias_asignadas: [matIds[4], matIds[5]] },
  { codigo: "PROF018", nombre: "Dra. Rosa Flores", email: "rosa.flores@uni.edu", especialidades: ["Matemáticas Avanzadas"], materias_asignadas: [matIds[6]] },
  { codigo: "PROF019", nombre: "Dr. José García", email: "jose.garcia@uni.edu", especialidades: ["Física Avanzada"], materias_asignadas: [matIds[7], matIds[8]] },
  { codigo: "PROF020", nombre: "Dra. Marta Reyes", email: "marta.reyes@uni.edu", especialidades: ["Mecánica"], materias_asignadas: [matIds[9]] }
]);

// Verificar profesores
if (db.profesores.countDocuments() !== 20) {
  throw new Error("No se insertaron 20 profesores. Encontrados: " + db.profesores.countDocuments());
}
print("Profesores insertados: " + db.profesores.countDocuments());

// Insertar 20 estudiantes
try {
  db.estudiantes.insertMany([
    {
      codigo: "EST001",
      nombre: "María Fernanda López García",
      email: "maria.lopez@universidad.edu.co",
      fecha_nacimiento: ISODate("2003-05-15"),
      programa: { id: progIds[0], nombre: progNombres[0] },
      semestre_actual: 5,
      promedio_acumulado: 4.2,
      creditos_cursados: 85,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[0], codigo: matCodigos[0], nombre: matNombres[0], periodo: "2024-1", nota_final: 4.5, creditos: matCreditos[0] }
      ],
      contacto: { telefono: "+57 300 123 4567", direccion: "Calle 45 #23-10, Medellín", ciudad: "Medellín" }
    },
    {
      codigo: "EST002",
      nombre: "Juan Pablo Gómez Restrepo",
      email: "juan.gomez@universidad.edu.co",
      fecha_nacimiento: ISODate("2002-08-22"),
      programa: { id: progIds[1], nombre: progNombres[1] },
      semestre_actual: 6,
      promedio_acumulado: 3.8,
      creditos_cursados: 90,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[1], codigo: matCodigos[1], nombre: matNombres[1], periodo: "2024-1", nota_final: 4.0, creditos: matCreditos[1] }
      ],
      contacto: { telefono: "+57 301 234 5678", direccion: "Carrera 50 #12-30, Bogotá", ciudad: "Bogotá" }
    },
    {
      codigo: "EST003",
      nombre: "Ana Sofía Ramírez Torres",
      email: "ana.ramirez@universidad.edu.co",
      fecha_nacimiento: ISODate("2001-03-10"),
      programa: { id: progIds[2], nombre: progNombres[2] },
      semestre_actual: 7,
      promedio_acumulado: 4.0,
      creditos_cursados: 95,
      estado: "Inactivo",
      materias_cursadas: [
        { materia_id: matIds[2], codigo: matCodigos[2], nombre: matNombres[2], periodo: "2024-1", nota_final: 3.9, creditos: matCreditos[2] },
        { materia_id: matIds[3], codigo: matCodigos[3], nombre: matNombres[3], periodo: "2024-1", nota_final: 4.1, creditos: matCreditos[3] }
      ],
      contacto: { telefono: "+57 302 345 6789", direccion: "Calle 10 #5-20, Cali", ciudad: "Cali" }
    },
    {
      codigo: "EST004",
      nombre: "Carlos Andrés Vargas Díaz",
      email: "carlos.vargas@universidad.edu.co",
      fecha_nacimiento: ISODate("2004-01-25"),
      programa: { id: progIds[3], nombre: progNombres[3] },
      semestre_actual: 4,
      promedio_acumulado: 4.5,
      creditos_cursados: 60,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[4], codigo: matCodigos[4], nombre: matNombres[4], periodo: "2024-1", nota_final: 4.3, creditos: matCreditos[4] }
      ],
      contacto: { telefono: "+57 303 456 7890", direccion: "Carrera 15 #30-40, Barranquilla", ciudad: "Barranquilla" }
    },
    {
      codigo: "EST005",
      nombre: "Laura Valentina Zuluaga",
      email: "laura.zuluaga@universidad.edu.co",
      fecha_nacimiento: ISODate("2002-11-12"),
      programa: { id: progIds[4], nombre: progNombres[4] },
      semestre_actual: 8,
      promedio_acumulado: 3.2,
      creditos_cursados: 100,
      estado: "Retirado",
      materias_cursadas: [
        { materia_id: matIds[5], codigo: matCodigos[5], nombre: matNombres[5], periodo: "2024-1", nota_final: 3.0, creditos: matCreditos[5] }
      ],
      contacto: { telefono: "+57 304 567 8901", direccion: "Calle 20 #10-50, Medellín", ciudad: "Medellín" }
    },
    {
      codigo: "EST006",
      nombre: "Diego Alejandro Muñoz",
      email: "diego.munoz@universidad.edu.co",
      fecha_nacimiento: ISODate("2003-07-30"),
      programa: { id: progIds[5], nombre: progNombres[5] },
      semestre_actual: 3,
      promedio_acumulado: 4.7,
      creditos_cursados: 45,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[6], codigo: matCodigos[6], nombre: matNombres[6], periodo: "2024-1", nota_final: 4.8, creditos: matCreditos[6] }
      ],
      contacto: { telefono: "+57 305 678 9012", direccion: "Carrera 25 #15-60, Bogotá", ciudad: "Bogotá" }
    },
    {
      codigo: "EST007",
      nombre: "Sofía Alejandra Castro",
      email: "sofia.castro@universidad.edu.co",
      fecha_nacimiento: ISODate("2000-09-05"),
      programa: { id: progIds[6], nombre: progNombres[6] },
      semestre_actual: 9,
      promedio_acumulado: 3.5,
      creditos_cursados: 110,
      estado: "Graduado",
      materias_cursadas: [
        { materia_id: matIds[7], codigo: matCodigos[7], nombre: matNombres[7], periodo: "2024-1", nota_final: 3.7, creditos: matCreditos[7] },
        { materia_id: matIds[8], codigo: matCodigos[8], nombre: matNombres[8], periodo: "2024-1", nota_final: 3.4, creditos: matCreditos[8] }
      ],
      contacto: { telefono: "+57 306 789 0123", direccion: "Calle 30 #20-70, Cali", ciudad: "Cali" }
    },
    {
      codigo: "EST008",
      nombre: "Andrés Felipe Morales",
      email: "andres.morales@universidad.edu.co",
      fecha_nacimiento: ISODate("2004-02-18"),
      programa: { id: progIds[7], nombre: progNombres[7] },
      semestre_actual: 2,
      promedio_acumulado: 4.1,
      creditos_cursados: 30,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[9], codigo: matCodigos[9], nombre: matNombres[9], periodo: "2024-1", nota_final: 4.2, creditos: matCreditos[9] }
      ],
      contacto: { telefono: "+57 307 890 1234", direccion: "Carrera 35 #25-80, Barranquilla", ciudad: "Barranquilla" }
    },
    {
      codigo: "EST009",
      nombre: "Valeria Gómez Salazar",
      email: "valeria.gomez@universidad.edu.co",
      fecha_nacimiento: ISODate("2001-12-01"),
      programa: { id: progIds[8], nombre: progNombres[8] },
      semestre_actual: 10,
      promedio_acumulado: 3.9,
      creditos_cursados: 120,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[10], codigo: matCodigos[10], nombre: matNombres[10], periodo: "2024-1", nota_final: 3.8, creditos: matCreditos[10] }
      ],
      contacto: { telefono: "+57 308 901 2345", direccion: "Calle 40 #30-90, Medellín", ciudad: "Medellín" }
    },
    {
      codigo: "EST010",
      nombre: "Santiago López Martínez",
      email: "santiago.lopez@universidad.edu.co",
      fecha_nacimiento: ISODate("2003-04-20"),
      programa: { id: progIds[9], nombre: progNombres[9] },
      semestre_actual: 1,
      promedio_acumulado: 4.6,
      creditos_cursados: 15,
      estado: "Activo",
      materias_cursadas: [],
      contacto: { telefono: "+57 309 012 3456", direccion: "Carrera 45 #35-100, Bogotá", ciudad: "Bogotá" }
    },
    {
      codigo: "EST011",
      nombre: "Camila Andrea Torres",
      email: "camila.torres@universidad.edu.co",
      fecha_nacimiento: ISODate("2002-06-15"),
      programa: { id: progIds[10], nombre: progNombres[10] },
      semestre_actual: 11,
      promedio_acumulado: 3.3,
      creditos_cursados: 130,
      estado: "Inactivo",
      materias_cursadas: [
        { materia_id: matIds[11], codigo: matCodigos[11], nombre: matNombres[11], periodo: "2024-1", nota_final: 3.2, creditos: matCreditos[11] }
      ],
      contacto: { telefono: "+57 310 123 4567", direccion: "Calle 50 #40-110, Cali", ciudad: "Cali" }
    },
    {
      codigo: "EST012",
      nombre: "Felipe Antonio Díaz",
      email: "felipe.diaz@universidad.edu.co",
      fecha_nacimiento: ISODate("2000-10-10"),
      programa: { id: progIds[11], nombre: progNombres[11] },
      semestre_actual: 12,
      promedio_acumulado: 4.8,
      creditos_cursados: 140,
      estado: "Graduado",
      materias_cursadas: [
        { materia_id: matIds[12], codigo: matCodigos[12], nombre: matNombres[12], periodo: "2024-1", nota_final: 4.9, creditos: matCreditos[12] },
        { materia_id: matIds[13], codigo: matCodigos[13], nombre: matNombres[13], periodo: "2024-1", nota_final: 4.7, creditos: matCreditos[13] }
      ],
      contacto: { telefono: "+57 311 234 5678", direccion: "Carrera 55 #45-120, Barranquilla", ciudad: "Barranquilla" }
    },
    {
      codigo: "EST013",
      nombre: "Isabela Vargas Ruiz",
      email: "isabela.vargas@universidad.edu.co",
      fecha_nacimiento: ISODate("2004-03-05"),
      programa: { id: progIds[12], nombre: progNombres[12] },
      semestre_actual: 4,
      promedio_acumulado: 3.7,
      creditos_cursados: 60,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[14], codigo: matCodigos[14], nombre: matNombres[14], periodo: "2024-1", nota_final: 3.6, creditos: matCreditos[14] }
      ],
      contacto: { telefono: "+57 312 345 6789", direccion: "Calle 60 #50-130, Medellín", ciudad: "Medellín" }
    },
    {
      codigo: "EST014",
      nombre: "David Esteban Gómez",
      email: "david.gomez@universidad.edu.co",
      fecha_nacimiento: ISODate("2001-01-28"),
      programa: { id: progIds[13], nombre: progNombres[13] },
      semestre_actual: 5,
      promedio_acumulado: 4.3,
      creditos_cursados: 75,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[15], codigo: matCodigos[15], nombre: matNombres[15], periodo: "2024-1", nota_final: 4.4, creditos: matCreditos[15] }
      ],
      contacto: { telefono: "+57 313 456 7890", direccion: "Carrera 60 #55-140, Bogotá", ciudad: "Bogotá" }
    },
    {
      codigo: "EST015",
      nombre: "Valentina Morales Castro",
      email: "valentina.morales@universidad.edu.co",
      fecha_nacimiento: ISODate("2002-05-17"),
      programa: { id: progIds[14], nombre: progNombres[14] },
      semestre_actual: 6,
      promedio_acumulado: 2.9,
      creditos_cursados: 90,
      estado: "Retirado",
      materias_cursadas: [
        { materia_id: matIds[16], codigo: matCodigos[16], nombre: matNombres[16], periodo: "2024-1", nota_final: 2.8, creditos: matCreditos[16] }
      ],
      contacto: { telefono: "+57 314 567 8901", direccion: "Calle 65 #60-150, Cali", ciudad: "Cali" }
    },
    {
      codigo: "EST016",
      nombre: "Sebastián Andrés Salazar",
      email: "sebastian.salazar@universidad.edu.co",
      fecha_nacimiento: ISODate("2003-09-02"),
      programa: { id: progIds[15], nombre: progNombres[15] },
      semestre_actual: 7,
      promedio_acumulado: 4.0,
      creditos_cursados: 95,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[17], codigo: matCodigos[17], nombre: matNombres[17], periodo: "2024-1", nota_final: 4.1, creditos: matCreditos[17] }
      ],
      contacto: { telefono: "+57 315 678 9012", direccion: "Carrera 65 #65-160, Barranquilla", ciudad: "Barranquilla" }
    },
    {
      codigo: "EST017",
      nombre: "Lucía Fernanda Torres",
      email: "lucia.torres@universidad.edu.co",
      fecha_nacimiento: ISODate("2000-07-14"),
      programa: { id: progIds[16], nombre: progNombres[16] },
      semestre_actual: 8,
      promedio_acumulado: 3.6,
      creditos_cursados: 100,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[18], codigo: matCodigos[18], nombre: matNombres[18], periodo: "2024-1", nota_final: 3.5, creditos: matCreditos[18] },
        { materia_id: matIds[19], codigo: matCodigos[19], nombre: matNombres[19], periodo: "2024-1", nota_final: 3.7, creditos: matCreditos[19] }
      ],
      contacto: { telefono: "+57 316 789 0123", direccion: "Calle 70 #70-170, Medellín", ciudad: "Medellín" }
    },
    {
      codigo: "EST018",
      nombre: "Mateo Alejandro López",
      email: "mateo.lopez@universidad.edu.co",
      fecha_nacimiento: ISODate("2001-11-23"),
      programa: { id: progIds[17], nombre: progNombres[17] },
      semestre_actual: 9,
      promedio_acumulado: 4.4,
      creditos_cursados: 110,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[0], codigo: matCodigos[0], nombre: matNombres[0], periodo: "2024-1", nota_final: 4.5, creditos: matCreditos[0] }
      ],
      contacto: { telefono: "+57 317 890 1234", direccion: "Carrera 70 #75-180, Bogotá", ciudad: "Bogotá" }
    },
    {
      codigo: "EST019",
      nombre: "Paula Andrea Ramírez",
      email: "paula.ramirez@universidad.edu.co",
      fecha_nacimiento: ISODate("2002-02-09"),
      programa: { id: progIds[18], nombre: progNombres[18] },
      semestre_actual: 10,
      promedio_acumulado: 3.4,
      creditos_cursados: 120,
      estado: "Graduado",
      materias_cursadas: [
        { materia_id: matIds[1], codigo: matCodigos[1], nombre: matNombres[1], periodo: "2024-1", nota_final: 3.3, creditos: matCreditos[1] }
      ],
      contacto: { telefono: "+57 318 901 2345", direccion: "Calle 75 #80-190, Cali", ciudad: "Cali" }
    },
    {
      codigo: "EST020",
      nombre: "Gabriel Esteban Castro",
      email: "gabriel.castro@universidad.edu.co",
      fecha_nacimiento: ISODate("2003-06-27"),
      programa: { id: progIds[19], nombre: progNombres[19] },
      semestre_actual: 2,
      promedio_acumulado: 4.0,
      creditos_cursados: 30,
      estado: "Activo",
      materias_cursadas: [
        { materia_id: matIds[2], codigo: matCodigos[2], nombre: matNombres[2], periodo: "2024-1", nota_final: 4.1, creditos: matCreditos[2] },
        { materia_id: matIds[3], codigo: matCodigos[3], nombre: matNombres[3], periodo: "2024-1", nota_final: 3.9, creditos: matCreditos[3] }
      ],
      contacto: { telefono: "+57 319 012 3456", direccion: "Carrera 80 #85-200, Barranquilla", ciudad: "Barranquilla" }
    }
  ]);
  print("Estudiantes insertados: " + db.estudiantes.countDocuments());
} catch (e) {
  print("Error al insertar estudiantes: " + e);
}

// Obtener IDs de estudiantes
const estIds = db.estudiantes.find().toArray().map(e => e._id);

// Insertar 20 inscripciones
db.inscripciones.insertMany([
  { estudiante_id: estIds[0], materia_id: matIds[0], periodo: "2024-2", estado: "Inscrito", nota_final: null },
  { estudiante_id: estIds[1], materia_id: matIds[1], periodo: "2024-2", estado: "Aprobado", nota_final: 3.5 },
  { estudiante_id: estIds[2], materia_id: matIds[2], periodo: "2024-2", estado: "Reprobado", nota_final: 2.4 },
  { estudiante_id: estIds[3], materia_id: matIds[3], periodo: "2024-2", estado: "Inscrito", nota_final: null },
  { estudiante_id: estIds[4], materia_id: matIds[4], periodo: "2024-2", estado: "Retirado", nota_final: null },
  { estudiante_id: estIds[5], materia_id: matIds[5], periodo: "2024-2", estado: "Aprobado", nota_final: 4.2 },
  { estudiante_id: estIds[6], materia_id: matIds[6], periodo: "2024-2", estado: "Reprobado", nota_final: 1.9 },
  { estudiante_id: estIds[7], materia_id: matIds[7], periodo: "2024-2", estado: "Inscrito", nota_final: null },
  { estudiante_id: estIds[8], materia_id: matIds[8], periodo: "2024-2", estado: "Aprobado", nota_final: 4.0 },
  { estudiante_id: estIds[9], materia_id: matIds[9], periodo: "2024-2", estado: "Retirado", nota_final: null },
  { estudiante_id: estIds[10], materia_id: matIds[10], periodo: "2024-2", estado: "Reprobado", nota_final: 2.7 },
  { estudiante_id: estIds[11], materia_id: matIds[11], periodo: "2024-2", estado: "Aprobado", nota_final: 3.8 },
  { estudiante_id: estIds[12], materia_id: matIds[12], periodo: "2024-2", estado: "Inscrito", nota_final: null },
  { estudiante_id: estIds[13], materia_id: matIds[13], periodo: "2024-2", estado: "Retirado", nota_final: null },
  { estudiante_id: estIds[14], materia_id: matIds[14], periodo: "2024-2", estado: "Aprobado", nota_final: 4.5 },
  { estudiante_id: estIds[15], materia_id: matIds[15], periodo: "2024-2", estado: "Reprobado", nota_final: 2.0 },
  { estudiante_id: estIds[16], materia_id: matIds[16], periodo: "2024-2", estado: "Inscrito", nota_final: null },
  { estudiante_id: estIds[17], materia_id: matIds[17], periodo: "2024-2", estado: "Aprobado", nota_final: 3.6 },
  { estudiante_id: estIds[18], materia_id: matIds[18], periodo: "2024-2", estado: "Retirado", nota_final: null },
  { estudiante_id: estIds[19], materia_id: matIds[19], periodo: "2024-2", estado: "Reprobado", nota_final: 2.9 }
]);

// Verificar inscripciones
if (db.inscripciones.countDocuments() !== 20) {
  throw new Error("No se insertaron 20 inscripciones. Encontradas: " + db.inscripciones.countDocuments());
}
print("Inscripciones insertadas: " + db.inscripciones.countDocuments());

print("Inserción de datos completada exitosamente");