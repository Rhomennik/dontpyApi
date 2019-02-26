const Maquinas = require('../models/maquinas2');

const maquinasCtrl = {};
// get normal
maquinasCtrl.getMaquinas = async(req, res, next) => {
    const maquinas = await Maquinas.find();
    res.json(maquinas);
};
// Crear maquina
maquinasCtrl.createMaquinas = async(req, res, next) => {

    const maquinas = new Maquinas({
        iplocal: req.body.iplocal,
        ippublico: req.body.ippublico,
        uptime: req.body.uptime,
        mac: req.body.mac,
        img: 1
    })
    await maquinas.save();
    res.json({ status: 'Maquia Creada' });
}

// Get pelo mac
maquinasCtrl.gettMaquinas = async(req, res, next) => {
    var mac2 = req.params.mac;
    const maquinas = await Maquinas.find({ mac: mac2 }, 'iplocal ippublico uptime mac updatedAt');
    res.json(maquinas);
};

// atualizar Maquina
maquinasCtrl.editMaquinas = async(req, res, next) => {
    const { id } = req.params;
    const date = new Date.now();
    const maquinas = {
        iplocal: req.body.iplocal,
        ippublico: req.body.ippublico,
        uptime: req.body.uptime,
        mac: req.body.mac,
        img: req.body.img,
        updatedAt: date
    };
    // db.collection.update({ "$currentDate": { "updatedAt": { "$type": date }}})
    await Maquinas.findByIdAndUpdate(id, { $set: maquinas }, { new: true });
    res.json({ status: 'Employee Updated' });
};
module.exports = maquinasCtrl;