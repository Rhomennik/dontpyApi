const mongoose = require('mongoose');
const { Schema } = mongoose;
var date = require('date-and-time');
let now = new Date();
const tarjetaSchema = new Schema({
    codigo: { type: String, $ne: null },
    cliente: { type: String },
    fecha: { type: String, default: date.format(now, 'YYYY-MM-DD') },
    updatedAt: { type: String, default: date.format(now, 'YYYY-MM-DD HH:mm:ss') },
    perfil: { type: Number },
    contador: { type: Number }
});

module.exports = mongoose.model('Tarjeta', tarjetaSchema);