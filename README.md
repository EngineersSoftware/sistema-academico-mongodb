# 🎓 Sistema Académico MongoDB

## 📋 Descripción General

El **Sistema Académico MongoDB** es una solución integral de base de datos NoSQL diseñada para gestionar información académica universitaria con énfasis en **integridad de datos** y **análisis en tiempo real**. El sistema implementa un modelo de datos basado en referencias de tipo `string` (códigos como `E001`, `BBDD-002`) en lugar de `ObjectId`, facilitando la trazabilidad y las consultas.

### 🎯 Enfoque del Sistema

Este proyecto demuestra las capacidades avanzadas de MongoDB para aplicaciones empresariales:

- **Integridad de Datos**: Validaciones de esquema (`$jsonSchema`) y lógica de negocio (funciones JavaScript)
- **Atomicidad**: Transacciones multi-documento para operaciones críticas
- **Análisis Avanzado**: Pipelines de agregación para reportes en tiempo real
- **Reactividad**: Change Streams para triggers asíncronos y auditoría

### 🏗️ Colecciones Principales

- **`estudiantes`**: Información de estudiantes con validación de email institucional (`@unal.edu.co`)
- **`materias`**: Catálogo de materias con prerrequisitos y créditos
- **`profesores`**: Registro de profesores y materias asignadas
- **`inscripciones`**: Relación estudiante-materia con calificaciones y estados

## 🎯 Objetivos del Proyecto

1. ✅ **Gestión de datos académicos**: Almacenar y consultar información sobre materias, profesores, estudiantes e inscripciones
2. 🔒 **Validación de datos**: Asegurar consistencia mediante esquemas de validación y verificaciones personalizadas
3. ⚡ **Operaciones avanzadas**: Implementar transacciones ACID, consultas complejas y reportes analíticos
4. 🔄 **Monitoreo en tiempo real**: Usar Change Streams para reaccionar a cambios en la base de datos
5. 📊 **Análisis de rendimiento**: Generar reportes de estudiantes en riesgo, tasas de reprobación y rankings

## 📁 Estructura del Proyecto

```
sistema-academico-mongodb/
|___docs/  # Manual de uso y justificaciones
├── scripts/
│   ├── 01-insert-date.js          # 📥 Datos iniciales (20+ docs por colección)
│   ├── 02-create-collection.js    # 🏗️ Creación de colecciones con $jsonSchema
│   ├── 03-Validations.js          # ✔️ Funciones de validación de negocio
│   ├── 04-CRUD-Functions.js       # 📝 Operaciones CRUD para todas las colecciones
│   ├── 05-Transactions.js         # 🔐 Transacciones multi-documento
│   ├── 06-Agregations.js          # 📊 Pipelines de agregación y reportes
│   └── 07-Change-Streams.js       # 🔔 Listeners de eventos en tiempo real
├── README.md                       # 📖 Documentación general (este archivo)
└── manual-de-uso.md               # 📚 Guía detallada de uso
```

## 🔑 Componentes Funcionales

### A. 🛡️ Integridad de Datos (Validaciones)

#### 1. Validaciones de Esquema (`$jsonSchema`)

Implementadas en `02-create-collection.js`:

- **Email institucional**: Pattern regex `@unal\.edu\.co$`
- **Rangos de notas**: `calificacion_final` entre `0.0` y `5.0`
- **Estados enumerados**: `estado` con valores `['Activo', 'Inactivo', 'Retirado', 'Graduado']`
- **Créditos y semestres**: Validación de rangos numéricos

#### 2. Validaciones de Lógica de Negocio

Implementadas en `03-Validations.js`:

- **`esCodigoUnico(coleccion, codigo)`**: Verifica unicidad de códigos
- **`esEmailInstitucionalValidoYUnico(email, coleccion)`**: Valida formato y unicidad de emails
- **`verificarPrerrequisitos(codigoMateria, codigoEstudiante)`**: ⚠️ **Función crítica** que verifica si el estudiante tiene la materia prerrequisito con `estado_materia: "Aprobada"`
- **`validarInscripcionUnica(codigoEstudiante, codigoMateria, periodo)`**: Previene inscripciones duplicadas

### B. ⚛️ Atomicidad (Transacciones Multi-Documento)

Implementadas en `05-Transactions.js` usando la API de Transacciones de MongoDB:

#### 1. **Inscripción Múltiple** (`inscripcionMultipleMaterias_VALIDADA`)

```javascript
inscripcionMultipleMaterias_VALIDADA("E001", "2025-1", ["MAT005", "FIS001", "IND-303"]);
```

- Inscribe en N materias verificando prerrequisitos
- **Todo o nada**: Si falla una materia, se revierten todas las inscripciones
- Garantiza consistencia en inscripciones masivas

#### 2. **Registro de Nota Crítica** (`registrarNotaYActualizarPromedio`)

```javascript
registrarNotaYActualizarPromedio("E002", "ALG-001", 3.5, "2024-2");
```

- Registra `calificacion_final` **Y** actualiza `promedio_acumulado` **Y** actualiza `creditos_cursados`
- Recalcula el promedio ponderado considerando todas las materias finalizadas
- Operación atómica que previene inconsistencias

#### 3. **Retiro de Materia** (`retirarMateria`)

Cambia el estado a "Retirada" manteniendo la integridad del historial.

#### 4. **Graduación de Estudiante** (`graduarEstudiante`)

Valida requisitos de créditos (160 mínimo) antes de cambiar el estado a "Graduado".

### C. 📊 Análisis y Reportes (Agregación)

Implementadas en `06-Agregations.js` usando el *Aggregation Framework*:

#### 1. **Estudiantes en Riesgo** (`listarEstudiantesEnRiesgo`)

```javascript
listarEstudiantesEnRiesgo().forEach(printjson);
```

Lista estudiantes activos con `promedio_acumulado < 3.0`.

#### 2. **Tasa de Reprobación** (`reporteMateriasMasReprobadas`)

```javascript
reporteMateriasMasReprobadas().forEach(printjson);
```

Calcula el porcentaje de reprobación por materia usando `$group` y `$cond`.

#### 3. **Ranking TOP 5** (`rankingMejoresEstudiantes`)

```javascript
rankingMejoresEstudiantes().forEach(printjson);
```

Genera un ranking de los 5 mejores estudiantes por programa usando `$group` y `$slice`.

#### 4. **Promedio por Materia** (`calcularPromedioPorMateria`)

Calcula el promedio de calificaciones finales con `$lookup` para traer nombres de materias.

#### 5. **Carga Académica** (`calcularCargaAcademica`)

Analiza el número de materias asignadas a cada profesor en un período.

#### 6. **Análisis de Deserción** (`analisisDesercion`)

Reporta estudiantes en estado "Retirado" o "Inactivo" por programa.

### D. 🔔 Reactividad (Change Streams)

Implementadas en `07-Change-Streams.js` para triggers asíncronos:

#### 1. **Actualización Automática de Créditos** (`streamActualizarCreditos`)

```javascript
streamActualizarCreditos();
```

- Reacciona a inscripciones con `estado_materia: "Aprobada"`
- Incrementa automáticamente `creditos_cursados` usando `$inc`
- Mantiene sincronización en tiempo real

#### 2. **Notificación de Riesgo** (`streamNotificacionRiesgo`)

```javascript
streamNotificacionRiesgo();
```

- Alerta cuando `promedio_acumulado` cae por debajo de `3.0`
- Útil para sistemas de alerta temprana

#### 3. **Auditoría** (`streamAuditoriaEstudiantes`)

```javascript
streamAuditoriaEstudiantes();
```

- Registra todos los `UPDATE` y `REPLACE` en `db.estudiantes`
- Guarda cambios en colección `auditoria_estudiantes`

#### 4. **Validación de Cupos** (`streamValidacionCupos`)

Monitorea inscripciones para alertar sobre sobrecupos.

#### 5. **Historial de Calificaciones** (`streamHistorialCalificaciones`)

Crea un registro histórico de modificaciones de notas.

## 🆚 Comparación con SQL

| **Concepto SQL** | **Equivalente MongoDB** | **Implementación** |
|------------------|-------------------------|---------------------|
| `FOREIGN KEY` | Referencias por código `string` | `estudiante_codigo`, `materia_codigo` |
| `CHECK CONSTRAINT` | `$jsonSchema` validator | `pattern`, `enum`, `minimum`, `maximum` |
| `TRIGGER` | Change Streams | `db.collection.watch()` |
| `TRANSACTION` | Multi-document Transactions | `session.startTransaction()` |
| `JOIN` | `$lookup` en aggregation | Pipeline con `$lookup` + `$unwind` |
| `GROUP BY` | `$group` | Aggregation pipeline |
| `HAVING` | `$match` después de `$group` | Pipeline stages |
| `STORED PROCEDURE` | Funciones JavaScript | Funciones en scripts |

## ⚙️ Requisitos

- **MongoDB**: Versión 4.0+ con **Replica Set** (obligatorio para transacciones y Change Streams)
- **MongoDB Compass**: Versión 1.47.0+ (opcional, para ejecución gráfica)
- **Mongo Shell** (`mongosh` o `mongo`): Para ejecución en terminal
- **Editor de texto**: Visual Studio Code, Notepad++, etc.
- **Sistema operativo**: Windows, macOS o Linux

## 🚀 Instalación y Configuración

### 1. Configurar MongoDB con Replica Set

⚠️ **IMPORTANTE**: Las transacciones y Change Streams requieren un Replica Set.

```bash
# Iniciar MongoDB con replica set
mongod --replSet rs0 --port 27017 --dbpath /data/db

# En otra terminal, conectar y inicializar el replica set
mongosh
rs.initiate()
```

### 2. Clonar o Descargar el Proyecto

```bash
git clone <repository-url>
cd sistema-academico-mongodb
```

### 3. Verificar la Estructura

Asegúrate de que todos los scripts estén en la carpeta `scripts/`.

## 🎬 Ejecución

### Orden de Carga de Scripts

**Ejecuta los scripts en el siguiente orden**:

```bash
# 1. Crear colecciones con validaciones
mongosh universidad < scripts/02-create-collection.js

# 2. Insertar datos iniciales
mongosh universidad < scripts/01-insert-date.js

# 3. Cargar funciones de validación
mongosh universidad < scripts/03-Validations.js

# 4. Cargar funciones CRUD
mongosh universidad < scripts/04-CRUD-Functions.js

# 5. Cargar funciones de transacciones
mongosh universidad < scripts/05-Transactions.js

# 6. Cargar funciones de agregación
mongosh universidad < scripts/06-Agregations.js

# 7. Activar Change Streams (en proceso separado)
mongosh universidad < scripts/07-Change-Streams.js
```

### Ejecución en MongoDB Compass

1. Conectar a `mongodb://localhost:27017`
2. Seleccionar la base de datos `universidad`
3. Abrir el shell (pestaña "Mongosh")
4. Copiar y pegar el contenido de cada script en orden

## ✅ Verificación

### Confirmar Colecciones

```javascript
use universidad
db.getCollectionNames()
// Resultado esperado: ["estudiantes", "inscripciones", "materias", "profesores"]
```

### Verificar Documentos

```javascript
db.materias.countDocuments();       // 20
db.profesores.countDocuments();     // 20
db.estudiantes.countDocuments();    // 20
db.inscripciones.countDocuments();  // 20+
```

### Probar Funciones

```javascript
// Listar estudiantes en riesgo
listarEstudiantesEnRiesgo().forEach(printjson);

// Ver tasa de reprobación
reporteMateriasMasReprobadas().forEach(printjson);

// Ranking de mejores estudiantes
rankingMejoresEstudiantes().forEach(printjson);
```

## 📝 Notas Importantes

- ⚠️ **Replica Set Obligatorio**: Las transacciones y Change Streams NO funcionarán sin un replica set configurado
- 🔒 **Validaciones Estrictas**: Los esquemas están configurados con `validationLevel: "strict"` y `validationAction: "error"`
- 📧 **Email Institucional**: Solo se aceptan emails con dominio `@unal.edu.co`
- 🔢 **Códigos String**: El sistema usa códigos de tipo `string` (ej: `E001`, `BBDD-002`) en lugar de `ObjectId` para facilitar la trazabilidad
- 💾 **Tipo Double**: Los promedios y calificaciones deben usar `Double()` para cumplir con el esquema

## 🔍 Casos de Uso Principales

### 1. Inscripción de Estudiante con Validación de Prerrequisitos

```javascript
// El estudiante E001 intenta inscribirse en materias avanzadas
inscripcionMultipleMaterias_VALIDADA("E001", "2025-1", ["BBDD-002", "IND-303"]);
// ✅ BBDD-002 requiere ALG-001 (ya aprobada)
// ❌ IND-303 requiere EST-001 (no aprobada) → Transacción abortada
```

### 2. Registro de Nota con Actualización Automática de Promedio

```javascript
// Registrar nota final y recalcular promedio
registrarNotaYActualizarPromedio("E007", "EST-001", 3.5, "2024-2");
// Actualiza: calificacion_final, estado_materia, promedio_acumulado, creditos_cursados
```

### 3. Monitoreo en Tiempo Real de Estudiantes en Riesgo

```javascript
// Activar listener de riesgo académico
streamNotificacionRiesgo();
// Cuando el promedio de un estudiante baja de 3.0, se genera una alerta automática
```

## 📚 Documentación Adicional

Para ejemplos detallados de uso, consulta:
- 📖 **[Manual de Uso](./manual-de-uso.md)**: Guía paso a paso con ejemplos prácticos

## 🤝 Contribuciones

Este proyecto fue desarrollado como demostración de capacidades avanzadas de MongoDB. Para sugerencias o mejoras, abre un issue o pull request.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con 💙 para demostrar las capacidades empresariales de MongoDB**
