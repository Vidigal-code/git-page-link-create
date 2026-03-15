# Funcao Chat Link

A feature `/chat-link/` armazena historico de conversa na hash da URL.

## O que permite

- Compartilhar contexto sem backend
- Manter historico no proprio link
- Responder mensagens anteriores mantendo timeline

## Fluxo

1. Abrir `/chat-link/`
2. Enviar mensagens
3. App comprime historico na hash
4. Compartilhar link
5. Outra pessoa abre e continua conversa

## Observacoes

- Historicos longos sao limitados pelo tamanho maximo da URL
- O app avisa antes de ultrapassar o limite seguro
