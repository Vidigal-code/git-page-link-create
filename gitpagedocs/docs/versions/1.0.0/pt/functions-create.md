# Funcao Create

A pagina `/create` e o centro principal de funcoes do app.

## O que faz

- Recebe texto para HTML, Markdown, CSV e TXT
- Recebe upload para XLS/XLSX, DOCX/PPTX, imagem, PDF, video e audio
- Comprime payload antes de gerar links
- Gera links para aliases compactos (`/r` e `/ra`)
- Suporta modo por URL de origem para arquivos grandes

## Fluxo principal

1. Selecionar tipo de conteudo
2. Colar texto ou enviar arquivo
3. Escolher modo da ferramenta
4. Gerar link
5. Copiar/abrir/compartilhar

## Comportamento de seguranca

- Bloqueia geracao acima do limite de URL configurado
- Mostra erro para formato invalido ou tipo nao suportado
- Opera 100% no navegador (sem upload em backend)
