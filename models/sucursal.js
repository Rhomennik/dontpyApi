var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sucursalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    long: { type: String },
    lat: { type: String },
    telefono: { type: Number },
    ippublico: { type: String },
    vpn: { type: String }
});

module.exports = mongoose.model('Sucursal', sucursalSchema);