const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  }
});

const Servicio = mongoose.model('Servicio', servicioSchema);

module.exports = Servicio;
