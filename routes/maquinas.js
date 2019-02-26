 var express = require('express');

 var mdAutenticacion = require('../middlewares/autenticacion');

 var app = express();

 var Maquinas = require('../models/maquinas');
 // Date atual
 var date = require('date-and-time');

 // ==========================================
 // Obtener todos los maquinas
 // ===========================id===============
 app.get('/', (req, res, next) => {

     var desde = req.query.desde || 0;
     desde = Number(desde);

     Maquinas.find({}, '')
         .skip(desde)
         .limit(5)
         .populate('sucursals')
         .exec(
             (err, maquinas) => {

                 if (err) {
                     return res.status(500).json({
                         ok: false,
                         mensaje: 'Error cargando maquinas',
                         errors: err
                     });
                 }

                 Maquinas.countDocuments({}, (err, conteo) => {

                     res.status(200).json({
                         ok: true,
                         maquinas: maquinas,
                         total: conteo
                     });

                 })





             });
 });


 // ==========================================
 // Obtener las maquinas por MAC
 // ==========================================
 app.get('/:mac', (req, res, next) => {

     var macb = req.params.mac;
     var desde = req.query.desde || 0;
     desde = Number(desde);

     Maquinas.find({ mac: macb }, 'iplocal ippublico uptime mac updatedAt')
         .skip(desde)
         .limit(5)
         .populate('Sucursals')
         .exec(
             (err, maquinas) => {

                 if (err) {
                     return res.status(500).json({
                         ok: false,
                         mensaje: 'Error cargando maquinas',
                         errors: err
                     });
                 }

                 Maquinas.count({}, (err, conteo) => {

                     res.status(200).json({
                         ok: true,
                         maquinas: maquinas,
                         total: conteo
                     });

                 })




             });
 });


 // ==========================================
 // Actualizar maquinas
 // ==========================================
 app.put('/:id', (req, res) => {
     var id = req.params.id;
     var body = req.body;
     // Date atual
     let now = new Date();


     Maquinas.findById(id, (err, maquinas) => {


         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al buscar maquinas',
                 errors: err
             });
         }

         if (!maquinas) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'El maquinas con el id ' + id + ' no existe',
                 errors: { message: 'No existe un maquinas con ese ID' }
             });
         }


         maquinas.uptime = body.uptime;
         maquinas.iplocal = body.iplocal;
         maquinas.ippublico = body.ippublico;
         maquinas.mac = body.mac;
         maquinas.anydesk = body.anydesk;
         maquinas.updatedAt = date.format(now, 'YYYY-MM-DD HH:mm:ss');

         maquinas.save((err, maquinasGuardado) => {

             if (err) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al actualizar maquinas',
                     errors: err
                 });
             }


             res.status(200).json({
                 ok: true,
                 maquinas: maquinasGuardado
             });

         });

     });

 });


 // ==========================================
 // Crear un nuevo maquinas
 // ==========================================
 app.post('/', (req, res) => {

     var body = req.body;

     var maquinas = new Maquinas({
         iplocal: body.iplocal,
         ippublico: body.ippublico,
         uptime: body.uptime,
         mac: body.mac,
         img: 1,
         updatedAt: body.updatedAt,
         sucursals: body.sucursals,
         anydesk: body.anydesk
             //   img: body.img,
             //   role: body.role
     });

     maquinas.save((err, maquinasGuardado) => {

         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'Error al crear maquinas',
                 errors: err
             });
         }

         res.status(201).json({
             ok: true,
             maquinas: maquinasGuardado,
             maquinastoken: req.maquinas
         });


     });

 });


 // ============================================
 //   Borrar un maquinas por el id
 // ============================================
 app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

     var id = req.params.id;

     Maquinas.findByIdAndRemove(id, (err, maquinasBorrado) => {

         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error borrar maquinas',
                 errors: err
             });
         }

         if (!maquinasBorrado) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'No existe un maquinas con ese id',
                 errors: { message: 'No existe un maquinas con ese id' }
             });
         }

         res.status(200).json({
             ok: true,
             maquinas: maquinasBorrado
         });

     });

 });

 module.exports = app;