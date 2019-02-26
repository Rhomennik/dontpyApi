const Entrada = require('../models/entrada');

const entradaCtrl = {};
var date = require('date-and-time');
let now = new Date();

entradaCtrl.getEntradas = async(req, res, next) => {
    const entradas = await Entrada.find();
    res.json(entradas);
};

entradaCtrl.createEntrada = async(req, res, next) => {
    const entrada = new Entrada({
        codigo: req.body.codigo,
        nome: req.body.nome,
        fecha: date.format(now, 'DD-MM-YYYY')
    });
    await entrada.save();
    res.json({
        status: 'entrada creada rr',
        creado: entrada
    });
};

entradaCtrl.getEntrada = async(req, res, next) => {
    const { id } = req.params;
    const entrada = await Entrada.findById(id);
    res.json(entrada);
};

entradaCtrl.editEntrada = async(req, res, next) => {
    const { id } = req.params;
    const entrada = {
        codigo: req.body.codigo,
        nome: req.body.nome,
        fecha: date.format(now, 'DD-MM-YYYY')
    };
    await Entrada.findByIdAndUpdate(id, { $set: entrada }, { new: true });
    res.json({
        status: 'Entrada Atualizada!!',
        DadosATT: entrada
    });
};

entradaCtrl.deleteEntrada = async(req, res, next) => {
    await Entrada.findByIdAndRemove(req.params.id);
    res.json({ status: 'entrada Eliminada' });
};

module.exports = entradaCtrl;