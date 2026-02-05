# Sistema de Temas com Modo Claro e Escuro

## 📋 Resumo

Implementado um sistema completo de temas com suporte a modos claro e escuro, utilizando a propriedade `supportsLightAndDarkModes` para indicar se um tema possui variantes light/dark.

## 🎨 Temas Disponíveis

### 1. Matrix Dark (Padrão)
- **Modo**: Escuro
- **Suporta Light/Dark**: ✅ Sim
- **Cores**: Verde neon (`#00ff41`) em fundo escuro (`#0d0208`)
- **Características**: Efeitos de brilho, fonte monoespaçada, estética cyberpunk

### 2. Matrix Light
- **Modo**: Claro
- **Suporta Light/Dark**: ✅ Sim
- **Cores**: Verde escuro (`#008f11`) em fundo claro (`#f0f8f0`)
- **Características**: Efeitos sutis de brilho, fonte monoespaçada, visual Matrix limpo

### 3. Default
- **Modo**: Claro
- **Suporta Light/Dark**: ❌ Não
- **Cores**: Azul (`#0070f3`) em fundo branco
- **Características**: Design limpo, minimalista e profissional com fontes do sistema

## 🔧 Propriedade `supportsLightAndDarkModes`

### O que é?
Uma propriedade booleana que indica se um tema possui variantes em modo claro e escuro.

### Valores
- **`true`**: O tema possui uma variante complementar (ex: Matrix tem dark e light)
- **`false`**: O tema é único com modo fixo (ex: Default é apenas light)

### Exemplo de Uso no JSON

```json
{
  "id": "matrix-dark",
  "name": "Matrix Dark",
  "mode": "dark",
  "supportsLightAndDarkModes": true,
  "colors": { ... }
}
```

## 📁 Estrutura de Arquivos

```
public/layouts/
├── layouts.json          # Registro de temas
├── matrix-dark.json      # Variante escura do Matrix
├── matrix-light.json     # Variante clara do Matrix
└── default.json          # Tema padrão (sem variantes)
```

## 🚀 Como Usar

### No Código
Os temas são carregados automaticamente pelo sistema. O tema padrão é `matrix-dark`.

### Seletor de Temas
Os usuários podem alternar entre os temas disponíveis usando o seletor no cabeçalho da aplicação.

## 📝 Documentação Atualizada

### README.md
- ✅ Seção "Theme System" completamente reescrita
- ✅ Tabela de propriedades de temas adicionada
- ✅ Exemplos atualizados com novas propriedades
- ✅ Guia de contribuição atualizado

### Propriedades do Tema

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `id` | string | Identificador único do tema |
| `name` | string | Nome de exibição |
| `author` | string | Criador do tema |
| `version` | string | Versão do tema |
| `mode` | `"light"` \| `"dark"` | Modo de cores |
| `supportsLightAndDarkModes` | boolean | Se possui variantes light/dark |
| `colors` | object | Paleta de cores |
| `typography` | object | Configurações de fonte |
| `components` | object | Estilos específicos de componentes |
| `animations` | object | Preferências de animação |

## 🎯 Benefícios

1. **Clareza**: Usuários sabem quais temas têm variantes
2. **Extensibilidade**: Fácil adicionar novos temas com/sem variantes
3. **Futuro**: Base para implementar toggle automático light/dark
4. **Organização**: Estrutura clara e bem documentada

## 💡 Próximos Passos (Opcional)

Melhorias futuras podem incluir:
- Botão de alternância light/dark no cabeçalho
- Detecção de preferência do sistema (`prefers-color-scheme`)
- Transições suaves entre variantes light/dark
- Mais famílias de temas com variantes
