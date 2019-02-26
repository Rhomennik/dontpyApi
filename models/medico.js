var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    img: { type: String, default: "1" },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id hospital esun campo obligatorio ']
    }
});


module.exports = mongoose.model('Medico', medicoSchema);