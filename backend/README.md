# ☕ Koma Coffee – Backend

---

## 📖 Descripción del proyecto

Koma Coffee Backend es una API REST desarrollada con **Laravel** que gestiona la lógica de negocio de la aplicación.

El backend permite:

- Gestión de usuarios (registro y login)
- Autenticación mediante tokens
- Gestión de libros
- Gestión de categorías
- Sistema de reservas
- Control de roles (USER / ADMIN)
- Paginación y filtrado dinámico

La API está diseñada para ser consumida por el frontend desarrollado en React, siguiendo una arquitectura completamente desacoplada.

---

## 🧠 Funcionamiento

- La aplicación expone una **API RESTful** bajo el prefijo `/api`.
- La autenticación se realiza mediante **Bearer Token**.
- Se utilizan **Form Requests** para validar datos de entrada.
- Se aplican **middleware de autenticación y autorización**.
- Se emplea paginación estándar de Laravel (`paginate()`).
- Se utilizan relaciones Eloquent para gestionar el dominio (usuarios, libros, reservas).

---

## 🛠 Tecnologías utilizadas

- PHP 8+
- Laravel
- Eloquent ORM
- MySQL / MariaDB
- Sanctum (autenticación por tokens)
- Middleware
- Form Requests

---

## 🗄 Modelo de datos (resumen)

### Usuarios
- id
- name
- email
- password
- role (USER / ADMIN)

### Libros
- id
- title
- author
- editorial
- pages
- synopsis
- image
- quantity
- category_id

### Reservas
- id
- user_id
- book_id
- status (active / cancelled)
- created_at

Relaciones principales:

- Un usuario puede tener muchas reservas.
- Un libro puede tener muchas reservas.
- Una categoría puede tener muchos libros.

---

## 🔐 Sistema de autenticación

La API utiliza autenticación basada en tokens:

1. El usuario se registra o inicia sesión.
2. Laravel genera un token.
3. El cliente debe enviar el token en cada petición protegida:

```
Authorization: Bearer {token}
```

Las rutas protegidas utilizan el middleware:

```
auth:sanctum
```

Además, ciertas acciones requieren rol ADMIN.

---

## 📡 Endpoints principales

### 🔐 Autenticación

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`

---

### 📚 Libros

- `GET /api/books`
- `GET /api/books/{id}`
- `PUT /api/books/{id}` (ADMIN)

---

### 📖 Reservas

- `POST /api/reservations`
- `PATCH /api/reservations/{id}/cancel`
- `GET /api/reservations/me`

---

### 🛠 Administración

- `GET /api/admin/reservas`
- `POST /api/admin/reservas/{id}/cancel`

---

## 🌍 Configuración del entorno

Crear archivo `.env` en la raíz del backend y configurar:

```
APP_NAME=KomaCoffee
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=koma_coffee
DB_USERNAME=root
DB_PASSWORD=
```

---

## 💻 Instalación y ejecución

### 1. Clonar repositorio

```
git clone https://github.com/Josher21/koma-coffee
cd koma-coffee/backend
```

### 2. Instalar dependencias

```
composer install
```

### 3. Generar clave

```
php artisan key:generate
```

### 4. Ejecutar migraciones y seeders

Para crear las tablas y generar los datos iniciales (usuarios de prueba), ejecutar:

```
php artisan migrate --seed
```

Si se quiere reiniciar completamente la base de datos:

```
php artisan migrate:fresh --seed
```

Esto creará automáticamente dos usuarios de prueba:

| Rol   | Email               | Contraseña |
|-------|---------------------|------------|
| ADMIN | admin@koma.com      | admin123  |
| USER  | user@koma.com       | user123   |

Estos usuarios permiten probar tanto la parte pública como el panel de administración.

---

### 5. Iniciar servidor

```
php artisan serve
```

La API estará disponible en:

```
http://localhost:8000/api
```

---

## 🎯 Requisitos cumplidos

- API REST estructurada
- Autenticación mediante tokens
- Control de roles (USER / ADMIN)
- Validación con Form Requests
- Relaciones Eloquent
- Paginación y filtrado dinámico
- Arquitectura desacoplada frontend-backend

---

## 👨‍💻 Autor

Jose Luis Sánchez Hernández  
IES Pere María d'Orts  
2º DAW – Desarrollo de Aplicaciones Web