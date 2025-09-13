require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Conexão com o banco
const pool = require('./db');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const loginRoutes = require('./routes/login');
const adminRoutes = require('./routes/admin');
const produtosRoutes = require('./routes/produtos');
const contatoRoutes = require('./routes/contato');
const recuperarsenhaRoutes = require('./routes/recuperarsenha');
const clientesRoutes = require('./routes/clientes');


app.use('/login', loginRoutes);
app.use('/admin', adminRoutes);
app.use('/produtos', produtosRoutes);
app.use('/contato', contatoRoutes);
app.use('/recuperarsenha', recuperarsenhaRoutes);
app.use('/clientes',clientesRoutes);


// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
