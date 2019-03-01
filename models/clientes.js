var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// fechacadastro
var date = require('date-and-time');
let now = new Date();

var usuarioSchema = new Schema({
    // Principais
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    edad: { type: String, required: [true, 'La edad es necesario'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    fechacadastro: { type: String, default: date.format(now, 'YYYY-MM-DD HH:mm:ss') },
    genero: { type: String, required: [true, 'El genero es necesario'] },
    // Nao necesarios
    ci: { type: Number, required: false, unique: [true, 'Este usuario ya existe'] },
    barrio: { type: String, required: false },
    direccion: { type: String, required: false },
    embarazada: { type: String, required: false },
    semanaemabaraza: { type: String, required: false },
    responsables: { type: String, required: false },
    img: { type: String, default: '1' },
    peso: { type: String, required: false },
    altura: { type: String, required: false },
    denticion: { type: String, required: false },
    fuma: { type: String, required: false },
    alergico: { type: String, required: false },
    enfermedades: { type: String, required: false }

});

module.exports = mongoose.model('Clientes', usuarioSchema);