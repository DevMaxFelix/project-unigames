const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));

const db = new sqlite3.Database('banco_usuarios.db', (error) => {
    if (error) {
      console.error(error.message);
    } else {
      console.log('Conectado ao banco de dados.');
    }
  });

  const session = require('express-session');
  app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
  

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/home', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/details', function(req, res){
  res.sendFile(__dirname + '/assets/pages/details/details.html');
});

app.get('/login_page', function(req, res){
    res.sendFile(__dirname + '/assets/pages/login/login.html');
});

app.get('/register_page', function(req, res){
  res.sendFile(__dirname + '/assets/pages/login/register.html');
});

app.get('/store_page', function(req, res){
  res.sendFile(__dirname + '/assets/pages/store/store.html');
});

app.get('/faq_page', function(req, res){
  res.sendFile(__dirname + '/assets/pages/faq/faq.html');
});

app.get('/profile_page', function(req, res){
  res.sendFile(__dirname + '/assets/pages/profile/profile.html');
});

app.post('/login', (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  const query = `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`;

  db.get(query, [usuario, senha], (error, row) => {
    if (error) {
      console.error(error.message);
      res.status(500).send('Erro no servidor');
    } else if (row) {
      req.session.usuario = row.usuario;
      req.session.nomeUsuario = row.nome;
      console.log('Usuário logado:', row.nome);

      res.cookie('nomeUsuario', row.nome, { maxAge: 900000, httpOnly: false });

      res.redirect('/?nome=' + row.nome);
    } else {
      console.log('Login inválido');
      res.redirect('/login_page?error=Usuário ou senha incorretos');
    }
  });
});

app.post('/register', (req, res) => {
  const { nickname, nome, senha, confirmarSenha } = req.body;
  
  if (!nickname || !nome || !senha || !confirmarSenha) {
    res.send('<script>alert("Por favor, preencha todos os campos do formulário."); window.location.href = "/register_page";</script>');
    return;
  }
  
  if (senha !== confirmarSenha) {
    res.send('<script>alert("As senhas não coincidem."); window.location.href = "/register_page";</script>');
    return;
  }
  
  const query = `INSERT INTO usuarios (usuario, nome, senha, permissoes) VALUES (?, ?, ?, 'usuario')`;
  db.run(query, [nickname, nome, senha], (error) => {
    if (error) {
      console.error(error.message);
      res.send('<script>alert("Erro no servidor."); window.location.href = "/register_page";</script>');
      return;
    }
    
    res.redirect('/login_page');
  });
});


app.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erro no servidor');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send('Logout bem sucedido');
    }
  });
});


app.listen(3000, '0.0.0.0', function() {
  console.log('Servidor rodando na porta 3000');
});
