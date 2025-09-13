const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  try {
    // Verificar se o email já está cadastrado
    const [usuariosExistentes] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    if (usuariosExistentes.length > 0) {
      return res.status(400).send('Email já cadastrado.');
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Inserir o novo cliente no banco
    await pool.query(
      'INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaCriptografada]
    );

    res.send('Cliente cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar cliente.');
  }
});

module.exports = router;
