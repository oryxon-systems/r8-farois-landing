# R8 Faróis Customizados — Reformulação Visual Premium

Status: aprovado pelo usuário em 2026-08-18. Escopo: `index.html` (site estático, único arquivo, Tailwind via CDN).

## Objetivo

Elevar a qualidade visual da landing page de "boa/genérica" para "premium, feita sob medida para a R8", mantendo 100% do conteúdo, estrutura de seções, links, dados de contato e fatos técnicos (garantia 90 dias, etc). Não é um redesign de conteúdo — é um redesign de forma: tipografia, motion, micro-interação e ritmo visual.

## Por que (contexto de marca)

R8 Faróis Customizados: retrofit e iluminação veicular de alta performance, São Paulo. Público valoriza acabamento OEM, precisão técnica, não é "tuning barato". Posicionamento: "O olhar que impõe respeito" — autoridade técnica (SENAI, 15+ anos), luz/escuridão como metáfora central.

O site já tinha uma base de design deliberada (paleta preto+âmbar, elemento de corte diagonal "cutoff-line", sweep de luz no hero) — não é um projeto do zero. O gap identificado: a fonte de display (Rajdhani) é comum em kits gamer/esports e dilui o caráter automotivo-premium; falta motion com significado (o carregamento é um fade genérico); as micro-interações são hover states estáticos sem relação com a metáfora de luz.

## Paleta (mantida, sem novos hex)

A paleta atual já evita o laranja genérico de IA (#D97757) — é mantida integralmente, apenas nomeada com intenção e usada com mais disciplina:

| nome | hex | uso |
|---|---|---|
| vazio | `#0a0a0b` | fundo base |
| carvão | `#131315` | painéis |
| grafite | `#1b1b1e` | painéis alternados |
| âmbar-xenon | `#ff7a1a` | cor de luz de farol — CTA, destaques, glow |
| âmbar-escuro | `#c2410c` | hover, gradientes |
| branco-led | `#f4f2ee` | texto principal |
| neblina | `#94949c` | texto secundário |

Decisão explícita: **não** introduzir uma segunda cor de acento (ex.: um ciano "DRL" cogitado e descartado) — diluiria a identidade preto+âmbar que a marca pediu para manter.

## Tipografia

- Display: **Big Shoulders Display** (Google Fonts) — condensada, industrial, "chapa cortada a laser". Rima com o elemento cutoff-line já existente. Substitui Rajdhani.
- Corpo: **Inter** — mantido.
- Mono/labels técnicos: **JetBrains Mono** — mantido, já funciona bem para eyebrows/captions.

## Elemento-assinatura: sequência de ignição do farol

No carregamento do hero (uma vez por sessão, via `sessionStorage`):
1. Tela parte de preto puro (sem imagem/texto visíveis).
2. A linha de corte (cutoff) "acende" com um snap seco (~150ms), como o self-check de LED de carros premium (BMW/Audi "welcome light").
3. O feixe varre horizontalmente e revela o headline via `clip-path`, sincronizado com o acender.
4. Depois disso, o `beam-line` sweep ambiente que já existe continua rodando, mais sutil que hoje.

Com `prefers-reduced-motion: reduce`: pula direto para o estado final, sem nenhuma etapa animada.

## Micro-interações

Cards de serviço (`Matriz de Serviços`) e itens de "Diferenciais" ganham um glow âmbar que segue o cursor — `radial-gradient` posicionado via `mousemove` (JS leve, sem lib), simulando reflexo de farol. Não é `box-shadow` estático genérico.

## Seção comparativa (halógena vs R8)

Correção importante em relação ao pedido original: `assets/compare-beam.png` é **uma única foto** (R8 aceso), não um par halógena/R8 lado a lado. Um slider drag em cima dela fabricaria um "antes" que não existe — isso não será feito.

Solução: diagrama ilustrado em SVG (dois cones de luz — estreito/amarelo/curto = halógena; largo/branco-âmbar/cutoff nítido = R8), com:
- Reveal on scroll (Intersection Observer) ao entrar na viewport.
- No desktop, handle arrastável entre os dois cones (JS vanilla).
- No mobile, apenas o reveal (sem drag).
- `compare-beam.png` permanece ao lado como prova fotográfica real, não como base do slider.

## FAQ

Mantém `<details>`/`<summary>` semântico. Troca a abertura abrupta por transição de altura suave (`grid-template-rows` + JS mínimo para toggle da classe). Ícone `+` → `×` mantido como está.

## Espaçamento

Revisão do ritmo vertical entre seções — maior respiro especificamente entre "Diferenciais Técnicos" e "FAQ", que hoje estão com pouco espaço relativo ao resto.

## Copy — apenas 2 ajustes pontuais

Não é reescrita geral. Só onde o texto soa como copy de vendas genérica:
1. Footer subhead ("Fale agora com a R8 e leve o padrão OEM para o seu veículo.") → tom mais direto, de quem entende de carro.
2. Hero subtexto → leve corte de gordura, sem alterar nenhum fato técnico.

Nenhum outro texto, número de WhatsApp, e-mail, endereço, link social, texto de garantia ou conteúdo técnico do FAQ é alterado.

## Acessibilidade

- Contraste AA mínimo em todos os pares texto/fundo.
- Foco de teclado visível (já existe `:focus-visible` com outline âmbar — mantido/verificado após mudanças de layout).
- `prefers-reduced-motion` respeitado em toda animação nova (ignition sequence, glow de cursor, drag handle).

## Fora de escopo

- Nenhuma imagem nova gerada — apenas as 3 fotos existentes (`hero-r8.png`, `workshop.png`, `compare-beam.png`) mais CSS/SVG.
- Sem framework de build novo — continua HTML único + Tailwind CDN + JS vanilla inline.
- Sem alteração de conteúdo factual, links, contatos ou textos legais/garantia.
