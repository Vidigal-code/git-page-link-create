# Funcao Short URL

As funcoes de short URL criam links menores para compartilhamento em modo frontend-only.

## Rotas principais

- `/shorturl-create` para gerar links curtos
- `/shorturl` para decodificar e redirecionar
- `/s/<code>` como caminho compacto para hosting estatico

## Comportamento

- Codifica links longos em tokens curtos reversiveis
- Suporta atalhos por codigos de referencia
- Mantem compatibilidade com flags de modo compartilhado

## Recovery em host estatico

Quando uma rota compacta abre direto, `404.tsx` detecta padroes recuperaveis e redireciona para a rota correta.
