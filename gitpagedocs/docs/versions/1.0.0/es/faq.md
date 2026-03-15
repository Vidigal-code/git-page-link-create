# FAQ

## Por que un enlace generado abre sin contenido?

Verifica:

- si la URL mantiene payload completo (`#d=` o `?d=`)
- si existe el prefijo de tipo (ejemplo: `h-`, `md-`, `pdf-`)
- si el enlace no fue truncado por chat o correo

## Por que `/s/<code>` cae en 404 en hosting estatico?

Verifica:

- si el host sirve `404.html` exportado
- si el base path coincide con `next.config.js` en produccion
- si el codigo corto no fue alterado manualmente

## Por que falla con archivos media grandes?

Archivos grandes pueden superar limite de URL. Usa modo por URL publica cuando sea posible:

- imagen/video/audio por URL publica
- Office por URL publica en `/render/office?source=...`

## Por que Office no renderiza?

Verifica:

- URL publica (sin auth/cookies)
- protocolo `http` o `https`
- formato soportado por Office web viewer

## Por que recovery falla con enlaces antiguos?

Verifica:

- marcador soportado (`#d=`, `?d=`, legacy `#data=`, `?data=`)
- payload no corrompido por acortadores externos
- hash preservado al compartir
