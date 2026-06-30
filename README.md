# 🛒 Sales System Frontend

Interface web do **Sales System**, um sistema de gestão comercial desenvolvido para gerenciamento de clientes, produtos, categorias, usuários, vendas e métodos de pagamento.

O projeto foi desenvolvido utilizando **React**, **TypeScript** e **Vite**, consumindo uma API REST desenvolvida em **Java Spring Boot**.

---

## 🚀 Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS Modules
- React Icons

---

## 📂 Estrutura do Projeto

```
src
├── components
│   ├── layout
│   └── ui
├── data
├── pages
│   ├── auth
│   ├── catalog
│   ├── customers
│   ├── home
│   ├── sales
│   ├── settings
│   ├── shared
│   └── users
├── services
├── types
├── App.tsx
├── main.tsx
└── index.css
```

---

## ✨ Funcionalidades

- Autenticação de usuários
- Dashboard inicial
- Gerenciamento de Usuários
- Gerenciamento de Clientes
- Gerenciamento de Produtos
- Gerenciamento de Categorias
- Gerenciamento de Métodos de Pagamento
- Gerenciamento de Vendas
- Breadcrumb de navegação
- Sidebar responsiva
- Topbar
- Componentes reutilizáveis
- Integração com API REST
- Consumo de endpoints utilizando Axios

---

## 🔐 Autenticação

O sistema utiliza autenticação baseada em **JWT (JSON Web Token)**.

Após o login, o Access Token é armazenado no navegador e enviado automaticamente nas requisições autenticadas através do header:

```http
Authorization: Bearer {token}
```

---

## 🌐 Backend

O frontend consome uma API REST desenvolvida em:

- Java 21
- Spring Boot
- Spring Security
- JWT
- PostgreSQL
- Docker

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/seu-usuario/sales-system-frontend.git
```

Entre na pasta:

```bash
cd sales-system-frontend
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Executando

```bash
npm run dev
```

O projeto ficará disponível em:

```
http://localhost:5173
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo:

```
.env
```

Exemplo:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 📡 Integração com API

Toda comunicação com o backend é realizada através da camada de serviços localizada em:

```
src/services
```

Exemplo:

- authService
- userService
- customerService
- productService
- categoryService
- saleService
- paymentMethodService

---

## 📸 Telas

- Login
- Dashboard
- Usuários
- Clientes
- Produtos
- Categorias
- Métodos de Pagamento
- Vendas
- Configurações

---

## 📁 Organização

O projeto segue uma arquitetura baseada em responsabilidades:

- **pages** → telas da aplicação
- **components** → componentes reutilizáveis
- **services** → comunicação com API
- **types** → interfaces e modelos
- **data** → dados estáticos e navegação

---

## 📌 Scripts

Executar em desenvolvimento

```bash
npm run dev
```

Gerar build

```bash
npm run build
```

Visualizar build

```bash
npm run preview
```

Lint

```bash
npm run lint
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo, portfólio e demonstração de conhecimentos em desenvolvimento Full Stack.

---

## 👨‍💻 Desenvolvedor

**Douglas Magalhães**

Analista de Suporte na TOTVS e estudante de Análise e Desenvolvimento de Sistemas.

### Tecnologias

- Java
- Spring Boot
- Spring Security
- JWT
- PostgreSQL
- Docker
- React
- TypeScript
- Vite
- Node.js
- Git