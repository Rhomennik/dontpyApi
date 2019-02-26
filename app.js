// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.set('useFindAndModify', false);

// Inicializar variables
var app = express();

// CORS ( HABILITAR PETICIONES DE TODOS LOS LUGARES ? CONFIG)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});



// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var maquinasRoutes = require('./routes/maquinas');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var maquinas2Routes = require('./routes/maquinas2');
var sucursalRoutes = require('./routes/sucursal');
var entradaRoutes = require('./routes/entrada');
var tarjetaRoutes = require('./routes/tarjetas');

var loginRoutes = require('./routes/login');




// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:11/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutasa
app.use('/usuario', usuarioRoutes);
app.use('/tarjeta', tarjetaRoutes);
app.use('/entrada', entradaRoutes);
app.use('/login', loginRoutes);
app.use('/maquinas', maquinasRoutes);
app.use('/sucursal', sucursalRoutes);
app.use('/maquinas2', maquinas2Routes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});