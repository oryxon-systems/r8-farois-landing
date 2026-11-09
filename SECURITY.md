# SECURITY.md - Diretrizes e Políticas de Segurança

## 1. Políticas do Projeto
- **Sanitização e Content Security Policy (CSP)**: Assegurar que recursos externos venham apenas de fontes confiáveis (Google Fonts, Tailwind CDN).
- **Proteção de Dados Pessoais (LGPD)**: O site não armazena cookies nem dados sensíveis dos visitantes no lado do servidor; a comunicação é direcionada via WhatsApp com consentimento do usuário.

## 2. Links Externos
- Todos os links que abrem em novas abas (`target="_blank"`) devem conter obrigatoriamente `rel="noopener"` ou `rel="noopener noreferrer"` para prevenir ataques do tipo *tabnabbing*.

## 3. Scripts de Terceiros
- Minimizar dependência de scripts executáveis externos no cliente.
