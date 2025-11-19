# GradeBox - Sistema de Gerenciamento de Notas

O GradeBox é um sistema minimalista para registrar e consultar notas de alunos.

## Tecnologias

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 7.9.3
- TanStack Query 5.90.2
- Axios 1.12.2
- React Hook Form 7.63.0
- Zod 4.1.11

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Ajuste as variáveis de ambiente conforme necessário.

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── app/              # Configuração da aplicação
├── assets/           # Arquivos estáticos
├── core/             # Componentes e utilitários globais
├── domain/           # Domínios de negócio
└── pages/            # Páginas da aplicação
```