# 🚀 Guía de Deployment - SciencePlay

## Deploy en Vercel (Recomendado)

### Opción 1: Deploy desde GitHub

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SciencePlay demo"
   git branch -M main
   git remote add origin [tu-repositorio]
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Import Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente que es Next.js

3. **Configuración:**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy:**
   - Click en "Deploy"
   - ¡Listo! En ~2 minutos estará online

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

---

## Variables de Entorno

Este proyecto NO requiere variables de entorno por ahora (todo es hardcoded).

Para futuras implementaciones:

```env
# .env.local
DATABASE_URL=...
NEXT_PUBLIC_API_URL=...
```

---

## Optimizaciones Pre-Deploy

### 1. Verificar Build Local

```bash
npm run build
npm start
```

Abre `http://localhost:3000` y verifica que todo funciona.

### 2. Optimizar Imágenes

Si agregas imágenes en `public/`, usa el formato WebP para mejor rendimiento.

### 3. Lighthouse Check

Ejecuta Lighthouse en Chrome DevTools:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Configuración de Dominio Personalizado

En Vercel:
1. Settings → Domains
2. Agregar tu dominio (ej: `scienceplay.com`)
3. Configurar DNS según las instrucciones

---

## Monitoreo Post-Deploy

### Analytics de Vercel

Vercel incluye analytics gratis:
- Visualizaciones de página
- Tiempo de carga
- Core Web Vitals

### Error Tracking

Para producción, considera:
- Sentry
- LogRocket
- Vercel Analytics

---

## Troubleshooting

### Build Fails

```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

### 3D No Carga en Deploy

Verifica que WebGL esté habilitado en el navegador del usuario.

### Animaciones Lentas

En `next.config.ts`, agregar:

```typescript
experimental: {
  optimizeCss: true,
}
```

---

## Rendimiento Esperado

- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Cumulative Layout Shift: < 0.1

---

## Post-Deploy Checklist

- [ ] Landing page carga correctamente
- [ ] Todas las rutas funcionan
- [ ] Animaciones se ven suaves
- [ ] Escena 3D se renderiza
- [ ] Laboratorio es interactivo
- [ ] Responsive en móvil
- [ ] SEO meta tags presentes
- [ ] Favicon visible
- [ ] Sin errores en consola

---

## URL del Demo

Una vez deployado en Vercel:
```
https://proyecto-estudio.vercel.app
```

O con dominio personalizado:
```
https://scienceplay.com
```

---

## Actualizaciones

Para actualizar el sitio después del deploy:

```bash
git add .
git commit -m "Update: [descripción]"
git push
```

Vercel desplegará automáticamente los cambios.

---

## Costos

**Vercel Free Tier incluye:**
- ✅ Deployments ilimitados
- ✅ 100 GB bandwidth
- ✅ Preview deployments
- ✅ Custom domains
- ✅ Automatic HTTPS

**Suficiente para:**
- Demos
- Prototipos
- Portafolios
- Proyectos pequeños/medianos

---

## Backups

Vercel guarda automáticamente:
- Todos los deployments
- Rollback en 1 click
- Build logs

---

## CDN & Performance

Vercel provee:
- ✅ Edge Network global
- ✅ Compresión automática
- ✅ Cache inteligente
- ✅ Image optimization

---

## Seguridad

Automático en Vercel:
- ✅ HTTPS/SSL gratuito
- ✅ DDoS protection
- ✅ Headers de seguridad

---

**¡Tu demo está lista para impresionar! 🚀**

Comparte el link y muestra lo que has creado.








