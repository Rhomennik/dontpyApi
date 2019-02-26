var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Tarjeta = require('../models/tarjeta');
// Date atual
var date = require('date-and-time');

// ==========================================
// Obtener todos los tarjeta
// ===========================id===============
app.get('/:desde/', [mdAutenticacion.verificaToken], (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Tarjeta.find({}, '')
        .skip(desde)
        .limit(5)
        .exec(
            (err, tarjeta) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tarjeta',
                        errors: err
                    });
                }

                Tarjeta.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        tarjeta: tarjeta,
                        total: conteo
                    });

                })





            });
});



// ==========================================
// Actualizar tarjeta
// ==========================================
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    // Date atual
    let now = new Date();


    Tarjeta.findById(id, (err, tarjeta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tarjeta',
                errors: err
            });
        }

        if (!tarjeta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tarjeta con el id ' + id + ' no existe',
                errors: { message: 'No existe un tarjeta con ese ID' }
            });
        }


        tarjeta.cliente = body.cliente;
        tarjeta.updatedAt = date.format(now, 'YYYY-MM-DD HH:mm:ss')
        tarjeta.perfil = body.perfil;
        tarjeta.contador = body.contador;

        tarjeta.save((err, tarjetaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tarjeta',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                tarjeta: tarjetaGuardado
            });

        });

    });

});


// ==========================================
// Crear un nuevo tarjeta
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var tarjeta = new Tarjeta({
        codigo: body.codigo,
        cliente: body.cliente,
        fecha: body.fecha,
        perfil: body.perfil,
        contador: body.contador
    });

    tarjeta.save((err, tarjetaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tarjeta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            tarjeta: tarjetaGuardado,
            tarjetatoken: req.tarjeta
        });


    });

});


// ============================================
//   Borrar un tarjeta por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Tarjeta.findByIdAndRemove(id, (err, tarjetaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar tarjeta',
                errors: err
            });
        }

        if (!tarjetaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tarjeta con ese id',
                errors: { message: 'No existe un tarjeta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tarjeta: tarjetaBorrado
        });

    });

});

module.exports = app;