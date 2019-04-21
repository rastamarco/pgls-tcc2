const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Indicadores = require('../models/Indicadores');
const Metas = require('../models/Metas');
const Comissao = require('../models/Comissao');
const Acao = require('../models/Acao');
const Acoes = require('../models/Acoes');
const Empresas = require('../models/Empresas');
const Apuracoes = require('../models/Apuracoes');
const Resultados = require('../models/Resultados');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Resultados.find(function (err, resultados) {
        if (err) {
            return console.error(err);
        } else {
            // console.log(indicadores);
            res.render('dashboard', { resultados: resultados, name: req.user.name });
        }
    })

});

router.get('/dashboard/admin', ensureAuthenticated, (req, res) => {
    const i_atual = "";
    const name = req.user.name;
    const i = {};
    if (name != "Marco Souza") {
        req.flash('error_msg', 'Somente o administrador do sistema tem acesso!');
        res.redirect('/dashboard');
    } else {

        User.find(function (err, users) {
            if (err) {
                return console.error(err);
            } else {
                // console.log(users);
                Indicadores.find(function (err, indicadores) {
                    if (err) {
                        return console.error(err);
                    } else {
                        // console.log(indicadores);
                        // res.render('admin', {usuarios:users, indicador:indicadores});
                        Metas.find(function (err, metas) {
                            if (err) {
                                return console.error(err);
                            } else {
                                // console.log(indicadores);
                                Acao.find(function (err, acao) {
                                    if (err) {
                                        return console.error(err);
                                    } else {
                                        // console.log(indicadores);
                                        // res.render('admin', {usuarios:users, indicador:indicadores, metas:metas, acao:acao });
                                        Acoes.find(function (err, acoes) {
                                            if (err) {
                                                return console.error(err);
                                            } else {
                                                // console.log(indicadores);
                                                res.render('admin', { usuarios: users, indicador: indicadores, metas: metas, acao: acao, acoes: acoes, i: i });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    }
});

router.get('/dashboard/apuracoes', ensureAuthenticated, (req, res) => {

    const name = req.user.name;
    Indicadores.find(function (err, indicadores) {
        if (err) {
            return console.error(err);
        } else {
            Metas.find(function (err, metas) {
                if (err) {
                    return console.error(err);
                } else {
                    Acao.find(function (err, acao) {
                        if (err) {
                            return console.error(err);
                        } else {
                            res.render('apuracoes', { indicador: indicadores, metas: metas, acao: acao, name: name });
                        }
                    })
                }
            })
        }
    })

});

router.get('/dashboard/resultados', ensureAuthenticated, (req, res) => {

    const name = req.user.name;
    if (name != "Marco Souza") {
        req.flash('error_msg', 'Somente o administrador do sistema pode gerar os resultados!');
        res.redirect('/dashboard');
    } else {


        Indicadores.find(function (err, indicadores) {
            if (err) {
                return console.error(err);
            } else {
                Metas.find(function (err, metas) {
                    if (err) {
                        return console.error(err);
                    } else {
                        Acao.find(function (err, acao) {
                            if (err) {
                                return console.error(err);
                            } else {
                                // res.render('resultados', { indicador: indicadores, metas: metas, acoes: acoes , name:name});
                                Empresas.find(function (err, empresas) {
                                    if (err) {
                                        return console.error(err);
                                    } else {
                                        //res.render('resultados', { indicador: indicadores, metas: metas, acao: acao , name:name, empresas:empresas});
                                        Apuracoes.find(function (err, apuracoes) {
                                            if (err) {
                                                return console.error(err);
                                            } else {
                                                res.render('resultados', { indicador: indicadores, metas: metas, acao: acao, name: name, empresas: empresas, apuracao: apuracoes });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
});

router.get('/dashboard/imprimir', ensureAuthenticated, (req, res) => res.render('imprimir'));

router.get('/dashboard/busca_inserir', ensureAuthenticated, (req, res) => {
    const name = req.user.name;
    if (name != "Marco Souza") {
        req.flash('error_msg', 'Somente o administrador do sistema tem acesso!');
        res.redirect('/dashboard');
    } else {
        res.render('busca_inserir', { results: false, results2: false, results3: false });
    }
});

module.exports = router;