const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/User');
const Comissao = require('../models/Comissao');
const Metas = require('../models/Metas');
const Acao = require('../models/Acao');
const Acoes = require('../models/Acoes');
const Apuracoes = require('../models/Apuracoes');
const Empresas = require('../models/Empresas');
const Indicadores = require('../models/Indicadores');
const Resultados = require('../models/Resultados');
const mongoose = require('mongoose');
const upload = require('express-fileupload');
router.use(upload());


//////////////////////////////// GET'S //////////////////////////////////////////
router.get('/admin', (req, res) => res.render('admin'));
router.get('/resultados', (req, res) => res.render('resultados'));
router.get('/apuracoes', (req, res) => res.render('apuracoes'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/busca_inserir', (req, res) => res.render('busca_inserir', { results: false, results2: false, results3: false }));
router.get('/search', (req, res, next) => {
    var busca_empresa = req.query.busca_empresa;
    // var searchParams = "Cornélio Teste"
    console.log(busca_empresa);
    Empresas.find({ razao_social: busca_empresa }).then(empresa => {
        console.log(empresa);
        res.render('busca_inserir', { results: true, results2: false, results3: false, search: busca_empresa, empresa: empresa });
    })

});

router.get('/searchMeta', (req, res, next) => {
    var busca_meta = req.query.busca_meta;
    // var searchParams = "Cornélio Teste"
    console.log(busca_meta);
    Metas.find({ meta: busca_meta }).then(meta => {
        console.log(meta);
        res.render('busca_inserir', { results3: false, results2: true, results: false, search: busca_meta, meta: meta });
    })

});

router.get('/searchAcao', (req, res, next) => {
    var busca_acao = req.query.busca_acao;
    // var searchParams = "Cornélio Teste"
    console.log(busca_acao);
    Acoes.find({ acao: busca_acao }).then(acoes => {
        console.log(acoes);
        res.render('busca_inserir', { results3: true, results2: false, results: false, search: busca_acao, acoes: acoes });
    })

});

//////////////////////////////// FIM GET'S //////////////////////////////////////////

//////////////////////////////// POST'S //////////////////////////////////////////
/////////////////////////////// Painel Cadastros ///////////////////////////////////
// Register Funcionario POST
router.post('/admin1', (req, res) => {

    const { name, email, funct, password } = req.body;
    let errors = [];
    if (!name || !email || !funct || !password) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Senha deve ter no máximo 6 caracteres' });
    }
    if (errors.length > 0) {
        res.render('admin', {
            errors,
            name,
            email,
            funct,
            password
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email já existe!' });
                res.render('admin', {
                    errors,
                    name,
                    email,
                    funct,
                    password
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    funct,
                    password,
                });
                console.log(newUser);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'Funcionário Cadastrado');
                                res.redirect('/dashboard/admin');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Register Comissão POST
router.post('/admin2', (req, res) => {

    const { indicador, nomeFuncionario } = req.body;

    Comissao.findOne({ nomeFuncionario: nomeFuncionario, indicador: indicador }).then(comissao => {
        if (comissao) {
            req.flash('error_msg', 'Já possui o funcionario para esse indicador!');
            res.redirect('/dashboard/admin');
        } else {
            const newComissao = new Comissao({
                indicador,
                nomeFuncionario,
            });
            console.log(newComissao);
            newComissao.save().then(comissao => {
                req.flash('success_msg', 'Adiconado na Comissão');
                res.redirect('/dashboard/admin');
            })
                .catch(err => console.log(err));
        }
    });
});

// Register Empresas
router.post('/adminEmpresa', function (req, res, next) {
    const { razao_social, nome_fantasia, t_licensa_ambiental, n_licensa_ambiental,
        v_licensa_ambiental, o_licensa_ambiental } = req.body;
    let errors = [];
    if (!razao_social || !nome_fantasia || !t_licensa_ambiental || !n_licensa_ambiental || !v_licensa_ambiental || !o_licensa_ambiental) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Preencha corretamente');
        res.redirect("/dashboard/admin");
    } else {
        Empresas.findOne({ n_licensa_ambiental: n_licensa_ambiental }).then(empresas => {
            if (empresas) {
                req.flash('error_msg', 'Esse número de licensa já se encontra cadastrado!');
                res.redirect('/dashboard/admin');
            } else {
                const newEmpresas = new Empresas({
                    razao_social,
                    nome_fantasia,
                    t_licensa_ambiental,
                    n_licensa_ambiental,
                    v_licensa_ambiental,
                    o_licensa_ambiental,
                });
                console.log(newEmpresas);
                // res.redirect('/dashboard/admin');
                /* 
                var formidable = require('formidable');
                var fs = require('fs');
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    var oldpath = files.empresasfile.path;
                    var newpath = "C:/Users/souza/Documents/" + files.empresasfile.name;
                   
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        // req.flash('success_msg', 'Empresa Cadastrada com Sucesso!');
                        console.log(newpath);
                        res.redirect('/dashboard/admin');
                        // res.end()
                        
                        ;
                    });
                }); */
                newEmpresas.save().then(empresas => {
                    req.flash('success_msg', 'Empresa Cadastrada com Sucesso!');
                    res.redirect('/dashboard/admin');
                })
                    .catch(err => console.log(err));
            }
        });
    }
});

/////////////////////////////// Fim Painel Cadastros ///////////////////////////////////

/////////////////////////////// Painel Dados PGLS ///////////////////////////////////

// Register Indicadores POST
router.post('/admin0', (req, res) => {

    const { nome } = req.body;
    Indicadores.findOne({ nome: nome }).then(indicadores => {
        if (indicadores) {
            req.flash('error_msg', 'Já possui esse Indicador');
            res.redirect('/dashboard/admin');
        } else {
            const newIndicadores = new Indicadores({
                nome
            });
            // console.log(newIndicadores);
            newIndicadores.save().then(indicadores => {
                req.flash('success_msg', 'Indicador inserido com sucesso!');
                res.redirect('/dashboard/admin');
            })
                .catch(err => console.log(err));
        }
    });

});

// Register Metas POST
router.post('/admin3', (req, res) => {

    const { indicadores, meta, data_apuracao_final } = req.body;
    let errors = [];
    if (!indicadores || !meta || !data_apuracao_final) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Preencha corretamente');
        res.redirect("/dashboard/admin");
    } else {
        Metas.findOne({ meta: meta, data_apuracao_final }).then(metas => {
            if (metas) {
                req.flash('error_msg', 'Já possui essa Meta!');
                res.redirect('/dashboard/admin');
            } else {
                const newMetas = new Metas({
                    indicadores,
                    meta,
                    data_apuracao_final
                });
                console.log(newMetas);
                newMetas.save().then(metas => {
                    req.flash('success_msg', 'Meta Inserida com sucesso!');
                    res.redirect('/dashboard/admin');
                })
                    .catch(err => console.log(err));
            }
        });
    }
});

// Register Ações POST
router.post('/admin4', (req, res) => {

    const { metas, acao } = req.body;
    let errors = [];
    if (!metas || !acao) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Preencha corretamente');
        res.redirect("/dashboard/admin");
    } else {
        Acao.findOne({ metas: metas, acao: acao }).then(acoes => {
            if (acoes) {
                req.flash('error_msg', 'Já possui essa ação!');
                res.redirect('/dashboard/admin');
            } else {
                const newAcao = new Acao({
                    metas,
                    acao,
                });
                const newAcoes = new Acoes({
                    acao
                });
                //  console.log(newAcao);
                //console.log(newAcoes);
                newAcao.save().then(acao => {
                    newAcoes.save().then(acoes => {
                        req.flash('success_msg', 'Ação inserida com sucesso!');
                        res.redirect('/dashboard/admin');
                    })
                        .catch(err => console.log(err));
                })
                    .catch(err => console.log(err));

            }
        });
    }
});

/////////////////////////////// Fim Painel Dados PGLS ///////////////////////////////////

////////////////////////////// Lista e Detalhes /////////////////////////////////////////
// Inserir Funcionario na ação
router.post('/adminFuncionario', (req, res) => {
    const { nomeFuncionario, acoes } = req.body;
    const acao = acoes;

    // res.redirect('/dashboard/admin');
    // Busca o id da Ação
    Acao.findOne({ acao: acao }).then(acoes => {

        const aid = acoes._id;
        const metas = acoes.metas;
        const acao = acoes.acao;

        if (acoes) {
            // Tendo a ação, verifica se existe funcionario nela
            Acao.findOne({ acao: acao, nomeFuncionario: nomeFuncionario }).then(funcionario => {
                // Se tiver o funcionário selecionado
                // console.log(funcionario.nomeFuncionario);
                if (!funcionario) {

                    const newAcao = new Acao({
                        metas,
                        acao,
                        nomeFuncionario
                    });
                    console.log(newAcao);
                    // req.flash('error_msg', 'Esse Funcionário já se encontra nessa ação!');
                    // res.redirect('/dashboard/admin');

                    newAcao.save().then(acoes => {
                        req.flash('success_msg', 'Funcionário inserido com sucesso!');
                        res.redirect('/dashboard/admin');
                    })
                        .catch(err => console.log(err));
                } else if (funcionario.nomeFuncionario == null) {
                    // Se não tiver o usuário selecionado
                    Acao.update({ _id: aid }, { $set: { nomeFuncionario: nomeFuncionario } }, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result);
                            req.flash('success_msg', 'Funcionário Inserido nesta ação');
                            res.redirect('/dashboard/admin');
                        }
                    });
                } else if (funcionario.nomeFuncionario == nomeFuncionario) {
                    req.flash('error_msg', 'Funcionário já se encontra inserido nesta ação');
                    res.redirect('/dashboard/admin');

                }
            });
        } else {
            req.flash('error_msg', 'Ocorreu algun erro!');
            res.redirect('/dashboard/admin');
        }
    });
});

// Gerar Detalhes
router.get('/adminDetalhes', (req, res) => {
    const { acoes } = req.body;
    console.log(acoes);
    /*
   Acao.find({}).lean().exec(
      function (e, docs) {
         // res.render('/dashboard/admin', { "funcionarios": docs });
         console.log(docs);
         
   });*/

});

////////////////////////////// FIM Lista e Detalhes /////////////////////////////////////////


////////////////////////////// Apurações /////////////////////////////////////////
// Fazer Apuração
router.post('/apuracoes', (req, res) => {
    const { indicadores, meta, acao, data_apuracao, qtde_peso_consumo, nomeFuncionario } = req.body;
    let errors = [];
    if (!indicadores || !meta || !acao || !data_apuracao || !qtde_peso_consumo || !nomeFuncionario) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Preencha corretamente');
        res.redirect("/dashboard/apuracoes");
    } else {


        Apuracoes.findOne({ acao: acao, data_apuracao: data_apuracao, qtde_peso_consumo: qtde_peso_consumo, nomeFuncionario: nomeFuncionario })
            .then(apuracoes => {
                if (apuracoes) {
                    req.flash('error_msg', 'Esta apuração já foi feita hoje!');
                    res.redirect('/dashboard/apuracoes');
                } else {
                    const newApuracoes = new Apuracoes({
                        indicadores,
                        meta,
                        acao,
                        data_apuracao,
                        qtde_peso_consumo,
                        nomeFuncionario
                    });
                    // console.log(newApuracoes);
                    newApuracoes.save().then(apuracoes => {
                        req.flash('success_msg', 'Apuração feita com sucesso!');
                        res.redirect('/dashboard/apuracoes');
                    })
                        .catch(err => console.log(err));
                }
            });
    }
});

////////////////////////////// FIM Apurações /////////////////////////////////////////


////////////////////////////// Resultados /////////////////////////////////////////

// Gerar Resultados
router.post('/resultados', (req, res) => {
    const { indicadores, meta, acao, data_apuracao, qtde_peso_consumo, empresas1, empresas2, obs } = req.body;
    console.log(qtde_peso_consumo);
    let errors = [];
    if (!indicadores || !meta || !acao || !data_apuracao || !qtde_peso_consumo || !empresas1 || !empresas2) {
        errors.push({ msg: 'Por favor preencha todos os campos' });
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Preencha corretamente');
        res.redirect("/dashboard/resultados");
    } else {
        Resultados.findOne({ acao: acao, data_apuracao: data_apuracao })
            .then(apuracoes => {
                if (apuracoes) {
                    req.flash('error_msg', 'Este resultado já foi obtido, por favor insira outro!');
                    res.redirect('/dashboard/resultados');
                } else {
                    const newResultados = new Resultados({
                        indicadores,
                        meta,
                        acao,
                        data_apuracao,
                        qtde_peso_consumo,
                        empresas1,
                        empresas2,
                        obs
                    });
                    console.log(newResultados);
                    newResultados.save().then(resultados => {
                        req.flash('success_msg', 'Resultado salvo!');
                        // res.redirect('/dashboard/apuracoes');
                    })
                        .catch(err => console.log(err));
                    res.render('imprimir', { newResultados, newResultados });
                    req.flash('success_msg', 'Resultado salvo!');
                }

            });
    }
});


////////////////////////////// FIM Resultados /////////////////////////////////////////

////////////////////////////// Busca e inserir anexos /////////////////////////////////////////

router.post('/busca_inserir2', function (req, res, next) {
    console.log("Files", req.files.empresasfile);
    console.log("nome ", req.body.nome_empresa);
    // const empresasfile = req.files.empresasfile;
    const nomeEmpresa = req.body.nome_empresa;

    // res.redirect('/dashboard/busca_inserir');
    /*var formidable = require('formidable');
            var fs = require('fs');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var oldpath = files.empresasfile.;
                var newpath = "C:/Users/souza/Documents/" + files.empresasfile.name;
                console.log(newpath);
                res.redirect('/dashboard/busca_inserir');
                /*
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    // req.flash('success_msg', 'Empresa Cadastrada com Sucesso!');
                    console.log(newpath);
                    res.redirect('/dashboard/admin');
                    // res.end()
                    
                    ;
                });*/
    if (req.files) {
        var file = req.files.empresasfile,
            empresas_file = file.name;
        Empresas.findOne({ razao_social: nomeEmpresa }).then(empresa => {
            // Se tiver o funcionário selecionado
            //console.log(empresa);
            // console.log(empresa._id);
            const eid = empresa._id;
            const caminho = "C:/Users/souza/Documents/" + empresas_file;
            // res.redirect("/dashboard/busca_inserir");
            if (empresa.newpath != null) {
                req.flash('error_msg', 'Já possui um arquivo já está inserido para essa empresa!');
                res.redirect('/dashboard/busca_inserir');
            } else if (empresa.newpath == null) {
                Empresas.update({ _id: eid }, { $set: { newpath: caminho } }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        file.mv("C:/Users/souza/Documents/" + empresas_file, function (err) {
                            if (err) {
                                console.log(err);
                                res.redirect("/dashboard/busca_inserir");
                            } else {
                                req.flash('success_msg', 'Documento Anexado com sucesso');
                                res.redirect("/dashboard/busca_inserir");

                            }
                        });
                        //res.redirect('/dashboard/admin');
                    }
                });
            }
        });
    } else {
        req.flash('error_msg', 'Ocorreu algun erro! Verifique o tipo de arquivo enviado');
        es.redirect("/dashboard/busca_inserir");
    }

});


router.post('/busca_inserir3', function (req, res, next) {
    console.log("Files", req.files.metasfile);
    console.log("nome ", req.body.meta);
    //res.redirect("/dashboard/busca_inserir");
    const nomeMeta = req.body.meta;

    if (req.files) {
        var file = req.files.metasfile,
            metas_file = file.name;
        Metas.findOne({ meta: nomeMeta }).then(meta => {
            // Se tiver o funcionário selecionado
            //console.log(empresa);
            // console.log(empresa._id);
            const mid = meta._id;
            console.log(mid);

            const caminho = "C:/Users/souza/Documents/" + metas_file;
            // res.redirect("/dashboard/busca_inserir");
            if (meta.documento != null) {
                req.flash('error_msg', 'Já possui um arquivo já está inserido para essa Meta!');
                res.redirect('/dashboard/busca_inserir');
            } else if (meta.newpath == null) {
                Metas.update({ _id: mid }, { $set: { documento: caminho } }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        file.mv("C:/Users/souza/Documents/" + metas_file, function (err) {
                            if (err) {
                                console.log(err);
                                res.redirect("/dashboard/busca_inserir");
                            } else {
                                req.flash('success_msg', 'Documento Anexado com sucesso');
                                res.redirect("/dashboard/busca_inserir");

                            }
                        });
                        //res.redirect('/dashboard/admin');
                    }
                });
            }
        });
    } else {
        req.flash('error_msg', 'Ocorreu algun erro! Verifique o tipo de arquivo enviado');
        es.redirect("/dashboard/busca_inserir");
    }

});


router.post('/busca_inserir4', function (req, res, next) {
    console.log("Files", req.files.acoesfile);
    console.log("nome ", req.body.acao);
    //res.redirect("/dashboard/busca_inserir");
    const nomeAcao = req.body.acao;

    if (req.files) {
        var file = req.files.acoesfile,
            acoes_file = file.name;
        Acoes.findOne({ acao: nomeAcao }).then(acao => {
            // Se tiver o funcionário selecionado
            //console.log(empresa);
            // console.log(empresa._id);
            const mid = acao._id;
            console.log(mid);

            const caminho = "C:/Users/souza/Documents/" + acoes_file;
            // res.redirect("/dashboard/busca_inserir");
            if (acao.documento != null) {
                req.flash('error_msg', 'Já possui um arquivo já está inserido para essa Meta!');
                res.redirect('/dashboard/busca_inserir');
            } else if (acao.documento == null) {
                Acoes.update({ _id: mid }, { $set: { documento: caminho } }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        file.mv("C:/Users/souza/Documents/" + acoes_file, function (err) {
                            if (err) {
                                console.log(err);
                                res.redirect("/dashboard/busca_inserir");
                            } else {
                                req.flash('success_msg', 'Documento Anexado com sucesso');
                                res.redirect("/dashboard/busca_inserir");

                            }
                        });
                        //res.redirect('/dashboard/admin');
                    }
                });
            }
        });
    } else {
        req.flash('error_msg', 'Ocorreu algun erro! Verifique o tipo de arquivo enviado');
        es.redirect("/dashboard/busca_inserir");
    }

});


module.exports = router;