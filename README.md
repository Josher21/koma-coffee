# Koma Coffee

**Koma Coffee** es un proyecto full stack desarrollado como proyecto final de DAW.

La aplicación está dividida en dos partes:

- **Frontend:** React + Vite + TypeScript
- **Backend:** Laravel + MariaDB/MySQL

El frontend consume una API REST creada en Laravel.  
El backend gestiona la base de datos, la autenticación por tokens, los roles de usuario, las validaciones y las operaciones CRUD.

---

## Índice

1. [Presentación del proyecto](#1-presentación-del-proyecto)
2. [Tecnologías utilizadas](#2-tecnologías-utilizadas)
3. [Funcionamiento general](#3-funcionamiento-general)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Requisitos para ejecutar en local](#5-requisitos-para-ejecutar-en-local)
6. [Instalación local sin Docker](#6-instalación-local-sin-docker)
7. [Usuarios de prueba](#7-usuarios-de-prueba)
8. [URLs principales](#8-urls-principales)
9. [Comandos útiles](#9-comandos-útiles)
10. [Despliegue opcional con Docker](#10-despliegue-opcional-con-docker)
11. [Demo pública con Cloudflare Tunnel](#11-demo-pública-con-cloudflare-tunnel)
12. [Errores comunes](#12-errores-comunes)

---

## 1. Presentación del proyecto

Koma Coffee es una aplicación web donde los usuarios pueden consultar un catálogo, iniciar sesión y acceder a funcionalidades privadas.

Además, existe un usuario administrador que puede acceder a un panel de administración para gestionar datos mediante operaciones CRUD.

El proyecto demuestra una arquitectura separada entre frontend y backend:

```txt
React  --->  API Laravel  --->  Base de datos
```

React no accede directamente a la base de datos.  
Todas las operaciones se realizan mediante peticiones HTTP a la API de Laravel.

---

## 2. Tecnologías utilizadas

### Frontend

- React
- Vite
- TypeScript
- React Router
- Consumo de API REST

### Backend

- Laravel
- PHP
- Laravel Sanctum
- Eloquent ORM
- Migraciones
- Seeders
- Factories
- Validaciones
- Roles de usuario

### Base de datos

- MariaDB o MySQL

### Opcional para despliegue

- Docker
- Docker Compose
- NGINX
- Cloudflare Tunnel

---

## 3. Funcionamiento general

El funcionamiento básico es el siguiente:

1. El usuario abre la aplicación React.
2. React muestra las páginas usando rutas internas.
3. Cuando necesita datos, React llama a la API de Laravel.
4. Laravel recibe la petición en sus rutas de API.
5. El controlador correspondiente procesa la petición.
6. Laravel consulta o modifica la base de datos.
7. Laravel devuelve una respuesta JSON.
8. React recibe los datos y actualiza la interfaz.

Ejemplo:

```txt
Usuario abre catálogo
        |
React carga la página
        |
React hace GET a /api/books
        |
Laravel consulta la base de datos
        |
Laravel devuelve JSON
        |
React muestra los productos
```

---

## 4. Estructura del proyecto

```txt
koma-coffee/
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── .env.example
│   └── artisan
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

### Archivos importantes del backend

```txt
backend/routes/api.php
```

Contiene las rutas de la API.

```txt
backend/app/Http/Controllers/
```

Contiene los controladores que gestionan las peticiones.

```txt
backend/app/Models/
```

Contiene los modelos y relaciones de Laravel.

```txt
backend/database/migrations/
```

Define las tablas de la base de datos.

```txt
backend/database/seeders/DatabaseSeeder.php
```

Crea datos de prueba para la demo.

### Archivos importantes del frontend

```txt
frontend/src/App.tsx
```

Define las rutas principales de React.

```txt
frontend/src/pages/
```

Contiene las páginas de la aplicación.

```txt
frontend/src/components/
```

Contiene componentes reutilizables.

```txt
frontend/src/services/
```

Contiene la configuración para llamar a la API.

---

## 5. Requisitos para ejecutar en local

Para ejecutar el proyecto sin Docker se necesita instalar:

- Git
- PHP 8.2 o superior
- Composer
- Node.js
- NPM
- MySQL o MariaDB
- Un servidor local como XAMPP, Laragon o similar

Comprobar versiones:

```bash
php -v
composer -V
node -v
npm -v
```

---

## 6. Instalación local sin Docker

Esta es la forma recomendada para probar el proyecto después de clonarlo.

---

### Paso 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd koma-coffee
```

---

### Paso 2. Preparar la base de datos

Crear una base de datos en MySQL o MariaDB.

Por ejemplo:

```sql
CREATE DATABASE koma_coffee;
```

Si usas XAMPP, puedes hacerlo desde phpMyAdmin.

---

### Paso 3. Configurar Laravel

Entrar en la carpeta del backend:

```bash
cd backend
```

Copiar el archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Editar el archivo:

```txt
backend/.env
```

Configurar la conexión a la base de datos:

```env
APP_NAME=KomaCoffee
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=koma_coffee
DB_USERNAME=root
DB_PASSWORD=
```

Si tu MySQL tiene contraseña, debes ponerla en `DB_PASSWORD`.

Instalar dependencias de Laravel:

```bash
composer install
```

Generar la clave de la aplicación:

```bash
php artisan key:generate
```

Ejecutar migraciones y seeders:

```bash
php artisan migrate:fresh --seed
```

Levantar Laravel:

```bash
php artisan serve
```

Por defecto, Laravel quedará disponible en:

```txt
http://localhost:8000
```

La API estará en:

```txt
http://localhost:8000/api
```

Dejar esta terminal abierta.

---

### Paso 4. Configurar React/Vite

Abrir otra terminal desde la raíz del proyecto y entrar al frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Si no existe `.env.example`, crear manualmente:

```txt
frontend/.env
```

Añadir:

```env
VITE_API_URL=http://localhost:8000/api
```

Levantar Vite:

```bash
npm run dev
```

El frontend estará disponible normalmente en:

```txt
http://localhost:5173
```

---

### Paso 5. Probar la aplicación

Abrir en el navegador:

```txt
http://localhost:5173
```

Comprobar también la API:

```txt
http://localhost:8000/api/books
```

Si la API devuelve JSON y el frontend carga el catálogo, la instalación local está funcionando correctamente.

---

## 7. Usuarios de prueba

El seeder crea usuarios preparados para probar la aplicación.

### Administrador

```txt
Email: admin@koma.com
Contraseña: admin123
Rol: ADMIN
```

### Usuario normal

```txt
Email: user@koma.com
Contraseña: user123
Rol: USER
```

El administrador puede acceder al panel de administración.  
El usuario normal solo puede acceder a las funcionalidades permitidas para usuarios.

---

## 8. URLs principales

### Ejecución local sin Docker

```txt
Frontend:
http://localhost:5173

Backend:
http://localhost:8000

API:
http://localhost:8000/api
```

Ejemplo de prueba:

```txt
http://localhost:8000/api/books
```

### Ejecución con Docker

```txt
Frontend:
http://localhost:3000

Backend:
http://localhost:8001

API:
http://localhost:8001/api
```

Ejemplo de prueba:

```txt
http://localhost:8001/api/books
```

---

## 9. Comandos útiles

### Backend Laravel

Entrar al backend:

```bash
cd backend
```

Instalar dependencias:

```bash
composer install
```

Generar clave:

```bash
php artisan key:generate
```

Limpiar caché:

```bash
php artisan optimize:clear
```

Migrar y cargar datos:

```bash
php artisan migrate:fresh --seed
```

Levantar servidor:

```bash
php artisan serve
```

Ver rutas:

```bash
php artisan route:list
```

---

### Frontend React

Entrar al frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Levantar Vite:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

---

## 10. Despliegue opcional con Docker

También se puede levantar el proyecto con Docker Compose.

Esta opción es útil si se quiere ejecutar todo el entorno de forma aislada.

### Paso 1. Configurar backend para Docker

En `backend/.env`, la base de datos debe apuntar al servicio de Docker:

```env
DB_CONNECTION=mysql
DB_HOST=koma_db
DB_PORT=3306
DB_DATABASE=koma_coffee
DB_USERNAME=root
DB_PASSWORD=root
```

Importante:

```env
DB_HOST=koma_db
```

No se debe usar `127.0.0.1` dentro de Docker.

---

### Paso 2. Configurar frontend para Docker

En:

```txt
frontend/.env.production
```

Configurar:

```env
VITE_API_URL=http://localhost:8001/api
```

---

### Paso 3. Levantar contenedores

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

Comprobar contenedores:

```bash
docker ps
```

Preparar Laravel dentro del contenedor:

```bash
docker exec -it koma_app_laravel bash
php artisan key:generate
php artisan optimize:clear
php artisan migrate:fresh --seed
exit
```

Abrir:

```txt
http://localhost:3000
```

Probar API:

```txt
http://localhost:8001/api/books
```

---

## 11. Demo pública con Cloudflare Tunnel

Cloudflare Tunnel permite enseñar la aplicación con una URL pública temporal.

Primero debe funcionar en local.

### Opción usando Laravel y Vite sin Docker

Terminal 1:

```bash
cd backend
php artisan serve
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Terminal 3, exponer backend:

```bash
cloudflared tunnel --url http://localhost:8000
```

Cloudflare dará una URL parecida a:

```txt
https://backend-demo.trycloudflare.com
```

Editar `frontend/.env`:

```env
VITE_API_URL=https://backend-demo.trycloudflare.com/api
```

Reiniciar Vite:

```bash
npm run dev
```

Terminal 4, exponer frontend:

```bash
cloudflared tunnel --url http://localhost:5173
```

Cloudflare dará una URL pública para abrir la aplicación.

---

### Opción usando Docker

Exponer backend:

```bash
cloudflared tunnel --url http://localhost:8001
```

Poner la URL pública en:

```txt
frontend/.env.production
```

Ejemplo:

```env
VITE_API_URL=https://backend-demo.trycloudflare.com/api
```

Reconstruir frontend:

```bash
docker compose build frontend
docker compose up -d frontend
```

Exponer frontend:

```bash
cloudflared tunnel --url http://localhost:3000
```

---

## 12. Errores comunes

### El frontend carga pero no aparecen datos

Revisar la variable:

```env
VITE_API_URL=...
```

Debe coincidir con la URL del backend.

En local sin Docker:

```env
VITE_API_URL=http://localhost:8000/api
```

En Docker:

```env
VITE_API_URL=http://localhost:8001/api
```

Con Cloudflare:

```env
VITE_API_URL=https://URL_PUBLICA_BACKEND/api
```

---

### Error de CORS

Si el navegador muestra error de CORS, revisar:

```txt
backend/config/cors.php
```

Añadir los orígenes necesarios:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
],
```

Si se usa Cloudflare, añadir también la URL pública del frontend.

Después ejecutar:

```bash
php artisan optimize:clear
```

---

### Error de conexión con la base de datos

Revisar `backend/.env`.

Sin Docker:

```env
DB_HOST=127.0.0.1
DB_PASSWORD=
```

Con Docker:

```env
DB_HOST=koma_db
DB_PASSWORD=root
```

---

### Cambios en `.env` no se aplican

En Laravel:

```bash
php artisan optimize:clear
```

En React/Vite, reiniciar el servidor:

```bash
npm run dev
```

Si es build de Docker, reconstruir:

```bash
docker compose build frontend
docker compose up -d frontend
```

---

## Resumen rápido para demo local

```bash
git clone URL_DEL_REPOSITORIO
cd koma-coffee
```

Backend:

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Frontend, en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir:

```txt
http://localhost:5173
```

Usuarios:

```txt
admin@koma.com / admin123
user@koma.com / user123
```
