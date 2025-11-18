const express = require('express');
const session = require('express-session'); 
const mongoose = require('mongoose'); 
const userController = require('./controllers/userController');
const isAuth = require('./middleware/auth'); // Importa o segurança
const authController = require('./controllers/authController');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// [CRUCIAL] Middleware para ler dados de formulários (req.body)
app.use(express.urlencoded({ extended: true }));


// Configuração do Middleware de Sessão
app.use(session({
    secret: 'segredo-do-capitao-black', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false } 
}));


// 2. Conectar ao MongoDB (Substitua pela SUA string de conexão)
mongoose.connect('mongodb://127.0.0.1:27017/arquiteturaWeb')
  .then(() => console.log('🔥 Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar no Mongo:', err));


// --- ROTAS PÚBLICAS (LOGIN/LOGOUT/REGISTRO) ---

// Rota de Login (Passa query params de erro/sucesso para a view)
app.get('/login', (req, res) => {
    res.render('login', { erro: req.query.erro, sucesso: req.query.sucesso });
});
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Rotas de REGISTRO PÚBLICO
app.get('/register', authController.getRegisterForm);
app.post('/register', authController.registerUser);


// --- ROTAS PROTEGIDAS (CRUD) ---
app.get('/', (req, res) => res.redirect('/users'));

app.get('/users', isAuth, userController.getAllUsers);
app.get('/users/new', isAuth, userController.getNewUserForm);

// **Atenção:** A rota antiga de criação (app.post('/users', ...)) foi removida ou adaptada
// para evitar o TypeError, pois a criação pública está em /register.
// Se precisar de criação por Admin, mapeie para uma nova função adminCreateUser.

// Rota para DELETAR
app.post('/users/delete/:id', isAuth, userController.deleteUser);

// Rotas para EDITAR
app.get('/users/edit/:id', isAuth, userController.getEditUserForm);
app.post('/users/update/:id', isAuth, userController.updateUser);


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));