const mongoose = require('mongoose');

const BarberoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  dias_trabajo: {
    type: [String],
    required: true
  },
  horario_trabajo: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Barbero', BarberoSchema);
