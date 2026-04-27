# Controle de Gastos PIX

Aplicação React + Vite para controle de gastos via comprovantes PIX em PDF.

## O que esta versão corrige

Esta versão não depende de Tailwind para o layout. O visual foi refeito em CSS próprio, mantendo a aparência do protótipo do Figma: cards brancos, grid em quatro colunas, cards de indicadores coloridos, área de upload e gráfico circular.

## Rodar no StackBlitz

1. Extraia o ZIP.
2. Envie a pasta inteira para o StackBlitz.
3. Rode:

```bash
npm install
npm run dev
```

## Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o arquivo:

```txt
supabase/schema.sql
```

4. Copie `.env.example` para `.env`.
5. Preencha:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
```

Sem essas variáveis, o app funciona com `localStorage`.

## GitHub Pages

O workflow está em:

```txt
.github/workflows/deploy.yml
```

No GitHub, cadastre os secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_BASE_PATH`, se o projeto for publicado em subpasta. Exemplo: `/controle-pix/`

## Parser do comprovante

O parser está em:

```txt
src/lib/pdfParser.ts
```

Ele foi feito para o modelo de comprovante Bradesco com estes campos:

- `Valor: R$ ...`
- `Dados de quem recebeu / Nome: ...`
- `Data do débito: ...`
- `Número de Controle: ...`

## Arquivos principais

```txt
src/components/FinancialDashboard.tsx
src/styles/index.css
src/lib/pdfParser.ts
src/lib/storage.ts
src/lib/supabase.ts
supabase/schema.sql
```
