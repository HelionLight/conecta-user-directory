# Conecta — Diretório de Usuários

Aplicação desenvolvida com React, Vite e TypeScript para listar usuários da API pública JSONPlaceholder.

## Requisitos

- Node.js instalado
- npm instalado

## Como executar

Dentro da pasta do projeto, execute:

```bash
npm install
npm run dev
```

Depois, abra o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
```

## Funcionalidades

- Lista usuários usando o endpoint:
  `https://jsonplaceholder.typicode.com/users`
- Exibe nome, nome de usuário e e-mail.
- Permite buscar usuários pelo nome.
- Abre um cartão de detalhes ao selecionar um usuário.
- Exibe e-mail, telefone, website, empresa, cidade, endereço, CEP e informações da empresa.
- Mostra estados de carregamento, erro e nenhum resultado.
- Permite alternar entre modo claro e modo escuro.
- Possui três estilos visuais:
  - **Base:** visual padrão.
  - **Elegante:** cores, sombras e detalhes mais sofisticados.
  - **Simples:** visual mais leve, com menos efeitos.
- É responsiva para telas menores.

## Organização do código

```text
src/
├── App.tsx       # Tipos, estados, busca, lista, modais e componentes
├── main.tsx      # Ponto de entrada da aplicação React
└── styles.css    # Layout, responsividade, temas e estilos visuais
```

### `App.tsx`

- `User`: representa o formato dos dados recebidos da API.
- `loadUsers`: busca os usuários e controla carregamento e erro.
- `filteredUsers`: filtra os resultados pelo nome digitado.
- `UserCard`: apresenta cada usuário na lista.
- `UserModal`: mostra os detalhes completos do usuário.
- `SettingsModal`: permite escolher o modo de cor e o estilo da página.
- `LoadingState`, `ErrorState` e `EmptyState`: estados visuais da aplicação.

### `styles.css`

O arquivo contém os estilos dos componentes, os dez tons dos avatares, os temas claro e escuro, os estilos Base/Elegante/Simples e as regras responsivas.

## API

A aplicação utiliza dados fictícios fornecidos pelo JSONPlaceholder. Os telefones, cidades e endereços são exemplos para desenvolvimento e não representam necessariamente informações reais.

## Scripts disponíveis

| Comando | Função |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção |
| `npm run preview` | Visualiza localmente a versão de produção |
