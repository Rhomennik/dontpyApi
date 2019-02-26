var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;



var app = express();
var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


var mdAutenticacion = require('../middlewares/autenticacion');


//================================
// Esta es la autenticacion Google
//================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'TOken no coincide'

            });

        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        // Si el usuario existe
        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticacion normal'
                });

            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, {}); // 4 horas SEED,{ expiresIn: 14400}

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });

            }

        } else {
            // Si el usuario no existe entonce lo creamos
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((_err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, {}); // 4 horas var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });


            });
        }


    });




    //    return res.status(200).json({
    //       ok: true,
    //      mensaje: 'OK!!!!!',
    //      googleUser: googleUser
    //    });

});


//================================
// Esta es la autenticacion normal
//================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, {}); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    })


});

function obtenerMenu(ROLE) {

    var menu = [{
            // aqui podemos modificar iconos e tmb titulos do sidebar
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                // aqui iremos adicionar as futuras RUTAS?
                // { titulo: 'Dashboard', url: '/dashboard' },
                // { titulo: 'Maquinas', url: '/maquinas' }
                //  { titulo: 'ProgressBar', url: '/progress' },
                //  { titulo: 'Graficas', url: '/graficas1' },
                //  { titulo: 'Promesas', url: '/promesas' },
                //  { titulo: 'Rxjs', url: '/rxjs' },
            ]
        },
        {
            titulo: 'Puerta',
            icono: 'mdi mdi-glassdoor',
            submenu: [
                // aqui iremos adicionar as futuras RUTAS?
                // { titulo: 'Tarjetas', url: '/tarjetas' },
                // { titulo: 'Entradas', url: '/entrada' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // Role kk    { titulo: 'Usuarios', url: '/usuarios' },
                // { titulo: 'Hospitales', url: '/hospitales' },
                // { titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Dashboard', url: '/dashboard' }, { titulo: 'Maquinas', url: '/maquinas' }),
            menu[1].submenu.unshift({ titulo: 'Tarjetas', url: '/tarjetas' }, { titulo: 'Entradas', url: '/entrada' })
        menu[2].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }, { titulo: 'Sucursal', url: '/sucursal' })
    }
    if (ROLE === 'USER_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Dashboard', url: '/dashboard' })
    }



    return menu;

}




module.exports = app;