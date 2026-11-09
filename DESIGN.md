# DESIGN.md - Sistema de Design & Guia de Estilo

## 1. Paleta de Cores (Dark High-Contrast Theme)
- `void`: `#0a0a0b` (Fundo principal ultra escuro)
- `panel`: `#131315` (Fundo de seções secundárias)
- `panel2`: `#1b1b1e` (Fundo de cards e inputs)
- `amber`: `#ff7a1a` (Cor primária de destaque / iluminação)
- `amberd`: `#c2410c` (Hover & estados ativos)
- `bone`: `#f4f2ee` (Texto principal de alto contraste)
- `fog`: `#94949c` (Texto secundário e labels)

## 2. Tipografia
- **Títulos / Headings**: `Big Shoulders Display` (Peso 600–800, uppercase).
- **Corpo / Body**: `Inter` (Leitura fluida em dispositivos móveis e desktop).
- **Labels / Badges**: `JetBrains Mono` (Sensação técnica/automotiva de precisão).

## 3. Elementos Visuais Distintivos
- **Cut-off Line**: BORDAS com recortes diagonais usando `clip-path` simetrizando a linha de corte dos projetores ópticos de alta performance.
- **Glow Effects**: Radial gradients amber ao passar o cursor sobre os cards de serviço (`glow-card`).

## 4. Build CSS
O projeto utiliza Tailwind CSS v3 compilado estaticamente para `assets/css/tailwind.css`.
Comando para rebuild local:
```bash
./bin/tailwindcss -i src/input.css -o assets/css/tailwind.css --minify
```
