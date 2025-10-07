# Manual de Usuario - Sistema Académico MongoDB

## Instalación y Configuración
1. **Instalar MongoDB**:
   - Descarga MongoDB Community Server desde https://www.mongodb.com/try/download/community.
   - Instala y ejecuta `mongod` en terminal (o configúralo como servicio).
   - Opcional: Instala MongoDB Compass para visualización gráfica.
2. **Crear base de datos**:
   - Abre terminal, ejecuta `mongosh`.
   - Usa: `use universidad`.
3. **Cargar scripts**:
   - Coloca archivos en `sistema-academico-mongodb/scripts/`.
   - En mongosh, ejecuta `load('ruta/a/scripts/setup.js')`, luego `insert-data.js`, etc.

## Instrucciones para Ejecutar Scripts
1. **Iniciar mongosh**: En terminal, ejecuta `mongosh`, luego `use universidad`.
2. **Cargar scripts**:
   - `load('scripts/setup.js')`: Crea colecciones.
   - `load('scripts/insert-data.js')`: Inserta datos.
   - `load('scripts/crud.js')`: Carga funciones CRUD.
   - `load('scripts/transactions.js')`: Carga transacciones.
   - `load('scripts/aggregations.js')`: Carga funciones de agregación.
   - `load('scripts/changestreams.js')`: Configura Change Streams (deja corriendo, Ctrl+C para parar).
3. **Ejecutar ejemplos**:
   - CRUD: `createEstudiante({ codigo: "EST021", nombre: "Test", email: "test@uni.edu.co", programa: {id: db.programas.findOne()._id, nombre: "Test"}, semestre_actual: 1, promedio_acumulado: 3.0, estado: "Activo", creditos_cursados: 0 })`.
   - Agregación: `estudiantesEnRiesgo()`.
   - Transacción: `inscribirMultiples("EST001", ["MAT101", "BD101"], "2025-2")`.

## Ejemplos de Uso
1. **Inscribir estudiante**: `inscribirEstudiante("EST001", "BD101", "2025-1")` -> `{ success: true, mensaje: "Inscripción realizada exitosamente" }`.
2. **Reporte de riesgo**: `estudiantesEnRiesgo()` -> Lista estudiantes con promedio < 3.0.
3. **Actualizar calificación**: `registrarCalificacion(ObjectId("inscripcion_id"), 4.0)` -> Actualiza estado y promedio.
4. **Ver carga profesores**: `cargaProfesores("2025-1")` -> Muestra profesores y número de materias.

## Capturas de Pantalla
1. **MongoDB Compass**:
   - Conecta a `localhost:27017`, selecciona `universidad`.
   - Ve a `estudiantes`, filtra `{ estado: "Activo" }`, exporta JSON para reporte.
   - Ejemplo: Lista de 20 estudiantes con nombre, código, promedio.
2. **Change Streams**:
   - Carga `changestreams.js`, actualiza un estudiante (`updateEstudiante("EST001", { promedio_acumulado: 2.9 })`).
   - Verifica en `auditoria` los logs de cambios.
3. **Reportes**:
   - Ejecuta `materiasMasReprobadas()` en mongosh, copia resultado JSON.
   - En Compass, usa Aggregation Builder para visualizar `promedioPorMateria`.

**Nota**: Usa Compass para explorar datos visualmente. Exporta colecciones a JSON para respaldos o reportes.