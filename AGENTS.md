# AGENTS.md — Padrão Oryxon Systems

Este projeto é mantido pela Oryxon Systems (oryxonsystems.com.br).
Papéis:
- **Orquestrador (Claude):** define escopo, copy, estrutura, SEO e aprova entregas.
- **Executor (você, agente nesta pasta):** implementa SOMENTE o que o brief da tarefa pede.

## Regras de ouro
1. Escopo fechado: execute apenas a tarefa descrita. Nada de "melhorias" não solicitadas, refatoração, troca de dependências ou reorganização de pastas.
2. Copy é final: textos vindos no brief entram literalmente. Não reescreva, não "melhore", não traduza.
3. Nunca invente dados do cliente (telefone, endereço, preços, garantias, depoimentos). Se faltar, deixe `<!-- TODO: dado pendente -->` e reporte.
4. Nunca faça `git commit`, `git push` ou deploy. Push em `main` dispara deploy automático na Vercel, e quem libera é o orquestrador após revisão.
5. Não apague arquivos. Se algo parecer obsoleto, liste no relatório.
6. Dúvida de escopo = pare e pergunte. Não presuma.

## Stack e convenções
- HTML estático + Tailwind CSS. Sem frameworks JS, sem build step novo, sem bibliotecas adicionais sem autorização.
- JS: vanilla, mínimo, sem dependências externas.
- Imagens: WebP/AVIF quando possível, sempre com `width`/`height` e `alt` descritivo em PT-BR; `loading="lazy"` abaixo da dobra.
- Idioma do conteúdo: português do Brasil.
- Indentação: 2 espaços. Classes Tailwind em ordem lógica (layout → espaçamento → tipografia → cor → estados).

## Requisitos de qualidade (toda entrega)
- Responsivo: testar mentalmente 360px, 768px, 1280px.
- Acessibilidade: contraste AA, foco visível, hierarquia de headings correta (um único H1), botões e links com rótulo claro.
- Performance: meta Lighthouse ≥ 90 em mobile; não adicionar fontes, scripts ou imagens pesadas sem necessidade.
- SEO: preservar `<title>`, meta description, Open Graph, canonical e schema JSON-LD existentes. Só alterar se o brief pedir.
- `prefers-reduced-motion` respeitado em qualquer animação nova.

## Relatório de saída (obrigatório ao final de cada tarefa)
- Arquivos alterados/criados (lista)
- Resumo do que foi feito, item a item do brief
- Pendências, TODOs e dúvidas
- Qualquer coisa que você notou mas NÃO alterou

---

## Projeto: R8 Faróis Customizados

- Cliente: R8 Faróis Customizados — Iluminação Veicular (São Paulo/SP)
- Domínio: r8farois.com.br (produção, Vercel, deploy automático via push em `main`)
- Slogan: "O olhar que impõe respeito."
- Posicionamento: premium, público gearhead, acabamento padrão OEM, plug and play.

### Identidade visual — NÃO ALTERAR sem ordem explícita
- Fonte da verdade visual: DESIGN.md. Em caso de conflito entre este arquivo e o DESIGN.md, siga o DESIGN.md e reporte a divergência.
- Paleta escura com acento âmbar (#FF7A1A como referência do âmbar da marca).
- Tipografia: Big Shoulders Display (títulos), Rajdhani (apoio), Inter (texto), JetBrains Mono (detalhes técnicos).
- Assinaturas da marca, que devem ser preservadas:
  - Animação de "ignição" do farol no carregamento
  - Glow que segue o cursor
  - Slider comparativo halógeno vs R8
  - Motivo diagonal (clip-path) da "linha de corte" — representa a linha de corte óptica, diferencial técnico da R8. Não é decoração; manter em novas seções.
- Seção "O Especialista": foto tratada do Romeu + vídeo YouTube incorporado. Não substituir.
- Rodapé: crédito com link para a Oryxon Systems. Nunca remover.

### Dados oficiais (usar apenas estes)
- WhatsApp: (11) 98402-7014
- E-mail: novaisromeu@gmail.com
- Instagram: @r8farois_iluminacao_veicular
- Facebook: facebook.com/r8farois
- Endereço: Rua Cantagalo, São Paulo - SP
- Garantia: 90 dias em mão de obra e vedação (retrofit/instalação)
