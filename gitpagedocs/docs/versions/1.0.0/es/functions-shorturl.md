# Funcion Short URL

Las funciones de short URL crean enlaces mas pequenos para compartir en modo frontend-only.

## Rutas principales

- `/shorturl-create` para generar enlaces cortos
- `/shorturl` para decodificar y redirigir
- `/s/<code>` como ruta compacta para hosting estatico

## Comportamiento

- Codifica enlaces largos en tokens cortos reversibles
- Soporta atajos por codigos de referencia
- Mantiene compatibilidad con flags de modo compartido

## Recovery en host estatico

Cuando una ruta compacta abre directo, `404.tsx` detecta patrones recuperables y redirige a la ruta correcta.
