var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Clientes = require('../models/clientes');

// ==========================================
// Obtener todos los clientes
// ==========================================
app.get('/:desde/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Clientes.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, clientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando cliente',
                        errors: err
                    });
                }

                Clientes.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        clientes: clientes,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener 1 solo clientes
// ==========================================

app.get('/id/:id', (req, res) => {
    var id = req.params.id;

    Clientes.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, cliente) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar cliente',
                    errors: err
                });
            }

            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    errors: { message: 'No existe un Clientes con ese ID' }
                });
            }

            res.status(200).json({
                ok: false,
                cliente: clientes
            });

        });
});

// ==========================================
// Actualizar Clientes
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Clientes.findById(id, (err, cliente) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }


        cliente.nombre = body.nombre;
        cliente.edad = body.edad;
        cliente.telefono = body.telefono;
        cliente.fechacadastro = body.fechacadastro;
        cliente.genero = body.genero;
        cliente.ci = body.ci;
        cliente.barrio = body.barrio;
        cliente.direccion = body.direccion;
        cliente.embarazada = body.embarazada;
        cliente.semanaemabaraza = body.semanaemabaraza;
        cliente.responsables = body.responsables;
        cliente.img = body.img;
        cliente.peso = body.peso;
        cliente.altura = body.altura;
        cliente.fuma = body.fuma;
        cliente.alergico = body.alergico;
        cliente.enfermedades = body.enfermedades;


        cliente.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: medicoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo cliente
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cliente = new Clientes({
        nombre: body.nombre,
        telefono: body.telefono,
        edad: body.edad,
        genero: body.genero,
        ci: body.ci,
        barrio: body.barrio,
        direccion: body.direccion,
        embarazada: body.embarazada,
        semanaemabaraza: body.semanaemabaraza,
        responsables: body.responsables,
        img: body.img,
        peso: body.peso,
        altura: body.altura,
        denticion: body.denticion,
        fuma: body.fuma,
        alergico: body.alergico,
        enfermedades: body.enfermedades
    });

    cliente.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: medicoGuardado
        });


    });

});


// ============================================
//   Borrar un cliente por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Clientes.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar cliente',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese id',
                errors: { message: 'No existe un cliente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente: medicoBorrado
        });

    });

});


module.exports = app;