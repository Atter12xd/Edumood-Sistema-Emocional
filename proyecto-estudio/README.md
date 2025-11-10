# 🧪 SciencePlay - Plataforma Educativa Gamificada

Demo/prototipo de una plataforma educativa gamificada para enseñar ciencias (especialmente química) a estudiantes de secundaria.

## ✨ Características

- 🎨 **Landing Page Impactante** con animaciones y escena 3D
- 📚 **Selector de Cursos** interactivo para 5 años de secundaria
- 📖 **Cómics Interactivos** con navegación suave y animaciones
- 🧪 **Laboratorio Virtual 3D** con ejercicios clickeables
- 👨‍🏫 **Dashboard para Profesores** con métricas de estudiantes
- 🎮 **Sistema de Gamificación** con puntos y progreso

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **Three.js / React Three Fiber** (escenas 3D)
- **Lucide React** (iconos)

## 🚀 Instalación y Uso

### Instalación de dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

```
proyecto-estudio/
├── app/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ParticlesBackground.tsx
│   │   └── LabScene.tsx
│   ├── cursos/            # Selector de cursos
│   │   ├── page.tsx       # Lista de años
│   │   └── [id]/          # Temas por año
│   ├── comic/             # Visor de cómics
│   │   └── [id]/
│   ├── laboratorio/       # Laboratorio 3D
│   │   └── [id]/
│   ├── profesor/          # Dashboard profesor
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Landing page
│   └── globals.css        # Estilos globales
├── public/                # Recursos estáticos
└── tailwind.config.ts     # Configuración de Tailwind
```

## 🎯 Rutas Principales

- `/` - Landing page
- `/cursos` - Selector de cursos
- `/cursos/3` - Temas de 3er año (Química)
- `/comic/tabla-periodica` - Cómic interactivo
- `/laboratorio/tabla-periodica` - Laboratorio virtual 3D
- `/profesor` - Dashboard para profesores

## 🎨 Paleta de Colores

- **Primary**: #3B82F6 (Azul)
- **Secondary**: #8B5CF6 (Púrpura)
- **Accent**: #10B981 (Verde neón)

## 🎮 Flujo de Usuario

1. **Landing Page** → Click en "Explorar Demo"
2. **Selector de Cursos** → Seleccionar "Tercer Año"
3. **Temas de Química** → Click en "La Tabla Periódica"
4. **Cómic Interactivo** → Navegar por los 6 paneles
5. **Laboratorio 3D** → Resolver 5 ejercicios interactivos
6. **Completar** → Ver feedback y puntos ganados

## 📱 Responsive Design

El proyecto está optimizado para:
- 📱 Mobile (320px+)
- 💻 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🚢 Deploy en Vercel

```bash
npm run build
```

El proyecto está listo para deploy en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura el proyecto como Next.js
3. Deploy automático

## ⚠️ Notas Importantes

- Todo el contenido es **hardcoded** (no hay base de datos)
- Es un **demo/prototipo** para presentación
- Las animaciones están optimizadas para rendimiento
- La escena 3D es simple pero funcional

## 🎓 Contenido Educativo

### Temas de 3er Año - Química

1. ✅ La Tabla Periódica (Implementado)
2. Estructura Atómica
3. Enlaces Químicos
4. Reacciones Químicas
5. Estados de la Materia
6. Ácidos y Bases

## 👨‍💻 Desarrollo

### Agregar nuevos temas

1. Editar `app/cursos/[id]/page.tsx` para agregar tema al array
2. Crear contenido en `app/comic/[id]/page.tsx`
3. Agregar ejercicios en `app/laboratorio/[id]/page.tsx`

### Personalizar colores

Editar `tailwind.config.ts`:

```typescript
colors: {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  accent: "#10B981",
}
```

## 📝 Licencia

Este es un proyecto educativo de demostración.

## 🙏 Créditos

Desarrollado como prototipo de plataforma educativa gamificada.

---

**¡Aprende Ciencia Jugando! 🚀**
