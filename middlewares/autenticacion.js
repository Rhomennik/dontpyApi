var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ==========================================
//  Verificar token
// ==========================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                mensaje: 'Send you info to DB blacklist -----tk incorrect------'
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

}

// ==========================================
//  Verificar admin
// ==========================================
exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - Prohibido no eres autorizado',
            errors: { message: 'No es adm, no puedes hacer esto' }
        });
    }

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

}

// ==========================================
//  Verificar admin o Tambien si el propio perfil se puede modificar
// ==========================================
exports.verificaADMIN_ROLE_o_mismousuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - Prohibido no eres autorizado Ni el mismo usuario',
            errors: { message: 'No es adm, no puedes hacer esto' }
        });
    }

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

}