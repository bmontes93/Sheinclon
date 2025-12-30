# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a **SHEIN Clone**! Este documento describe las pautas y procesos para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [🐛 Reportar Bugs](#-reportar-bugs)
- [💡 Sugerir Features](#-sugerir-features)
- [🛠️ Desarrollo Local](#️-desarrollo-local)
- [📝 Estándares de Código](#-estándares-de-código)
- [🔄 Pull Requests](#-pull-requests)
- [🧪 Testing](#-testing)
- [📚 Documentación](#-documentación)
- [🎯 Guías Específicas](#-guías-específicas)

---

## 🚀 Inicio Rápido

### 1. **Fork y Clone**
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/shein-clone.git
cd shein-clone

# Crea una rama para tu feature
git checkout -b feature/nueva-funcionalidad
```

### 2. **Configuración del Entorno**
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configura tus variables de entorno

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Configura tus variables de entorno
```

### 3. **Ejecutar el Proyecto**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🐛 Reportar Bugs

### **Plantilla para Reportar Bugs**

```markdown
**Título del Bug:** [Breve descripción]

**Descripción:**
[Descripción detallada del problema]

**Pasos para Reproducir:**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento Esperado:**
[Qué debería suceder]

**Comportamiento Actual:**
[Qué está sucediendo]

**Capturas de Pantalla:**
[Si aplica]

**Entorno:**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node Version: [18.x]
- NPM Version: [9.x]

**Contexto Adicional:**
[Cualquier información adicional]
```

### **Etiquetas para Bugs**
- `🐛 bug` - Error en el código
- `🔥 critical` - Bug crítico que impide funcionalidad
- `⚠️ warning` - Problema menor
- `❓ question` - Pregunta o aclaración necesaria

---

## 💡 Sugerir Features

### **Plantilla para Nuevas Features**

```markdown
**Título de la Feature:** [Nombre descriptivo]

**Problema que Resuelve:**
[Describe el problema actual]

**Solución Propuesta:**
[Describe tu solución]

**Alternativas Consideradas:**
[Otras soluciones que consideraste]

**Impacto:**
- [ ] Breaking Change
- [ ] Nueva Dependencia
- [ ] Cambio en DB Schema
- [ ] Cambio en API

**Beneficios:**
- Usuario final: [beneficios para usuarios]
- Desarrollador: [beneficios para devs]
- Negocio: [beneficios para el negocio]

**Mockups/Esquemas:**
[Enlaces a diseños o diagramas]
```

### **Etiquetas para Features**
- `✨ enhancement` - Nueva funcionalidad
- `🎨 ui/ux` - Mejoras de interfaz
- `⚡ performance` - Optimización de rendimiento
- `🔒 security` - Mejoras de seguridad
- `📱 mobile` - Funcionalidades móviles

---

## 🛠️ Desarrollo Local

### **Estructura de Commits**
```bash
# Formato: tipo(scope): descripción

# Ejemplos:
feat(auth): add JWT authentication
fix(cart): resolve localStorage persistence bug
docs(readme): update installation instructions
style(navbar): improve mobile responsiveness
refactor(api): optimize database queries
test(auth): add unit tests for login
chore(deps): update dependencies
```

### **Tipos de Commit**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bugs
- `docs` - Cambios en documentación
- `style` - Cambios de estilo (formateo, etc.)
- `refactor` - Refactorización de código
- `test` - Añadir o modificar tests
- `chore` - Tareas de mantenimiento

---

## 📝 Estándares de Código

### **JavaScript/React**
```javascript
// ✅ Correcto
const handleSubmit = async (formData) => {
  try {
    const response = await api.post('/users', formData);
    setUser(response.data);
  } catch (error) {
    console.error('Error creating user:', error);
    setError(error.message);
  }
};

// ❌ Incorrecto
const handleSubmit = async formData => {
  try{const response=await api.post('/users',formData);setUser(response.data)}catch(error){console.log(error);setError(error)}
};
```

### **CSS/Tailwind**
```jsx
// ✅ Correcto
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">Título</h3>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
    Acción
  </button>
</div>
```

### **Nombres de Variables y Funciones**
```javascript
// ✅ Correcto
const getUserById = (userId) => { ... }
const handleProductUpdate = (productData) => { ... }
const isUserAuthenticated = () => { ... }

// ❌ Incorrecto
const getusr = (id) => { ... }
const updateProd = (data) => { ... }
const checkAuth = () => { ... }
```

---

## 🔄 Pull Requests

### **Proceso de PR**

1. **Fork** el repositorio
2. **Crea** una rama descriptiva (`git checkout -b feature/nueva-funcionalidad`)
3. **Haz** tus cambios siguiendo los estándares
4. **Añade** tests si es necesario
5. **Actualiza** la documentación
6. **Haz commit** con mensajes descriptivos
7. **Push** tu rama
8. **Crea** un Pull Request

### **Plantilla de PR**

```markdown
## 📝 Descripción
[Breve descripción de los cambios]

## 🎯 Tipo de Cambio
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation
- [ ] 🎨 UI/UX
- [ ] ⚡ Performance

## 🔧 Cambios Realizados

### Frontend
- [ ] Componentes modificados
- [ ] Hooks actualizados
- [ ] Estilos cambiados

### Backend
- [ ] Rutas modificadas
- [ ] Modelos actualizados
- [ ] Controladores cambiados

### Base de Datos
- [ ] Schema modificado
- [ ] Migraciones necesarias

## 🧪 Testing
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests manuales
- [ ] Cobertura de código

## 📸 Screenshots
[Si aplica, añadir capturas]

## 🔗 Issues Relacionados
- Closes #123
- Relates to #456

## 📋 Checklist
- [ ] Código sigue estándares del proyecto
- [ ] Tests pasan exitosamente
- [ ] Documentación actualizada
- [ ] Commits siguen formato establecido
- [ ] PR aprobado por al menos 1 reviewer
```

---

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Backend
cd backend
npm test
npm run test:watch
npm run test:coverage

# Frontend
cd frontend
npm test
npm run test:coverage
```

### **Escribir Tests**
```javascript
// Ejemplo de test unitario
describe('Auth Service', () => {
  it('should login user successfully', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const result = await authService.login(credentials);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });
});
```

---

## 📚 Documentación

### **Actualizar Documentación**
- Mantén el README actualizado
- Documenta nuevas APIs en el código
- Añade ejemplos de uso
- Actualiza guías de instalación

### **Estándares de Documentación**
```javascript
/**
 * Autentica a un usuario con email y contraseña
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Resultado de la autenticación
 * @throws {Error} Si las credenciales son inválidas
 */
const login = async (credentials) => {
  // implementación
};
```

---

## 🎯 Guías Específicas

### **Trabajando con la API**
- Usa el hook `useApi` para todas las peticiones
- Implementa manejo de errores consistente
- Valida datos de entrada y salida
- Mantén la consistencia en los endpoints

### **Componentes React**
- Usa hooks personalizados para lógica reutilizable
- Implementa lazy loading para componentes pesados
- Mantén la accesibilidad (ARIA labels, keyboard navigation)
- Usa TypeScript para nuevos componentes (futuro)

### **Base de Datos**
- Sigue las convenciones de nomenclatura
- Implementa índices para consultas frecuentes
- Usa transacciones para operaciones críticas
- Valida datos a nivel de base de datos

### **Seguridad**
- Nunca commits credenciales
- Usa variables de entorno para configuración sensible
- Implementa rate limiting
- Valida y sanitiza todas las entradas

---

## 📞 **Soporte**

¿Necesitas ayuda? No dudes en:
- 📧 **Email**: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/shein-clone/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/shein-clone/issues)

---

## 📜 **Código de Conducta**

Este proyecto sigue el [Código de Conducta de Contributor Covenant](CODE_OF_CONDUCT.md).
Participando, aceptas cumplir con este código.

---

¡Gracias por contribuir a hacer **SHEIN Clone** mejor! 🚀