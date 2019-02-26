const express = require('express');
const router = express.Router();

const maquinas = require('../controllers/maquinas2.controller');


router.get('/', maquinas.getMaquinas);
router.post('/', maquinas.createMaquinas);
router.get('/:mac', maquinas.gettMaquinas);
router.put('/:id', maquinas.editMaquinas);
module.exports = router;