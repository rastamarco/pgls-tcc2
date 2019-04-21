const mongoose = require('mongoose');
const ComissaoSchema = new mongoose.Schema({
    indicador: {
        type: String,
        required: true
    },
    nomeFuncionario: {
        type: String,
        required: true
    }
});

const Comissao = mongoose.model('Comissao', ComissaoSchema);

module.exports = Comissao;