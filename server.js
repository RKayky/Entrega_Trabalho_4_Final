// 1. Carregar o cofre de senhas (Tarefa 3B)
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
// Importa o arquivo de rotas que criamos no Passo 1
const routes = require('./routes');
const path = require('path');

// --- DEFESAS DE SEGURANÇA (Trabalho 4) ---
const helmet = require('helmet'); // Tarefa 3A
const csrf = require('csurf');    // Tarefa 4A
// ------------------------------------------

// 2. Ativar Helmet (Cabeçalhos Seguros)
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Configuração da Sessão
const sessionOptions = session({
  secret: process.env.SESSION_SECRET, // Lê do arquivo .env
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), // Lê do .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

// 3. Ativar CSRF (Depois da sessão, antes das rotas)
app.use(csrf());

// Middleware Global (Injeta o Token em todas as páginas)
app.use((req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  res.locals.csrfToken = req.csrfToken(); // <--- OBRIGATÓRIO PARA OS FORMS
  next();
});

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Usar as nossas rotas
app.use(routes);

// Conectar ao Banco
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.log(e));

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});