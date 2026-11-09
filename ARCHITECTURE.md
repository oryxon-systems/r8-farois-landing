# ARCHITECTURE.md - Arquitetura da Solução

## 1. Stack Tecnológica
- **HTML5**: Semântico com suporte a acessibilidade (aria-labels, roles) e marcação de Schema.org (`AutoRepair`).
- **Tailwind CSS (CDN)**: Estilização rápida baseada em utilitários e tema customizado (`void`, `panel`, `amber`, etc.).
- **Vanilla JavaScript**: Scripts leves encapsulados em IIFEs para comparador de feixe, animações de scroll e comportamento da Hero.
- **Fontes Google Web**: *Big Shoulders Display*, *Inter*, e *JetBrains Mono*.

## 2. Estrutura do Projeto
```text
r8-farois-site/
├── index.html              # Landing page principal
├── assets/                 # Imagens, logotipos e favicons (.png, .jpg)
├── PRD.md                  # Requisitos de Produto
├── ARCHITECTURE.md         # Documento de Arquitetura
├── RULES.md                # Regras de Negócio e Estilo
├── DESIGN.md               # Design System e UI/UX Guidelines
├── TASK.md                 # Matriz de Tarefas e Progresso
├── SECURITY.md             # Políticas e Boas Práticas de Segurança
└── DECISIONS.md            # Registro de Decisões de Arquitetura (ADRs)
```

## 3. Integração de Links de Conversão
- Parâmetros diretos via URL do WhatsApp (`https://wa.me/5511984027014?text=...`) pré-formatados com texto amigável de lead.
