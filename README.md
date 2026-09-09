# MiniBlog API

API REST desarrollada como Proyecto Integrador del Módulo 2 de Soy Henry.

El proyecto permite gestionar autores y publicaciones mediante operaciones CRUD, utilizando Node.js, Express y PostgreSQL.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Supertest
- OpenAPI 3.0

## Instalación y ejecución local

1. Clonar el repositorio.

2. Ingresar a la carpeta del backend:

   ```bash
   cd Desarrollo
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` dentro de la carpeta `Desarrollo` tomando como referencia `.env.example`.

   Ejemplo:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=miniblog
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. Crear en PostgreSQL una base de datos llamada `miniblog`.

6. Ejecutar los scripts SQL ubicados en la carpeta `sql`:

   - `setup.sql`: crea las tablas `authors` y `posts`, sus relaciones e índices.
   - `seed.sql`: agrega datos iniciales para probar la API.

7. Iniciar el servidor:

  ```bash
npm start
   ```

La API estará disponible localmente en:

`http://localhost:3000`

## Endpoints

### Autores

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un nuevo autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Publicaciones

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener los posts de un autor junto con sus datos |
| POST | `/posts` | Crear un nuevo post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## Tests

El proyecto incluye tests de la API realizados con Supertest y el módulo de testing de Node.js.

Para ejecutar los tests:

```bash
npm test
```

Los tests verifican el funcionamiento de endpoints de autores y publicaciones, incluyendo respuestas exitosas, recursos inexistentes y validaciones de datos.

## Documentación OpenAPI

La documentación de la API se encuentra en:

```text
Desarrollo/docs/openapi.yaml
```

El archivo utiliza OpenAPI 3.0 y fue validado con Redocly CLI.

Para validar la documentación:

```bash
npx @redocly/cli lint docs/openapi.yaml
```

La documentación también puede consultarse mediante Swagger UI.

### Swagger UI local

Con el servidor en ejecución:

`http://localhost:3000/docs`

### Swagger UI en producción

`https://proyectom2agustinapedernera-production-ab0e.up.railway.app/docs`

## Estructura del proyecto

```text
ProyectoM2_AgustinaPedernera/
├── README.md
├── Desarrollo/
│   ├── docs/
│   │   └── openapi.yaml
│   ├── src/
│   │   ├── db/
│   │   │   └── pool.js
│   │   ├── app.js
│   │   ├── app.test.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
└── sql/
    ├── setup.sql
    └── seed.sql
```


## Uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizó ChatGPT como herramienta de apoyo para comprender conceptos, resolver errores y revisar la implementación.

La IA fue utilizada principalmente para:

- Comprender la conexión entre Node.js, Express y PostgreSQL.
- Resolver dudas sobre consultas SQL y el uso de `pg`.
- Comprender el funcionamiento de rutas, parámetros, request y response.
- Detectar y corregir errores durante el desarrollo de los endpoints.
- Revisar validaciones y códigos de estado HTTP.
- Comprender y preparar los tests realizados con Supertest.
- Revisar la documentación OpenAPI.
- Organizar la documentación del proyecto.

Las funcionalidades fueron implementadas y probadas durante el desarrollo utilizando PostgreSQL, el navegador, Thunder Client y los tests automatizados.

## Deploy

La API se encuentra desplegada en Railway.

URL pública:

`https://proyectom2agustinapedernera-production-ab0e.up.railway.app`

El despliegue utiliza dos servicios dentro de Railway:

- La aplicación Node.js y Express, desplegada desde el repositorio de GitHub.
- Una base de datos PostgreSQL utilizada para almacenar autores y publicaciones.

La aplicación utiliza la variable de entorno `DATABASE_URL` para conectarse a PostgreSQL en producción.

Debido a que el backend se encuentra dentro de la carpeta `Desarrollo`, esta carpeta fue configurada como Root Directory del servicio en Railway.

La base de datos de producción fue inicializada utilizando los scripts `setup.sql` y `seed.sql`.

Se verificó el funcionamiento de los endpoints `/authors` y `/posts`, así como la documentación Swagger disponible en `/docs`.

La documentación detallada del uso de IA y las evidencias del proceso se encuentran en [Documentacion/uso-ia.md](Documentacion/uso-ia.md).
