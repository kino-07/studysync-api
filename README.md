# StudySync API 🎓

API REST para gestión de grupos de estudio — Programación IV, UPDS 2026.

## Entidad: Grupos de Estudio

Cada grupo tiene: `id`, `nombre`, `materia`, `turno`, `activo`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/grupos | Listar todos los grupos |
| GET | /api/grupos/:id | Obtener un grupo por ID |
| POST | /api/grupos | Crear un nuevo grupo |
| PUT | /api/grupos/:id | Actualizar un grupo |
| DELETE | /api/grupos/:id | Eliminar un grupo |

## URL de Producción

https://TU-APP.onrender.com

//URL de Render

https://studysync-api-prv0.onrender.com

## Cómo correr localmente

```bash
npm install
npm start
```