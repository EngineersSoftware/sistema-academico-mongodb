# Sistema Académico MongoDB

## Descripción
Este proyecto implementa un sistema académico universitario utilizando MongoDB como base de datos NoSQL. Incluye colecciones para gestionar estudiantes, profesores, materias, programas, inscripciones, auditoría y historial de calificaciones, con scripts para inicialización, inserción de datos, operaciones CRUD, transacciones, agregaciones y monitoreo con Change Streams.

## Estructura del Proyecto

```bash
sistema-academico-mongodb/
├── scripts/
│   ├── setup.js              # Creación de colecciones e índices
│   ├── insert-data.js        # Inserción de datos (20 documentos por colección)
│   ├── crud.js               # Funciones CRUD documentadas
│   ├── transactions.js       # Transacciones para operaciones críticas
│   ├── aggregations.js       # Funciones de agregación para reportes
│   ├── changestreams.js      # Configuración de Change Streams
├── docs/
│   ├── diseño.md             # Documento de diseño del sistema
│   ├── manual.md             # Manual de usuario
├── backups/
│   ├── README.md             # Instrucciones para backups/restauración
├── README.md                 # Este archivo
```


## Requisitos
- MongoDB Community Server (versión 4.0 o superior)
- `mongosh` (MongoDB Shell)
- Opcional: MongoDB Compass para visualización gráfica
- Sistema operativo: Windows, macOS o Linux

## Instalación y Configuración
1. **Instalar MongoDB**:
   - Descarga desde https://www.mongodb.com/try/download/community.
   - Sigue las instrucciones para tu sistema operativo.
   - Inicia el servidor con `mongod`.
2. **Acceder a mongosh**:
   - Abre una terminal y ejecuta `mongosh`.
   - Usa la base de datos: `use universidad`.
3. **Clonar o descargar el proyecto**:
   - Coloca los archivos en una carpeta local, e.g., `sistema-academico-mongodb/`.

## Ejecución
1. **Crear colecciones e índices**:
   - En `mongosh`, ejecuta: `load('scripts/setup.js')`.
2. **Insertar datos iniciales**:
   - Ejecuta: `load('scripts/insert-data.js')`.
3. **Cargar funciones**:
   - CRUD: `load('scripts/crud.js')`.
   - Transacciones: `load('scripts/transactions.js')`.
   - Agregaciones: `load('scripts/aggregations.js')`.
   - Change Streams: `load('scripts/changestreams.js')` (mantén activo para monitoreo).
4. **Ejemplo de comandos**:
   - Crear estudiante: `createEstudiante({ codigo: "EST021", nombre: "Test", email: "test@uni.edu.co", programa: {id: db.programas.findOne()._id, nombre: "Test"}, semestre_actual: 1, promedio_acumulado: 3.0, estado: "Activo", creditos_cursados: 0 })`.
   - Reporte de riesgo: `estudiantesEnRiesgo()`.
   - Inscribir estudiante: `inscribirMultiples("EST001", ["MAT101", "BD101"], "2025-2")`.

## Documentación
- **Diseño**: Detalles en `docs/diseño.md` (esquema, validaciones, comparativa SQL vs NoSQL).
- **Manual de usuario**: Instrucciones detalladas en `docs/manual.md`, con ejemplos y uso de MongoDB Compass.
- **Backups**: Guía en `backups/README.md` para respaldos con `mongodump` y restauración con `mongorestore`.

## Notas
- Asegúrate de ejecutar los scripts en orden: `setup.js` primero, luego `insert-data.js`, y después los demás según necesidad.
- Los Change Streams requieren que `mongosh` permanezca abierto para monitoreo continuo.
- Usa MongoDB Compass para explorar datos, exportar reportes o visualizar agregaciones.

## Contacto
Para dudas o soporte, consulta el manual de usuario o contacta al administrador del sistema.