const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  servicios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio'
  }],
  barbero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbero'
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno;