const express = require('express');
const router = express.Router();

const entrada = require('../controllers/entrada.controller');

router.get('/', entrada.getEntradas);
router.post('/', entrada.createEntrada);
router.get('/:id', entrada.getEntrada);
router.put('/:id', entrada.editEntrada);
router.delete('/:id', entrada.deleteEntrada);

module.exports = router;