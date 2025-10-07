# Instrucciones para Backups y Restauración

## Crear Backup
1. Abre terminal.
2. Ejecuta: `mongodump --db universidad --out sistema-academico-mongodb/backups/universidad_backup_$(date +%F)`.
3. Resultado: Carpeta con archivos BSON