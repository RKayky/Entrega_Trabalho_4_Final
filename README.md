# Relatório de Defesas Arquiteturais - Trabalho 4

## 1. Prevenção de SQL Injection (SQLi)
**Mitigação:** A proteção contra SQL Injection foi garantida através do uso do **Mongoose**.
**Explicação:** O Mongoose utiliza *Queries Parametrizadas* por padrão. Isso significa que ele trata os inputs do usuário como dados literais e não como comandos executáveis do banco de dados, impedindo a injeção de código malicioso nas consultas.

## 2. Prevenção de Cross-Site Scripting (XSS)
**Mitigação:** Implementada nas Views (.ejs).
**Onde:** Em arquivos como `views/home.ejs` e `views/login.ejs`.
**Explicação:** Foi utilizada estritamente a tag `<%= variavel %>` do EJS, que realiza o *Output Escaping* automático, convertendo caracteres perigosos (como `<` e `>`) em entidades HTML seguras. A tag `<%- %>` foi evitada para dados de usuário.

## 3. Proteção Contra Força Bruta
**Mitigação:** Middleware `express-rate-limit`.
**Onde:** Aplicado especificamente na rota `POST /login` no `server.js`.
**Teste:** O sistema bloqueia requisições após 5 tentativas falhas em 1 minuto.

## 4. Hardening e Credenciais
* **Helmet:** Configurado no topo do `server.js` para proteger HTTP Headers.
* **Dotenv:** Credenciais (Mongo URI e Session Secret) movidas para o arquivo `.env` e acessadas via `process.env`.

## 5. Proteção CSRF
**Mitigação:** Middleware `csurf`.
**Implementação:** Token gerado no servidor e injetado em todos os formulários POST através de `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`.
