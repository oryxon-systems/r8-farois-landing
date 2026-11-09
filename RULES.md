# RULES.md - Regras do Projeto

## 1. Regras de Código e Estilo
- **Zero Framework Bloat**: Manter como Single-File Landing Page HTML estática sem dependências de build (npm/webpack) desnecessárias.
- **Validação HTML**: Qualquer alteração no `index.html` deve ser validada estruturalmente (ex: via `python3 -c "import html.parser; ..."`).
- **Acessibilidade (a11y)**: Todos os SVGs decorativos devem conter `aria-hidden="true"`, botões interativos devem ser navegáveis via teclado.

## 2. Regras de Negócio
- Todo link de CTA deve direcionar diretamente para o número oficial do WhatsApp (`+55 11 98402-7014`).
- Nunca remover ou alterar as informações da localização (*Tatuapé, São Paulo*) e autoridade (*Romeu Novais - 15+ anos / SENAI*).
