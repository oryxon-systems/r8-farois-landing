# DECISIONS.md - Registro de Decisões de Arquitetura (ADR)

## ADR 001: Uso de Single-File Landing Page HTML + Tailwind CDN
- **Contexto**: Necessidade de carregamento ultrarrápido, fácil manutenção e hospedagem simples sem custos de servidor backend.
- **Decisão**: Manter a landing page em um único arquivo [index.html](file:///media/uedson/storage/Projetos/r8-farois-site/index.html) estilizado via Tailwind CSS CDN.
- **Consequências**: Facilidade total para implantação (Vercel, Netlify, GitHub Pages) sem etapas de compilação complexas.

## ADR 002: Redirecionamento Direto via WhatsApp para Conversão
- **Contexto**: O ciclo de vendas de retrofit e customização de faróis exige atendimento consultivo prévio.
- **Decisão**: Utilizar o WhatsApp como canal principal de conversão com mensagens pré-preenchidas em vez de formulários tradicionais.

## ADR 003: Inclusão de Sticky CTA Mobile e Qualificação na Hero
- **Contexto**: Maior parte dos acessos provém de tráfego pago em dispositivos móveis.
- **Decisão**: Incluir barra fixa no rodapé mobile e select de qualificação no topo para melhorar a qualidade dos leads recebidos.
