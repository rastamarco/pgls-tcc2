const mongoose = require('mongoose');
const ApuracoesSchema = new mongoose.Schema({
    indicadores: {
        type: String,
        required: true
    },
    meta: {
        type: String,
        required: true
    },
    acao:{
        type: String,
        required:true
    },
    data_apuracao:{
        type: String,
        required: true
    },
    qtde_peso_consumo:{
        type:Number,
        required:true
    },
    nomeFuncionario:{
        type: String,
        required:true
    }
});

const Apuracoes = mongoose.model('Apuracoes', ApuracoesSchema);

module.exports = Apuracoes;