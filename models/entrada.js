const mongoose = require('mongoose');
const { Schema } = mongoose;

const entradaSchema = new Schema({
    codigo: { type: String, $ne: null },
    nome: { type: String },
    fecha: { type: String }
});

module.exports = mongoose.model('Entrada', entradaSchema);