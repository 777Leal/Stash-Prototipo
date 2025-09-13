const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).send('Email não encontrado');

    res.send('Email encontrado. Um link de recuperação será enviado (implementar envio depois)');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar email');
  }
});

module.exports = router;
