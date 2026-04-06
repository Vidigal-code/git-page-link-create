# Arquitetura e Engenharia de Software

O ecossistema **GitPageLinkCreate** foi pensado do dia zero para ser tolerante a alta carga (escala de clientes) ao repassar 90% da sua carga reativa para processos puros do Client (Navegador). O único servidor central existe para hospedar assets imutáveis e APIs isoladas leves.

## Feature-Sliced Design (FSD)
Como base, evitamos o caótico esquema de pastas onde componentes perdem a ligação com seu domínio semântico. Em `src/`, emprega-se os conceitos de Feature Sliced Design (FSD):
1. **`app/` / `pages/`:** A camada Roteadora (Root/Framework). Concentra `index.tsx`, as chamadas SSG e Wrappers.
2. **`widgets/`:** Elementos visuais massivos compostos. Um Header Global ou Footer que mesclam funcionalidades inteiras.
3. **`features/`:** Lógicas e formulários isolados. Por exemplo: O encurtador de URL reside em `features/shorturl`, carregando seu sub-roteador ou estado Redux/Context próprio.
4. **`entities/`:** Os Domínios Nucleares. Pode conter Interfaces TypeScript relativas aos tipos universais (usuários, repositórios).
5. **`shared/`:** Componentes visuais burros (Botões genéricos, Inputs de Textos). Ferramentas utilitárias puras.

## Empacotamento de Estado via URL
A maior cartada desta arquitetura é a evasão de bancos de dados relacionais e em nuvem custosos. O sistema armazena informações estendidas dentro do protocolo Hash do link.
1. O criador escreve um Portfolio longo e insere imagens.
2. A _Feature_ de submissão serializa tudo pra JSON.
3. Pako aplica compressão Deflate/Inflate profunda e produzindo um texto.
4. A Base64 final torna-se o caminho dinâmico (`/ra/[slug]`).
Isso garante acesso assíncrono em velocidade nativa sem custo de chamadas Backend, apenas transferindo para o browser hospedeiro dos visitantes a incumbência de hidratar esse código e "remontar" a página.

## Suporte Nativo CSS 
Usando pre-compiladores atrelados e subscrição de design puro do `styled-components` ou Tailwind, mantemos isolamento rígido evitando conflitos visuais quando diferentes documentos são renderizados simultaneamente.
