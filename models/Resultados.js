const mongoose = require('mongoose');
const ResultadosSchema = new mongoose.Schema({
    indicadores: {
      type: String,
      required: true
    },
    meta: {
        type: String,
        required: true
    },
    acao: {
        type: String,
        required: true
    },
    data_apuracao: {
        type: String,
        required: true
    },
    qtde_peso_consumo: {
        type: Number,
        required: true
    },
    empresas1: {
        type: String,
        required: true
    },
    empresas2: {
        type: String,
        required: true
    },
    obs: {
        type: String,
        required: true
    }
});


const Resultados = mongoose.model('Resultados', ResultadosSchema);

module.exports = Resultados;