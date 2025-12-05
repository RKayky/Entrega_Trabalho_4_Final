const express = require('express');
const route = express.Router();

// --- CORREÇÃO DAS IMPORTAÇÕES ---
// O arquivo existe como homeController.js
const homeController = require('./controllers/homeController'); 
// O arquivo existe como authController.js (mas vamos chamar de loginController aqui para não quebrar o resto do código)
const loginController = require('./controllers/authController'); 

// --- PROTEÇÃO CONTRA FORÇA BRUTA ---
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: "Muitas tentativas de login. Tente novamente em 1 minuto."
});

// --- ROTAS ---

// Home
route.get('/', homeController.index);

// Login e Cadastro
route.get('/login/index', loginController.index); // Se der erro aqui, talvez authController não tenha .index
route.get('/login', (req, res) => res.render('login', { csrfToken: req.csrfToken(), erro: null, sucesso: null }));

// Aplica a proteção no POST do login
route.post('/login', loginLimiter, loginController.login);
route.get('/logout', loginController.logout);

// Registro
route.get('/register', loginController.getRegisterForm); // Verifica se essa função existe no authController
route.post('/register', loginController.register); // Verifica se é .register ou .registerUser

module.exports = route;