# 📚 Manual de Uso - Sistema Académico MongoDB

## 📑 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Inicialización del Sistema](#inicialización-del-sistema)
3. [Uso de Validaciones](#uso-de-validaciones)
4. [Operaciones CRUD](#operaciones-crud)
5. [Transacciones](#transacciones)
6. [Agregaciones y Reportes](#agregaciones-y-reportes)
7. [Change Streams](#change-streams)
8. [Casos de Uso Completos](#casos-de-uso-completos)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Previos

### 1. MongoDB con Replica Set

⚠️ **CRÍTICO**: Las transacciones y Change Streams **SOLO** funcionan con un Replica Set configurado.

#### Configuración en Windows

```powershell
# Crear directorio para datos
mkdir C:\data\db

# Iniciar MongoDB con replica set
mongod --replSet rs0 --port 27017 --dbpath C:\data\db
```

#### Configuración en Linux/Mac

```bash
# Crear directorio para datos
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

# Iniciar MongoDB con replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db
```

#### Inicializar el Replica Set

En una **nueva terminal**, conectar y inicializar:

```bash
mongosh
```

```javascript
// Inicializar el replica set
rs.initiate()

// Verificar el estado
rs.status()
// Debe mostrar: "stateStr": "PRIMARY"
```

### 2. Verificar Conexión

```javascript
// Conectar a la base de datos
use universidad

// Verificar que estamos en un replica set
db.hello().setName
// Debe retornar: "rs0"
```

---

## 🚀 Inicialización del Sistema

### Paso 1: Crear Colecciones con Validaciones

**Archivo**: `02-create-collection.js`

```bash
mongosh universidad < scripts/02-create-collection.js
```

**¿Qué hace este script?**

- Crea 4 colecciones: `estudiantes`, `materias`, `profesores`, `inscripciones`
- Aplica validaciones `$jsonSchema` estrictas
- Configura `validationLevel: "strict"` y `validationAction: "error"`

**Validaciones clave**:

- **Email institucional**: Debe terminar en `@unal.edu.co`
- **Notas**: Rango 0.0 a 5.0 (tipo `double`)
- **Estados**: Solo valores permitidos (`Activo`, `Inactivo`, `Retirado`, `Graduado`)
- **Semestre**: Entre 1 y 12

**Verificar**:

```javascript
// Ver las colecciones creadas
db.getCollectionNames()

// Ver el esquema de validación de estudiantes
db.getCollectionInfos({name: "estudiantes"})[0].options.validator
```

### Paso 2: Insertar Datos Iniciales

**Archivo**: `01-insert-date.js`

```bash
mongosh universidad < scripts/01-insert-date.js
```

**¿Qué hace este script?**

- Inserta 20 materias con prerrequisitos realistas
- Inserta 20 profesores con materias asignadas
- Inserta 20 estudiantes con diferentes estados y promedios
- Inserta 20+ inscripciones con calificaciones

**Verificar**:

```javascript
db.materias.countDocuments()       // 20
db.profesores.countDocuments()     // 20
db.estudiantes.countDocuments()    // 20
db.inscripciones.countDocuments()  // 20+

// Ver un estudiante de ejemplo
db.estudiantes.findOne({codigo: "E001"})
```

### Paso 3: Cargar Funciones de Validación

**Archivo**: `03-Validations.js`

```bash
mongosh universidad < scripts/03-Validations.js
```

**Funciones disponibles**:

1. `esCodigoUnico(coleccion, codigo)`
2. `esEmailInstitucionalValidoYUnico(email, coleccion)`
3. `verificarPrerrequisitos(codigoMateria, codigoEstudiante)`
4. `validarInscripcionUnica(codigoEstudiante, codigoMateria, periodo)`

### Paso 4: Cargar Funciones CRUD

**Archivo**: `04-CRUD-Functions.js`

```bash
mongosh universidad < scripts/04-CRUD-Functions.js
```

### Paso 5: Cargar Funciones de Transacciones

**Archivo**: `05-Transactions.js`

```bash
mongosh universidad < scripts/05-Transactions.js
```

### Paso 6: Cargar Funciones de Agregación

**Archivo**: `06-Agregations.js`

```bash
mongosh universidad < scripts/06-Agregations.js
```

### Paso 7: Cargar Change Streams

**Archivo**: `07-Change-Streams.js`

```bash
mongosh universidad < scripts/07-Change-Streams.js
```

---

## ✔️ Uso de Validaciones

### 1. Verificar Código Único

```javascript
// Verificar si un código de estudiante está disponible
esCodigoUnico("estudiantes", "E999")
// Retorna: true (disponible)

esCodigoUnico("estudiantes", "E001")
// Retorna: false (ya existe)
// Imprime: "Error: El código E001 ya existe en estudiantes."
```

### 2. Validar Email Institucional

```javascript
// Email válido y único
esEmailInstitucionalValidoYUnico("nuevo.estudiante@unal.edu.co", "estudiantes")
// Retorna: true

// Email con formato incorrecto
esEmailInstitucionalValidoYUnico("estudiante@gmail.com", "estudiantes")
// Retorna: false
// Imprime: "Error: El email estudiante@gmail.com no cumple con el formato institucional"

// Email ya registrado
esEmailInstitucionalValidoYUnico("carlos.perez@unal.edu.co", "estudiantes")
// Retorna: false
// Imprime: "Error: El email carlos.perez@unal.edu.co ya está registrado"
```

### 3. Verificar Prerrequisitos (FUNCIÓN CRÍTICA)

```javascript
// Verificar si E001 puede inscribir BBDD-002 (requiere ALG-001)
verificarPrerrequisitos("BBDD-002", "E001")
// Retorna: true (E001 ya aprobó ALG-001)

// Verificar si E004 puede inscribir BBDD-002
verificarPrerrequisitos("BBDD-002", "E004")
// Retorna: false
// Imprime: "Error: El estudiante E004 no ha aprobado el prerrequisito ALG-001."

// Materia sin prerrequisitos
verificarPrerrequisitos("CAL-001", "E004")
// Retorna: true (no tiene prerrequisitos)
```

### 4. Validar Inscripción Única

```javascript
// Verificar si E001 puede inscribir una materia en 2025-1
validarInscripcionUnica("E001", "CAL-001", "2025-1")
// Retorna: false (ya la aprobó en 2024-1)
// Imprime: "Error: El estudiante E001 ya aprobó la materia CAL-001."

// Materia nueva
validarInscripcionUnica("E001", "IND-303", "2025-1")
// Retorna: true (puede inscribirla)
```

---

## 📝 Operaciones CRUD

### Estudiantes

#### Crear Estudiante

```javascript
crearEstudiante({
    codigo: "E999",
    nombre: "Nuevo Estudiante",
    email_institucional: "nuevo.estudiante@unal.edu.co",
    fecha_nacimiento: new Date("2005-06-15"),
    semestre_actual: 1,
    programa_codigo: "ING-SIST",
    estado: "Activo",
    promedio_acumulado: 0.0,
    creditos_cursados: 0
})
```

#### Leer Estudiante

```javascript
leerEstudiante("E001")
```

#### Actualizar Estado

```javascript
actualizarEstadoEstudiante("E999", "Inactivo")
```

#### Eliminar Estudiante

```javascript
eliminarEstudiante("E999")
```

### Materias

#### Crear Materia

```javascript
crearMateria({
    codigo: "TEST-001",
    nombre: "Materia de Prueba",
    creditos: 3,
    prerrequisitos: ["ALG-001"],
    programa_codigo: "ING-SIST"
})
```

#### Leer Materia

```javascript
leerMateria("BBDD-002")
```

#### Actualizar Créditos

```javascript
actualizarCreditosMateria("TEST-001", 4)
```

#### Eliminar Materia

```javascript
eliminarMateria("TEST-001")
```

### Profesores

#### Crear Profesor

```javascript
crearProfesor({
    codigo: "P999",
    nombre: "Dr. Nuevo Profesor",
    especialidad: "Inteligencia Artificial",
    materias_asignadas: [
        { materia_codigo: "IA-601", periodo: "2025-1" }
    ]
})
```

#### Asignar Materia a Profesor

```javascript
asignarMateriaProfesor("P001", "IA-601", "2025-1")
```

### Inscripciones

#### Crear Inscripción Simple

```javascript
crearInscripcion({
    estudiante_codigo: "E001",
    materia_codigo: "IND-303",
    periodo: "2025-1",
    fecha_inscripcion: new Date(),
    estado_materia: "Cursando",
    calificacion_final: null,
    calificaciones: []
})
```

#### Registrar Calificación Parcial

```javascript
registrarCalificacionParcial("E001", "BBDD-002", "2024-2", {
    tipo: "P1",
    porcentaje: 30,
    nota: Double(4.2)
})
```

---

## 🔐 Transacciones

### 1. Inscripción Múltiple con Validación de Prerrequisitos

**Función**: `inscripcionMultipleMaterias_VALIDADA(codigoEstudiante, periodo, codigosMaterias)`

#### Ejemplo 1: Inscripción Exitosa

```javascript
// E001 ya aprobó ALG-001, puede inscribir BBDD-002
inscripcionMultipleMaterias_VALIDADA("E001", "2025-1", ["BBDD-002", "CAL-001"])
```

**Resultado**:
```
✅ Inscripción exitosa de 2 materias para el estudiante E001.
```

**Verificar**:
```javascript
db.inscripciones.find({
    estudiante_codigo: "E001",
    periodo: "2025-1"
}).pretty()
```

#### Ejemplo 2: Inscripción Fallida por Prerrequisitos

```javascript
// E004 NO ha aprobado ALG-001, no puede inscribir BBDD-002
inscripcionMultipleMaterias_VALIDADA("E004", "2025-1", ["BBDD-002", "CAL-001"])
```

**Resultado**:
```
Error: El estudiante E004 no ha aprobado el prerrequisito ALG-001.
❌ Error en la inscripción. Transacción abortada: Fallo en prerrequisitos para la materia BBDD-002.
```

**Verificar** (NO debe haber inscripciones):
```javascript
db.inscripciones.countDocuments({
    estudiante_codigo: "E004",
    periodo: "2025-1"
})
// Retorna: 0 (transacción abortada, ninguna materia se inscribió)
```

#### Ejemplo 3: Inscripción Fallida por Materia Ya Aprobada

```javascript
// E001 ya aprobó CAL-001 en 2024-1
inscripcionMultipleMaterias_VALIDADA("E001", "2025-1", ["CAL-001", "IND-303"])
```

**Resultado**:
```
Error: El estudiante E001 ya aprobó la materia CAL-001.
❌ Error en la inscripción. Transacción abortada
```

### 2. Registro de Nota y Actualización de Promedio

**Función**: `registrarNotaYActualizarPromedio(codigoEstudiante, codigoMateria, notaFinal, periodo)`

#### Ejemplo 1: Aprobar una Materia

```javascript
// E007 está cursando EST-001, registrar nota aprobatoria
registrarNotaYActualizarPromedio("E007", "EST-001", 3.5, "2024-2")
```

**Resultado**:
```
✅ Nota registrada (3.5, Aprobada) para EST-001. Promedio actualizado a 3.15.
```

**Verificar**:
```javascript
// Ver la inscripción actualizada
db.inscripciones.findOne({
    estudiante_codigo: "E007",
    materia_codigo: "EST-001",
    periodo: "2024-2"
})
// calificacion_final: 3.5
// estado_materia: "Aprobada"

// Ver el estudiante actualizado
db.estudiantes.findOne({codigo: "E007"})
// promedio_acumulado: 3.15 (recalculado)
// creditos_cursados: 58 (incrementado)
```

#### Ejemplo 2: Reprobar una Materia

```javascript
// E008 está cursando DER-010, registrar nota reprobatoria
registrarNotaYActualizarPromedio("E008", "DER-010", 2.3, "2024-2")
```

**Resultado**:
```
✅ Nota registrada (2.3, Reprobada) para DER-010. Promedio actualizado a 2.55.
```

**Verificar**:
```javascript
db.inscripciones.findOne({
    estudiante_codigo: "E008",
    materia_codigo: "DER-010",
    periodo: "2024-2"
})
// estado_materia: "Reprobada"
// calificacion_final: 2.3

db.estudiantes.findOne({codigo: "E008"})
// promedio_acumulado: 2.55 (bajó)
// creditos_cursados: 30 (incluye materias reprobadas)
```

### 3. Retiro de Materia

**Función**: `retirarMateria(codigoEstudiante, codigoMateria, periodo)`

```javascript
// E001 decide retirar BBDD-002 en 2024-2
retirarMateria("E001", "BBDD-002", "2024-2")
```

**Resultado**:
```
✅ Retiro de materia BBDD-002 para E001 registrado exitosamente.
```

**Verificar**:
```javascript
db.inscripciones.findOne({
    estudiante_codigo: "E001",
    materia_codigo: "BBDD-002",
    periodo: "2024-2"
})
// estado_materia: "Retirada"
// calificacion_final: 0.0
```

### 4. Graduación de Estudiante

**Función**: `graduarEstudiante(codigoEstudiante)`

#### Ejemplo 1: Graduación Exitosa

```javascript
// E009 tiene 160 créditos cursados
graduarEstudiante("E009")
```

**Resultado**:
```
🎓 ¡Felicidades! Estudiante E009 graduado exitosamente.
```

**Verificar**:
```javascript
db.estudiantes.findOne({codigo: "E009"})
// estado: "Graduado"
// fecha_graduacion: ISODate("2025-10-07...")
```

#### Ejemplo 2: Graduación Fallida por Créditos Insuficientes

```javascript
// E003 solo tiene 140 créditos (requiere 160)
graduarEstudiante("E003")
```

**Resultado**:
```
❌ Error en la graduación. Transacción abortada: Créditos insuficientes. Requeridos: 160, Cursados: 140.
```

---

## 📊 Agregaciones y Reportes

### 1. Listar Estudiantes en Riesgo

**Función**: `listarEstudiantesEnRiesgo()`

```javascript
listarEstudiantesEnRiesgo().forEach(printjson)
```

**Resultado**:
```json
{
  "codigo": "E008",
  "nombre": "Ana Torres",
  "programa_codigo": "DER",
  "promedio_acumulado": 2.6,
  "alerta": "Riesgo: Promedio bajo 2.6"
}
{
  "codigo": "E007",
  "nombre": "Pedro Gil",
  "programa_codigo": "ADMIN",
  "promedio_acumulado": 2.95,
  "alerta": "Riesgo: Promedio bajo 2.95"
}
```

**Uso**: Identificar estudiantes que necesitan apoyo académico.

### 2. Reporte de Materias Más Reprobadas

**Función**: `reporteMateriasMasReprobadas()`

```javascript
reporteMateriasMasReprobadas().forEach(printjson)
```

**Resultado**:
```json
{
  "materia_codigo": "CAL-001",
  "total_inscritos": 5,
  "total_reprobados": 2,
  "tasa_reprobacion": 40.0
}
{
  "materia_codigo": "BBDD-002",
  "total_inscritos": 3,
  "total_reprobados": 1,
  "tasa_reprobacion": 33.33
}
```

**Uso**: Identificar materias que requieren refuerzo pedagógico.

### 3. Ranking de Mejores Estudiantes por Programa

**Función**: `rankingMejoresEstudiantes()`

```javascript
rankingMejoresEstudiantes().forEach(printjson)
```

**Resultado**:
```json
{
  "programa_codigo": "ING-SIST",
  "top_5_estudiantes": [
    { "codigo": "E001", "nombre": "Carlos Pérez", "promedio": 4.2 },
    { "codigo": "E002", "nombre": "María López", "promedio": 3.85 },
    { "codigo": "E009", "nombre": "Felipe Soto", "promedio": 3.7 }
  ]
}
{
  "programa_codigo": "ADMIN",
  "top_5_estudiantes": [
    { "codigo": "E003", "nombre": "Juan Gómez", "promedio": 4.5 },
    { "codigo": "E007", "nombre": "Pedro Gil", "promedio": 2.95 }
  ]
}
```

**Uso**: Reconocimiento de excelencia académica.

### 4. Promedio de Calificaciones por Materia

**Función**: `calcularPromedioPorMateria()`

```javascript
calcularPromedioPorMateria().forEach(printjson)
```

**Resultado**:
```json
{
  "materia_codigo": "ALG-001",
  "nombre": "Algoritmos y Programación",
  "promedio": 4.15,
  "total_inscritos": 4
}
{
  "materia_codigo": "CAL-001",
  "nombre": "Cálculo Diferencial",
  "promedio": 2.85,
  "total_inscritos": 5
}
```

### 5. Carga Académica de Profesores

**Función**: `calcularCargaAcademica(periodo)`

```javascript
calcularCargaAcademica("2024-2").forEach(printjson)
```

**Resultado**:
```json
{
  "codigo": "P001",
  "nombre": "Dra. Ana Bolívar",
  "periodo": "2024-2",
  "total_materias": 2,
  "materias_impartidas": ["ALG-001", "BBDD-002"]
}
{
  "codigo": "P002",
  "nombre": "Mg. Luis Torres",
  "periodo": "2024-2",
  "total_materias": 1,
  "materias_impartidas": ["CAL-001"]
}
```

### 6. Análisis de Deserción

**Función**: `analisisDesercion()`

```javascript
analisisDesercion().forEach(printjson)
```

**Resultado**:
```json
{
  "programa_codigo": "LENG",
  "total_desertores": 1,
  "total_retirados": 0,
  "total_inactivos": 1
}
{
  "programa_codigo": "BIO",
  "total_desertores": 1,
  "total_retirados": 1,
  "total_inactivos": 0
}
```

---

## 🔔 Change Streams

⚠️ **IMPORTANTE**: Los Change Streams deben ejecutarse en un **proceso separado** (terminal o listener dedicado) porque son **listeners continuos** que esperan eventos.

### 1. Actualización Automática de Créditos

**Función**: `streamActualizarCreditos()`

#### Activar el Listener

En una **terminal separada**:

```bash
mongosh universidad
```

```javascript
// Cargar el script de Change Streams
load("scripts/07-Change-Streams.js")

// Activar el listener
streamActualizarCreditos()
```

**Salida**:
```
Change Stream: Actualización automática de créditos activado...
```

#### Probar el Trigger

En **otra terminal** (o en Compass):

```javascript
// Actualizar una inscripción a "Aprobada"
db.inscripciones.updateOne(
    { estudiante_codigo: "E001", materia_codigo: "BBDD-002", periodo: "2024-2" },
    { $set: { estado_materia: "Aprobada", calificacion_final: Double(4.0) } }
)
```

**Salida en la terminal del listener**:
```
[CRÉDITOS] Se añadieron 4 créditos a E001 por aprobación de BBDD-002.
```

**Verificar**:
```javascript
db.estudiantes.findOne({codigo: "E001"})
// creditos_cursados: 64 (incrementado automáticamente)
```

### 2. Notificación de Riesgo Académico

**Función**: `streamNotificacionRiesgo()`

#### Activar el Listener

```javascript
streamNotificacionRiesgo()
```

**Salida**:
```
Change Stream: Notificación de riesgo académico activado...
```

#### Probar el Trigger

```javascript
// Actualizar el promedio de un estudiante a menos de 3.0
db.estudiantes.updateOne(
    { codigo: "E016" },
    { $set: { promedio_acumulado: Double(2.8) } }
)
```

**Salida en la terminal del listener**:
```
⚠️ ALERTA DE RIESGO para Jairo Montes (E016) en QUIM. Promedio: 2.80.
```

### 3. Auditoría de Cambios en Estudiantes

**Función**: `streamAuditoriaEstudiantes()`

#### Activar el Listener

```javascript
streamAuditoriaEstudiantes()
```

**Salida**:
```
Change Stream: Auditoría de cambios en estudiantes activado...
```

#### Probar el Trigger

```javascript
// Actualizar el estado de un estudiante
db.estudiantes.updateOne(
    { codigo: "E010" },
    { $set: { estado: "Activo" } }
)
```

**Salida en la terminal del listener**:
```
[AUDITORÍA] Cambio registrado para estudiante: E010
```

**Verificar la auditoría**:
```javascript
db.auditoria_estudiantes.find().sort({fecha: -1}).limit(5).pretty()
```

**Resultado**:
```json
{
  "fecha": ISODate("2025-10-07T17:45:00Z"),
  "tipo_operacion": "update",
  "estudiante_codigo": "E010",
  "detalle": { "estado": "Activo" }
}
```

### 4. Validación de Cupos

**Función**: `streamValidacionCupos()`

```javascript
streamValidacionCupos()
```

Monitorea nuevas inscripciones y alerta si se excede el cupo máximo de una materia.

### 5. Historial de Calificaciones

**Función**: `streamHistorialCalificaciones()`

```javascript
streamHistorialCalificaciones()
```

Crea un registro histórico cada vez que se modifican las calificaciones.

---

## 🎯 Casos de Uso Completos

### Caso 1: Proceso Completo de Inscripción

```javascript
// 1. Verificar que el estudiante existe
leerEstudiante("E005")

// 2. Verificar prerrequisitos de las materias deseadas
verificarPrerrequisitos("ARQ-005", "E005")  // true
verificarPrerrequisitos("BBDD-002", "E005") // false (requiere ALG-001)

// 3. Inscribir solo las materias válidas
inscripcionMultipleMaterias_VALIDADA("E005", "2025-1", ["ARQ-005", "CAL-001"])
// ✅ Inscripción exitosa de 2 materias

// 4. Verificar las inscripciones
db.inscripciones.find({
    estudiante_codigo: "E005",
    periodo: "2025-1"
}).pretty()
```

### Caso 2: Ciclo Completo de una Materia

```javascript
// 1. Inscripción
inscripcionMultipleMaterias_VALIDADA("E012", "2025-1", ["ING-C-1"])

// 2. Registrar calificaciones parciales
registrarCalificacionParcial("E012", "ING-C-1", "2025-1", {
    tipo: "P1",
    porcentaje: 30,
    nota: Double(3.8)
})

registrarCalificacionParcial("E012", "ING-C-1", "2025-1", {
    tipo: "P2",
    porcentaje: 30,
    nota: Double(4.2)
})

registrarCalificacionParcial("E012", "ING-C-1", "2025-1", {
    tipo: "PF",
    porcentaje: 40,
    nota: Double(3.5)
})

// 3. Registrar nota final y actualizar promedio
registrarNotaYActualizarPromedio("E012", "ING-C-1", 3.8, "2025-1")
// ✅ Nota registrada (3.8, Aprobada). Promedio actualizado.

// 4. Verificar actualización automática de créditos (si Change Stream activo)
db.estudiantes.findOne({codigo: "E012"})
// creditos_cursados: 80 (75 + 5 de ING-C-1)
```

### Caso 3: Identificar y Apoyar Estudiantes en Riesgo

```javascript
// 1. Generar reporte de estudiantes en riesgo
const estudiantesRiesgo = listarEstudiantesEnRiesgo().toArray()

// 2. Activar monitoreo en tiempo real
streamNotificacionRiesgo()

// 3. Cuando un estudiante cae en riesgo, se genera alerta automática
// (El Change Stream detecta cambios en promedio_acumulado < 3.0)

// 4. Consultar historial académico del estudiante
db.inscripciones.find({
    estudiante_codigo: "E007",
    estado_materia: {$in: ["Aprobada", "Reprobada"]}
}).sort({periodo: 1}).pretty()

// 5. Identificar materias problemáticas
reporteMateriasMasReprobadas().forEach(printjson)
```

### Caso 4: Proceso de Graduación

```javascript
// 1. Verificar créditos del estudiante
const estudiante = db.estudiantes.findOne({codigo: "E003"})
print(`Créditos cursados: ${estudiante.creditos_cursados}`)
print(`Créditos requeridos: 160`)

// 2. Si faltan créditos, ver materias pendientes
db.materias.find({
    programa_codigo: estudiante.programa_codigo
}).forEach(materia => {
    const inscripcion = db.inscripciones.findOne({
        estudiante_codigo: "E003",
        materia_codigo: materia.codigo,
        estado_materia: "Aprobada"
    })
    if (!inscripcion) {
        print(`Pendiente: ${materia.codigo} - ${materia.nombre}`)
    }
})

// 3. Intentar graduación
graduarEstudiante("E003")
// Si tiene 160+ créditos: ✅ Graduado
// Si no: ❌ Créditos insuficientes
```

---

## 🔧 Solución de Problemas

### Problema 1: "Transaction numbers are only allowed on a replica set member or mongos"

**Causa**: MongoDB no está configurado como Replica Set.

**Solución**:
```bash
# Detener MongoDB
# Iniciar con replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db

# En otra terminal
mongosh
rs.initiate()
```

### Problema 2: "Document failed validation"

**Causa**: Los datos no cumplen con el esquema `$jsonSchema`.

**Ejemplos comunes**:

```javascript
// ❌ Email sin dominio institucional
db.estudiantes.insertOne({
    codigo: "E999",
    email_institucional: "test@gmail.com", // ❌ Debe ser @unal.edu.co
    // ...
})

// ✅ Correcto
db.estudiantes.insertOne({
    codigo: "E999",
    email_institucional: "test@unal.edu.co", // ✅
    // ...
})

// ❌ Promedio sin tipo Double
db.estudiantes.insertOne({
    promedio_acumulado: 3.5, // ❌ Debe ser Double(3.5)
    // ...
})

// ✅ Correcto
db.estudiantes.insertOne({
    promedio_acumulado: Double(3.5), // ✅
    // ...
})
```

### Problema 3: Change Streams no detectan cambios

**Causa**: El listener no está activo o el replica set no está configurado.

**Solución**:
1. Verificar replica set: `rs.status()`
2. Ejecutar el listener en una terminal separada
3. Asegurarse de que el listener esté corriendo antes de hacer cambios

### Problema 4: Transacción abortada sin razón clara

**Causa**: Validaciones de negocio fallaron (prerrequisitos, unicidad, etc.)

**Solución**:
```javascript
// Revisar los mensajes de error en la consola
// Verificar manualmente las validaciones

// Ejemplo: Verificar prerrequisitos antes de inscribir
verificarPrerrequisitos("BBDD-002", "E004")
// Si retorna false, revisar qué prerrequisitos faltan

db.materias.findOne({codigo: "BBDD-002"})
// Ver el array de prerrequisitos

db.inscripciones.find({
    estudiante_codigo: "E004",
    estado_materia: "Aprobada"
})
// Ver qué materias ha aprobado el estudiante
```

### Problema 5: Funciones no definidas

**Causa**: Los scripts no se han cargado correctamente.

**Solución**:
```javascript
// Cargar manualmente los scripts
load("scripts/03-Validations.js")
load("scripts/04-CRUD-Functions.js")
load("scripts/05-Transactions.js")
load("scripts/06-Agregations.js")
load("scripts/07-Change-Streams.js")

// Verificar que las funciones estén disponibles
typeof inscripcionMultipleMaterias_VALIDADA
// Debe retornar: "function"
```

---

## 📖 Recursos Adicionales

### Comandos Útiles de MongoDB

```javascript
// Ver todas las bases de datos
show dbs

// Usar una base de datos
use universidad

// Ver colecciones
show collections

// Ver índices de una colección
db.estudiantes.getIndexes()

// Ver estadísticas de una colección
db.estudiantes.stats()

// Explicar un query (plan de ejecución)
db.estudiantes.find({codigo: "E001"}).explain("executionStats")

// Crear índice para mejorar rendimiento
db.estudiantes.createIndex({codigo: 1})
db.inscripciones.createIndex({estudiante_codigo: 1, periodo: 1})

// Ver el esquema de validación
db.getCollectionInfos({name: "estudiantes"})[0].options.validator
```

### Backup y Restore

```bash
# Backup de la base de datos
mongodump --db universidad --out /backup/

# Restore de la base de datos
mongorestore --db universidad /backup/universidad/

# Exportar una colección a JSON
mongoexport --db universidad --collection estudiantes --out estudiantes.json

# Importar una colección desde JSON
mongoimport --db universidad --collection estudiantes --file estudiantes.json
```

---

## 🎓 Conclusión

Este manual cubre todos los aspectos del Sistema Académico MongoDB. Para más información sobre el diseño y arquitectura del sistema, consulta el [README.md](./README.md).

**Puntos clave a recordar**:

1. ⚠️ **Replica Set es obligatorio** para transacciones y Change Streams
2. 🔒 **Las validaciones son estrictas** - todos los datos deben cumplir el esquema
3. 📧 **Email institucional** debe terminar en `@unal.edu.co`
4. 💾 **Usar `Double()`** para promedios y calificaciones
5. 🔔 **Change Streams** deben ejecutarse en proceso separado
6. ⚛️ **Transacciones** garantizan atomicidad (todo o nada)

---

**¿Preguntas o problemas?** Consulta la sección de [Solución de Problemas](#solución-de-problemas) o revisa los scripts de ejemplo.
