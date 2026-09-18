# Ejemplo de aplicación web con Express.js

Esta simple aplicación web implementa una API para el manejo de alumnos. Se utiliza Redis como base de datos para persistir la información.

## Setup

Instalar las dependencias con `yarn`:

```
  nvm use
  corepack enable
  yarn install
```

Crear los archivos con las variables de ambiente para acceder a la BD en los ambientes de desarrollo y test:

1. Crea un nuevo archivo `.env` en el directorio raíz del proyecto con el siguiente contenido:
  ```
  REDIS_URL=redis://localhost:6378
  ```
  Esto configura el connection string para el ambiente de desarrollo.

2. Crea un nuevo archivo `.env.test` en el directorio raíz del proyecto con el siguiente contenido (notar el cambio de puerto):
  ```
  REDIS_URL=redis://localhost:6377
  ```
  Esto configura el connection string para el ambiente de pruebas.

## Ejecutar las pruebas

Para correr las pruebas utilizá el comando `yarn test` y `yarn test:e2e`

## Ejecutar la aplicación

Para correr la aplicación utilizá el comando `yarn start`
