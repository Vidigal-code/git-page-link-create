# Funcion Create

La pagina `/create` es el centro principal de funciones de la app.

## Que hace

- Recibe texto para HTML, Markdown, CSV y TXT
- Recibe upload para XLS/XLSX, DOCX/PPTX, imagen, PDF, video y audio
- Comprime payload antes de generar enlaces
- Genera enlaces para alias compactos (`/r` y `/ra`)
- Soporta modo por URL de origen para archivos grandes

## Flujo principal

1. Seleccionar tipo de contenido
2. Pegar texto o subir archivo
3. Elegir modo de herramienta
4. Generar enlace
5. Copiar/abrir/compartir

## Comportamiento de seguridad

- Bloquea generacion arriba del limite de URL configurado
- Muestra error para formato invalido o tipo no soportado
- Opera 100% en navegador (sin backend)
