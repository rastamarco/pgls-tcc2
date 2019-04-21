const mongoose = require('mongoose');
const IndicadoresSchema = new mongoose.Schema({
    nome: {
      type: String,
      required: true
    }
});

const Indicadores = mongoose.model('Indicadores', IndicadoresSchema);

module.exports = Indicadores;