const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, imagem_url, categoria, estoque } = req.body;
  try {
    await pool.query(
      'INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria, estoque) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, preco, imagem_url, categoria, estoque]
    );
    res.send('Produto cadastrado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar produto');
  }
});

module.exports = router;
