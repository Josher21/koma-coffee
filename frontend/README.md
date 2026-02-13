# ☕ Koma Coffee – Frontend

## 📖 Descripción del proyecto

Koma Coffee es una aplicación web SPA desarrollada con **React, TypeScript y Tailwind CSS** que simula la plataforma digital de una cafetería especializada en café y cómics.

El frontend permite:

- Visualizar el catálogo de libros
- Consultar el detalle de cada libro
- Registrarse e iniciar sesión
- Realizar reservas si el usuario está autenticado
- Adaptar la interfaz según el estado del usuario

La aplicación consume una **API REST desarrollada en Laravel**, siguiendo una arquitectura desacoplada frontend-backend.

---

## 🧠 Funcionamiento

- La navegación se gestiona con **React Router** sin recarga de página.
- Los datos se obtienen mediante peticiones HTTP (`fetch`) al backend.
- Las respuestas JSON se tipan con **interfaces TypeScript**.
- El estado se gestiona con `useState` y `useEffect`.
- La autenticación se realiza mediante **tokens Bearer**.

---

## 🛠 Tecnologías utilizadas

- React
- TypeScript
- React Router DOM
- Tailwind CSS
- Fetch API
- Vite

---

## 📁 Estructura del proyecto

src/
├── components/
├── pages/
├── services/
├── types/
├── store/
├── App.tsx
└── main.tsx


- `pages` → Vistas principales  
- `components` → Elementos reutilizables  
- `services` → Llamadas a la API  
- `types` → Interfaces TypeScript  

---

## 🌍 Variables de entorno

Crear un archivo `.env` en la raíz del frontend:

VITE_API_URL=http://localhost:8000/api

Es necesario que el backend esté ejecutándose en esa URL.

---

## 💻 Instalación y ejecución

### 1. Clonar el repositorio

git clone <https://github.com/Josher21/koma-coffee>
cd koma-coffee/frontend

### 2. Instalar dependencias

npm install

### 3. Ejecutar el servidor de desarrollo

npm run dev

La aplicación estará disponible en: <http://localhost:5173>

---

## 🎯 Requisitos cumplidos

- Aplicación SPA con React Router
- Componentes funcionales
- Gestión de estado con Hooks
- Formularios con validación básica
- Consumo de API REST real
- Tipado completo con TypeScript
- Diseño responsive con Tailwind CSS

---

## 👨‍💻 Autor

Jose Luis Sánchez Hernández
IES Pere María d'Orts
2º DAW – Desarrollo de Aplicaciones Web