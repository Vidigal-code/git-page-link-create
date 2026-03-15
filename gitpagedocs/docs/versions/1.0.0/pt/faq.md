# FAQ

## Por que um link gerado abre sem conteudo?

Verifique:

- se a URL ainda possui payload completo (`#d=` ou `?d=`)
- se o prefixo de tipo existe (exemplo: `h-`, `md-`, `pdf-`)
- se o link nao foi truncado por chat ou email

## Por que `/s/<code>` cai em 404 no host estatico?

Verifique:

- se o host esta servindo o `404.html` exportado
- se o base path bate com `next.config.js` em producao
- se o codigo curto nao foi alterado manualmente

## Por que falha com arquivos de midia grandes?

Arquivos grandes podem passar do limite de URL. Use modo por URL publica quando possivel:

- imagem/video/audio por URL publica
- Office por URL publica em `/render/office?source=...`

## Por que Office nao renderiza?

Verifique:

- URL publica (sem autenticacao/cookies)
- protocolo `http` ou `https`
- formato suportado pelo Office web viewer

## Por que recovery falha em links antigos?

Verifique:

- marcador suportado (`#d=`, `?d=`, legado `#data=`, `?data=`)
- payload nao corrompido por encurtadores externos
- hash preservada no compartilhamento
