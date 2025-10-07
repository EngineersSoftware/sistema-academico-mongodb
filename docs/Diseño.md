# Diseño del Sistema Académico en MongoDB

## Diagrama de Colecciones y Relaciones
- **estudiantes**: Embebido: `materias_cursadas` (historial académico). Referencia: `programa.id` -> `programas._id`.
- **profesores**: Embebido: `materias_asignadas` con referencias a `materias._id`.
- **materias**: Colección independiente, referenciada por `inscripciones` y `profesores`.
- **programas**: Embebido: `plan_estudio` con referencias a `materias._id`.
- **inscripciones**: Referencias: `estudiante_id` -> `estudiantes._id`, `materia_id` -> `materias._id`.

**Justificación**:
- Embebido en `materias_cursadas` para consultas rápidas de historial sin joins.
- Referencias en `inscripciones` y `programas` para evitar duplicación de datos.
- Índices en códigos y relaciones para optimizar consultas.

## Validaciones Implementadas
1. **Email institucional**: Regex `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`. Beneficio: Garantiza comunicaciones válidas.
2. **Calificaciones (0.0-5.0)**: En `promedio_acumulado`, `nota_final`, `calificacion`. Beneficio: Consistencia en métricas académicas.
3. **Semestres (1-12)**: En `semestre_actual`, `plan_estudio`. Beneficio: Progresión lógica del estudiante.
4. **Estados válidos**: Enum en `estado` (`Activo`, `Inactivo`, `Graduado`, `Retirado`). Beneficio: Controla flujos de inscripción/graduación.
5. **Créditos por materia (1-6)**: En `creditos`. Beneficio: Planes de estudio realistas.
6. **Fechas válidas**: En `fecha_nacimiento`, `fecha_inscripcion`. Beneficio: Evita anacronismos en auditorías.

## Funciones de Agregación y Utilidad
1. **promedioPorMateria**: Calcula promedio de calificaciones por materia. Utilidad: Identifica materias difíciles para ajustes curriculares.
2. **estudiantesEnRiesgo**: Lista estudiantes con promedio < 3.0. Utilidad: Alertas para programas de retención.
3. **materiasMasReprobadas**: Reporta materias con más reprobaciones. Utilidad: Detecta problemas en enseñanza.
4. **cargaProfesores**: Calcula materias asignadas por período. Utilidad: Balancea cargas académicas.
5. **estadisticasGraduacion**: Cuenta graduados por programa y promedio. Utilidad: Evalúa éxito de programas.
6. **rankingEstudiantes**: Top estudiantes por programa. Utilidad: Reconocimientos y becas.
7. **analisisDesercion**: Estadísticas de retiro por semestre. Utilidad: Identifica patrones de abandono.

## Change Streams y Casos de Uso
1. **Auditoría en estudiantes**: Registra cambios (insert/update/delete). Caso: Cumplimiento normativo.
2. **Notificación de riesgo**: Alerta si promedio cae < 3.0. Caso: Intervención académica.
3. **Actualización de créditos**: Incrementa `creditos_cursados` al aprobar materia. Caso: Seguimiento automático.
4. **Validación de cupos**: Limita inscripciones a 30 por materia/periodo. Caso: Control de capacidad.
5. **Historial de calificaciones**: Registra cambios en calificaciones. Caso: Resolución de disputas.

## Comparación SQL vs NoSQL
- **SQL**: Estructura rígida con tablas y foreign keys. Joins costosos para historiales. Bueno para integridad estricta, pero menos flexible para datos variables (e.g., nuevos tipos de evaluación requieren ALTER TABLE).
- **NoSQL (MongoDB)**: Esquemas flexibles, documentos embebidos para performance (sin joins). Aggregations potentes para reportes. Escalable horizontalmente. Desventaja: Requiere transacciones explícitas para atomicidad, pero MongoDB 4.0+ lo soporta.