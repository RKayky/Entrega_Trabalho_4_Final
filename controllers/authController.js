// controllers/authController.js

const User = require('../models/User');
// AJUSTE 1: Usar 'bcryptjs' que é mais compatível e você já instalou
const bcrypt = require('bcryptjs'); 

// --- Lógica para Renderizar a Tela de Login (GET) ---
// AJUSTE 2: Criar a função 'index' que o routes.js está chamando
const index = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/users');
    }
    // Renderiza a view 'login.ejs' passando erros ou sucessos
    res.render('login', { 
        erro: req.query.erro, 
        sucesso: req.query.sucesso 
    });
};

// --- Lógica de Login (POST) ---
const login = async (req, res) => {
  const { email, senha } = req.body; 

  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.redirect('/login?erro=usuario_nao_encontrado'); 
    }

    // Compara a senha usando bcryptjs
    const isMatch = await bcrypt.compare(senha, user.password);
    
    if (!isMatch) {
      return res.redirect('/login?erro=senha_incorreta');
    }

    // Salva a sessão
    req.session.userId = user._id;
    req.session.userName = user.nome;
    
    // Sucesso: Manda para a área interna
    return res.redirect('/users');
    
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).send("Erro interno no servidor.");
  }
};

// --- Lógica de Logout (GET) ---
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    
    res.clearCookie('connect.sid'); 
    res.redirect('/login');
  });
};

// --- Lógica de Registro (GET: Renderizar form) ---
const getRegisterForm = (req, res) => {
    res.render('register', { erro: req.query.erro });
};

// --- Lógica de Registro (POST: Criar usuário) ---
// AJUSTE 3: Renomeado de 'registerUser' para 'register' para bater com o routes.js
const register = async (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(senha, 10); 

        await User.create({
            nome,
            email,
            password: hashedPassword, // Salva o hash no banco
            cargo
        });
        
        res.redirect('/login?sucesso=cadastro');

    } catch (error) {
        if (error.code === 11000) {
            return res.redirect('/register?erro=email_existente');
        }
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).send("Erro interno ao registrar.");
    }
};

// Exporta tudo com os nomes corretos
module.exports = { 
    index,           // Adicionado
    login, 
    logout, 
    getRegisterForm, 
    register         // Renomeado
};