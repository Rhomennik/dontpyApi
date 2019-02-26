const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var date = require('date-and-time');
let now = new Date();
const maquinas2Schema = new Schema({
    iplocal: { type: String },
    ippublico: { type: String },
    uptime: { type: String },
    mac: { type: String, unique: true },
    img: { type: String, required: false, default: '' },
    updatedAt: { type: String, default: date.format(now, 'Hmm') }
    //   ultimo: {type: Date, default: Date.()}


});

//maquinas2Schema.pre("save", function preSave(next) {
//    const currentDate = new Date()
//    this.updatedAt = currentDate.now
//    next()
//  });

module.exports = mongoose.model('Maquinass', maquinas2Schema);