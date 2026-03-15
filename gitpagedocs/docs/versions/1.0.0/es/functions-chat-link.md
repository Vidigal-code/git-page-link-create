# Funcion Chat Link

La feature `/chat-link/` guarda historial de chat en el hash de URL.

## Que permite

- Compartir contexto sin backend
- Mantener historial dentro del enlace
- Responder mensajes anteriores conservando timeline

## Flujo

1. Abrir `/chat-link/`
2. Enviar mensajes
3. App comprime historial en hash
4. Compartir enlace
5. Otra persona abre y continua chat

## Observaciones

- Historiales largos estan limitados por tamano maximo de URL
- La app avisa antes de superar limite seguro
