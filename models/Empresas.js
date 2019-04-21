const mongoose = require('mongoose');
const EmpresasSchema = new mongoose.Schema({
    razao_social: {
      type: String,
      required: true
    },
    nome_fantasia: {
        type: String,
        required: true
    },
    t_licensa_ambiental: {
        type: String,
        required: true
    },
    n_licensa_ambiental: {
        type: String,
        required: true
    },
    v_licensa_ambiental: {
        type: String,
        required: true
    },
    o_licensa_ambiental: {
        type: String,
        required: true
    },
    newpath: {
        type: String,
    }
});


const Empresas = mongoose.model('Empresas', EmpresasSchema);

module.exports = Empresas;