const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    await pool.query(
      'INSERT INTO contato (nome, email, mensagem) VALUES (?, ?, ?)',
      [nome, email, mensagem]
    );
    res.send('Mensagem enviada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar mensagem');
  }
});

module.exports = router;
