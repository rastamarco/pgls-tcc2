const mongoose = require('mongoose');
const AcoesSchema = new mongoose.Schema({
    acao:{
        type: String,
        required:true
    },
    documento: {
        type: String
    }
});

const Acoes = mongoose.model('Acoes', AcoesSchema);

module.exports = Acoes;