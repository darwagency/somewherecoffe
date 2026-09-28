# Somewhere Coffee Lab

Web de pedidos para Somewhere Coffee Lab, Mérida. Construida con Next.js 16, React 19, Tailwind CSS 4 y Phosphor Icons.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Pedido

La carta se mantiene en `src/lib/menu.ts`. El cliente puede elegir bebidas, cambiar la leche, ajustar cantidades, seleccionar delivery o retiro y revisar el total. Tras completar sus datos aparece un resumen para revisar el pedido antes de abrir WhatsApp con el mensaje listo. En retiro, el punto y horario se confirman por WhatsApp. No se procesa ningún pago en la web.

Las tres zonas y sus costos ($50, $60 y $70 MXN) son **ejemplos**. Sustituye nombres, cobertura y tarifas reales en `src/lib/menu.ts` antes de aceptar pedidos. El WhatsApp del negocio se configura en `src/app/page.tsx`.

La sección de Instagram abre el perfil oficial para ver videos e historias. Instagram no ofrece una lista pública de reels incrustable de manera fiable sin enlaces a publicaciones concretas o acceso autorizado a su API. Si se facilitan enlaces de reels, pueden integrarse como publicaciones específicas.

La firma de Agencia Darw al final de la página enlaza a `darw.cl` y al WhatsApp publicado en su sitio oficial.

Las fotos de producto se recortaron de `MENU.png`, material provisto por la marca. `public/hero-coffee.jpg` es una imagen generada para esta web con la herramienta integrada de imágenes.

## Verificar

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

