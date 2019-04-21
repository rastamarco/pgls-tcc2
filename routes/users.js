const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

//Login  GET
router.get('/login', (req, res) => res.render('login'));

//Register GET
router.get('/register', (req, res) => res.render('register'));

// Register POST
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Por favor preencha todos os campos' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Senhas não conferem' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Senha deve ter no máximo 6 caracteres' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email já existe!' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          console.log(newUser);
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash('success_msg','Você está cadastrado, faça o Login!');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

// Login POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard', 
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout 
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'Voce está desconectado!');
	res.redirect('/users/login');
});


module.exports = router;