# 🛍️ SHEIN Clone (Sheinclon)

<div align="center">

![Project Banner](https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop)

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0C05?style=for-the-badge&logo=typeorm&logoColor=white)

<br/>

**Una experiencia de e-commerce moderna, rápida y visualmente impactante.**

[🚀 Demo](#) • [📖 Documentación](#) • [🐛 Reportar Bug](https://github.com/bmontes93/shein-clone/issues)

</div>

---

##  Descripción

**Sheinclon** es una plataforma de comercio electrónico Full-Stack diseñada para ofrecer una experiencia de usuario premium ("Efecto Wow"). Construida con las últimas tecnologías web, combina un frontend reactivo y animado con un backend robusto y eficiente.

El proyecto se centra en la estética, el rendimiento y la escalabilidad, migrando recientemente a una arquitectura SQL con **SQLite** y **TypeORM** para una mayor integridad de datos y facilidad de desarrollo local.

##  Características Principales

###  Experiencia de Usuario (UX/UI) "Wow"

- **Hero Section Inmersiva**: Banner de pantalla completa con animaciones de entrada cinematográficas.
- **Diseño Premium**: Interfaz limpia, tipografía moderna y uso de espacio en blanco al estilo editorial.
- **Tarjetas de Producto Interactivas**:
  - Efecto **Zoom** suave al pasar el cursor.
  - **Reveal Automático**: Muestra ángulos alternativos del producto en hover.
  - Animaciones fluidas para botones de acción.
- **Carga de Imágenes Optimizada**: Implementación de técnica "Blur-up" (desenfoque progresivo) para transiciones de carga ultra suaves.

###  Funcionalidad E-commerce

- **Catálogo Dinámico**: Filtrado por categoría, precio, y búsqueda en tiempo real.
- **Carrito de Compras**: Gestión de estado persistente, cálculos de subtotal y actualizaciones en vivo.
- **Lista de Deseos (Wishlist)**: Guarda tus productos favoritos (requiere autenticación).
- **Gestión de Inventario**: Soporte para variantes complejas (Tallas y Colores).
- **Sistema de Reseñas**: Calificaciones y comentarios de usuarios.
- **Cupones de Descuento**: Lógica para aplicar códigos promocionales.

###  Arquitectura Técnica

- **Backend Migrado**: Transición exitosa de MongoDB a **SQLite** usando **TypeORM** para un esquema relacional robusto.
- **Typescript Full-Stack**: Tipado estático estricto en frontend y backend para mayor seguridad y mantenibilidad.
- **Seed Data Realista**: Script de poblado de base de datos con imágenes de alta calidad de Unsplash (hotlink-safe).

---

##  Stack Tecnológico

### Frontend

| Tecnología       | Propósito                                   |
| ---------------- | ------------------------------------------- |
| **React 19**     | Biblioteca de UI moderna y eficiente        |
| **Vite**         | Entorno de desarrollo ultrarrápido          |
| **TypeScript**   | JavaScript con superpoderes de tipado       |
| **Tailwind CSS** | Estilizado utility-first para diseño rápido |
| **Axios**        | Cliente HTTP para comunicación con API      |
| **React Router** | Enrutamiento del lado del cliente           |

### Backend

| Tecnología  | Propósito                                       |
| ----------- | ----------------------------------------------- |
| **Node.js** | Entorno de ejecución de JavaScript              |
| **Express** | Framework web minimalista y robusto             |
| **SQLite**  | Base de datos relacional ligera (archivo local) |
| **TypeORM** | ORM para mapeo de objetos y gestión de DB       |
| **JWT**     | Autenticación segura basada en tokens           |

---

##  Instalación y Despliegue Local

Sigue estos pasos para levantar el proyecto en tu máquina local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/bmontes93/Sheinclon.git
cd Sheinclon
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (Crear archivo .env basado en .env.example)
# Asegúrate de definir JWT_SECRET y PORT

# Poblar la base de datos (Seed)
# Esto creará el archivo database.sqlite y cargará productos de prueba
npm run seed

# Iniciar servidor en modo desarrollo
npm run dev
```

> El backend correrá en `http://localhost:5000`

### 3. Configurar el Frontend

```bash
# En una nueva terminal, navega a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

> El frontend correrá en `http://localhost:5173`

---

##  Estructura del Proyecto

```
Sheinclon/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB (TypeORM)
│   │   ├── controllers/    # Lógica de controladores
│   │   ├── entities/       # Entidades TypeORM (User, Product, etc.)
│   │   ├── routes/         # Definición de endpoints API
│   │   └── seeder.ts       # Script de carga de datos iniciales
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Reutilizable (OptimizedImage, etc.)
│   │   ├── features/       # Módulos (Auth, Cart, Products)
│   │   ├── pages/          # Páginas principales (HomePage)
│   │   └── utils/          # Configuración y helpers
│   └── package.json
└── README.md
```

---

##  Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto:

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Haz Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

---

##  Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

<div align="center">

**Desarrollado  por [Bryan Montes](https://github.com/bmontes93)**

</div>
