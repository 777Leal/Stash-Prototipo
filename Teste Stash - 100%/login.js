const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).send('Usuário não encontrado');

    const cliente = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
    if (!senhaCorreta) return res.status(401).send('Senha incorreta');

    res.send('Login realizado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
