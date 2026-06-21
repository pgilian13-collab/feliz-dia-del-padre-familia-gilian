# Día del Padre - Landing Page Familiar

Una página web hermosa estilo vintage para celebrar a todos los papás de la familia.

## Archivos del Proyecto

- `index.html` - Estructura principal de la página
- `styles.css` - Estilos con tema vintage/nostálgico
- `script.js` - Interactividad y animaciones
- `fotos/` - Carpeta para tus fotos familiares (crear)
- `videos/` - Carpeta para tus videos (crear)

## Cómo Visualizar

Simplemente abre el archivo `index.html` en tu navegador web.

## Cómo Personalizar

### 1. Agregar Fotos

Crea una carpeta llamada `fotos` y coloca tus imágenes ahí.

En `index.html`, busca los elementos `.photo-placeholder` y reemplázalos:

```html
<!-- ANTES -->
<div class="photo-placeholder">
    <span class="placeholder-icon">📷</span>
    <span class="placeholder-text">Foto familiar 1</span>
</div>

<!-- DESPUÉS -->
<img src="fotos/mi-familia.jpg" alt="Mi familia en la playa" style="width:100%; height:100%; object-fit:cover;">
```

### 2. Agregar Videos

Puedes incrustar videos de YouTube o subir videos propios.

Para YouTube, busca `.video-placeholder` y reemplaza:

```html
<!-- ANTES -->
<div class="video-placeholder">
    <span class="placeholder-icon">🎬</span>
    <span class="placeholder-text">Video familiar 1</span>
</div>

<!-- DESPUÉS (YouTube) -->
<iframe 
    width="100%" 
    height="100%" 
    src="https://www.youtube.com/embed/VIDEO_ID" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>
```

### 3. Editar Mensajes

Busca los `.message-card` y modifica el texto:

```html
<div class="message-card">
    <div class="card-ornament">✿</div>
    <p class="message-text">"Tu mensaje personal aquí"</p>
    <span class="message-author">— Con amor, [Nombre]</span>
</div>
```

### 4. Cambiar Colores

Edita las variables CSS al inicio de `styles.css`:

```css
:root {
    --color-cream: #F5F0E8;      /* Color de fondo */
    --color-burgundy: #722F37;   /* Color principal */
    --color-gold: #C5A55A;       /* Color de acento */
    --color-brown: #8B7355;      /* Color de texto */
}
```

### 5. Cambiar Nombres

Busca y reemplaza:
- "La Familia" por el nombre de tu familia
- "Día del Padre 2025" por el año que desees
- Los nombres en los mensajes de los hijos

## Estructura de la Página

1. **Hero** - Título principal con efecto vintage
2. **Mensajes** - Cartas de los hijos a los papás
3. **Galería** - Grid de fotos familiares
4. **Videos** - Sección de recuerdos en movimiento
5. **Cita Final** - Mensaje especial de despedida
6. **Footer** - Cierre con nombre familiar

## Características

- Diseño responsive (se adapta a móviles)
- Animaciones suaves al hacer scroll
- Efecto vintage con texturas
- Tipografías elegantes (Playfair Display, Lora, Great Vibes)
- Hover effects en fotos y tarjetas
- Modal informativo al hacer clic en fotos

## Navegadores Compatibles

- Chrome (última versión)
- Firefox (última versión)
- Safari (última versión)
- Edge (última versión)

## Soporte

Si necesitas ayuda para personalizar, edita los archivos directamente o usa un editor como VS Code.
