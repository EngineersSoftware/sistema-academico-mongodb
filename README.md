Sistema Académico MongoDB

Descripción General

El proyecto SistemaAcademicoMongoDB implementa una base de datos NoSQL en MongoDB para gestionar información académica de una universidad. Incluye colecciones para programas, materias, profesores, estudiantes e inscripciones, con esquemas de validación, datos de prueba, operaciones CRUD, transacciones, agregaciones y monitoreo de cambios mediante Change Streams. El objetivo es proporcionar una solución robusta para administrar registros académicos, garantizando integridad de datos y escalabilidad.

Objetivos





Gestión de datos académicos: Almacenar y consultar información sobre programas, materias, profesores, estudiantes e inscripciones.



Validación de datos: Asegurar consistencia mediante esquemas de validación y verificaciones personalizadas.



Operaciones avanzadas: Implementar consultas, actualizaciones, transacciones y reportes analíticos.



Monitoreo en tiempo real: Usar Change Streams para reaccionar a cambios en la base de datos.

Estructura del Proyecto





scripts/: Scripts JavaScript ejecutables en MongoDB shell o Compass.





01-crear-colecciones.js: Crea las colecciones con esquemas de validación.



02-insertar-datos.js: Inserta al menos 20 documentos por colección.



03-validaciones.js: Verifica unicidad, correos y prerrequisitos.



04-crud-funciones.js: Funciones CRUD para todas las colecciones.



05-transacciones.js: Transacciones para operaciones atómicas.



06-agregaciones.js: Reportes analíticos con pipelines de agregación.



07-change-streams.js: Monitoreo de cambios en inscripciones.



data/: Archivos JSON con datos de prueba para importación manual.





estudiantes.json, profesores.json, materias.json, programas.json, inscripciones.json.



docs/: Documentación del proyecto.





justificaciones.md: Explicación del diseño y validaciones.



manual-de-uso.md: Guía detallada para usar los scripts.



esquema-diagrama.png: Diagrama ER del modelo de datos (generar con Draw.io).

Requisitos





MongoDB: Versión 4.0+ con clúster de réplica para transacciones y Change Streams.



MongoDB Compass: Versión 1.47.0 (opcional, para ejecución gráfica).



Mongo Shell: Para ejecución en terminal.



Editor de texto: Visual Studio Code o Notepad++ (guardar scripts en UTF-8 sin BOM).



Sistema operativo: Windows, macOS o Linux.

Instalación





Crea el directorio SistemaAcademicoMongoDB:

mkdir SistemaAcademicoMongoDB
cd SistemaAcademicoMongoDB
mkdir scripts data docs



Guarda los scripts en scripts/, los archivos JSON en data/, y los documentos Markdown en docs/.



Asegúrate de que MongoDB esté corriendo:

mongod --replSet rs0

Inicia la réplica (si es necesario):

rs.initiate()



Verifica que los archivos estén en UTF-8 sin BOM usando un editor como Notepad++ (Codificación > Convertir a UTF-8 sin BOM).

Ejecución





Ejecuta los scripts en orden desde la terminal:

mongo < SistemaAcademicoMongoDB/scripts/01-crear-colecciones.js
mongo < SistemaAcademicoMongoDB/scripts/02-insertar-datos.js
mongo < SistemaAcademicoMongoDB/scripts/03-validaciones.js
mongo < SistemaAcademicoMongoDB/scripts/04-crud-funciones.js
mongo < SistemaAcademicoMongoDB/scripts/05-transacciones.js
mongo < SistemaAcademicoMongoDB/scripts/06-agregaciones.js
mongo < SistemaAcademicoMongoDB/scripts/07-change-streams.js



Alternativamente, en MongoDB Compass:





Abre el shell (pestaña "Shell" o mongosh).



Copia y pega el contenido de cada script en orden.



(Opcional) Importa datos desde JSON:

mongoimport --db universidad --collection programas --file SistemaAcademicoMongoDB/data/programas.json
mongoimport --db universidad --collection materias --file SistemaAcademicoMongoDB/data/materias.json
mongoimport --db universidad --collection profesores --file SistemaAcademicoMongoDB/data/profesores.json
mongoimport --db universidad --collection estudiantes --file SistemaAcademicoMongoDB/data/estudiantes.json
mongoimport --db universidad --collection inscripciones --file SistemaAcademicoMongoDB/data/inscripciones.json

Nota: Reemplaza "TO_BE_REPLACED" en estudiantes.json y inscripciones.json con ObjectId válidos.

Verificación





Confirma que las colecciones existen:

db.getCollectionNames(); // ["estudiantes", "inscripciones", "materias", "profesores", "programas"]



Verifica el número de documentos:

db.programas.countDocuments(); // 20
db.materias.countDocuments();  // 20
db.profesores.countDocuments(); // 20
db.estudiantes.countDocuments(); // 20
db.inscripciones.countDocuments(); // 20



Revisa las salidas de 06-agregaciones.js y 07-change-streams.js en la consola.

Notas





Los scripts están diseñados para evitar errores como MongoBulkWriteError: Document failed validation al cumplir con el esquema de estudiantes (sin programa.codigo).



Los archivos JSON son ejemplos mínimos; usa 02-insertar-datos.js para datos completos.



Los Change Streams y transacciones requieren un clúster de réplica.



Consulta docs/manual-de-uso.md para ejemplos detallados de uso.

Contribuciones

Este proyecto fue desarrollado con Grok, creado por xAI. Para sugerencias o mejoras, contacta al administrador del proyecto.