const mongoose = require('mongoose');
const AcaoSchema = new mongoose.Schema({
    metas:{
        type: String,
        required: true
    },
    acao:{
        type: String,
        required:true
    },
    nomeFuncionario:{
        type: String,
    }
});

const Acao = mongoose.model('Acao', AcaoSchema);

module.exports = Acao;