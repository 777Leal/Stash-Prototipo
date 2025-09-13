const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar produtos');
  }
});

module.exports = router;
