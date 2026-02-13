# ☕ Koma Coffee – Frontend

---

## 📖 Descripción del proyecto

Koma Coffee es una aplicación web SPA desarrollada con **React, Vite, TypeScript y Tailwind CSS** que simula la plataforma digital de una cafetería especializada en café y cómics.

El frontend permite:

- Visualizar el catálogo de libros con paginación
- Filtrar por búsqueda y categoría
- Consultar el detalle de cada libro
- Registrarse e iniciar sesión
- Realizar y cancelar reservas
- Gestionar libros si el usuario tiene rol administrador
- Adaptar dinámicamente la interfaz según autenticación y rol

La aplicación consume una **API REST desarrollada en Laravel**, siguiendo una arquitectura desacoplada frontend-backend.

---

## 🧠 Funcionamiento

- La navegación se gestiona con **React Router** sin recarga de página (SPA).
- Las rutas protegidas se controlan mediante un componente `ProtectedRoute`.
- Los datos se obtienen mediante peticiones HTTP centralizadas en un `apiClient`.
- Las respuestas JSON se tipan con **interfaces TypeScript**.
- El estado local se gestiona con `useState` y `useEffect`.
- El estado global de autenticación se gestiona mediante **Context API**.
- La autenticación se realiza mediante **tokens Bearer** almacenados en `sessionStorage`.
- La lógica de negocio está separada en servicios (`bookService`, `reservationService`, etc.).

---

## 🛠 Tecnologías utilizadas

- React
- TypeScript
- React Router DOM
- Context API
- Tailwind CSS
- Fetch API
- Vite

---

## 📁 Estructura del proyecto

```
src/
├── components/
├── pages/
├── api/
│   ├── apiClient.ts
│   └── services/
├── store/
├── types/
├── router/
├── App.tsx
└── main.tsx
```

- `pages` → Vistas principales  
- `components` → Elementos reutilizables  
- `api` → Cliente HTTP y servicios por dominio  
- `store` → Gestión global de autenticación  
- `types` → Interfaces TypeScript  
- `router` → Sistema de rutas  

---

## 🔐 Sistema de autenticación

El sistema utiliza autenticación basada en tokens:

1. El usuario inicia sesión.
2. El backend devuelve un token.
3. El token se almacena en `sessionStorage`.
4. Cada petición protegida añade automáticamente el header:

```
Authorization: Bearer {token}
```

5. El backend valida autenticación y rol antes de permitir la acción.

La interfaz se adapta dinámicamente según:

- Usuario no autenticado
- Usuario autenticado
- Usuario administrador

---

## 🌍 Variables de entorno

Crear un archivo `.env` en la raíz del frontend:

```
VITE_API_URL=http://localhost:8000/api
```

Es necesario que el backend esté ejecutándose en esa URL.

---

## 💻 Instalación y ejecución

### 1. Clonar el repositorio

```
git clone https://github.com/Josher21/koma-coffee
cd koma-coffee/frontend
```

### 2. Instalar dependencias

```
npm install
```

### 3. Ejecutar el servidor de desarrollo

```
npm run dev
```

La aplicación estará disponible en:

http://localhost:5173

---

## 🎯 Requisitos cumplidos

- Aplicación SPA con React Router
- Componentes funcionales reutilizables
- Gestión de estado con Hooks
- Context API para autenticación global
- Consumo de API REST desarrollada en Laravel
- Protección de rutas y control de roles
- Paginación y filtros dinámicos
- Tipado completo con TypeScript
- Diseño responsive con Tailwind CSS

---

## 👨‍💻 Autor

Jose Luis Sánchez Hernández  
IES Pere María d'Orts  
2º DAW – Desarrollo de Aplicaciones Web