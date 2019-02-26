const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;
var date = require('date-and-time');
let now = new Date();
const maquinas2Schema = new Schema({
    iplocal: { type: String, required: true },
    ippublico: { type: String, required: true },
    uptime: { type: String },
    mac: { type: String, unique: true, required: true },
    img: { type: String, required: false },
    anydesk: { type: String },
    sucursals: {
        type: Schema.Types.String,
        ref: 'Sucursal',
        required: [false, 'El id hospital esun campo obligatorio ']
    },
    updatedAt: { type: String, default: date.format(now, 'YYYY-MM-DD HH:mm:ss') }
    //   ultimo: {type: Date, default: Date.()}


});

//maquinas2Schema.pre("save", function preSave(next) {
//    const currentDate = new Date()
//    this.updatedAt = currentDate.now
//    next()
//  });

module.exports = mongoose.model('Maquinas', maquinas2Schema);