const mongoose = require('mongoose');
const MetasSchema = new mongoose.Schema({
    indicadores: {
        type: String,
        required: true
    },
    meta: {
        type: String,
        required: true
    },
    data_apuracao_final:{
        type: String,
        required:true
    },
    documento: {
        type: String
    }
});

const Meta = mongoose.model('Meta', MetasSchema);

module.exports = Meta;