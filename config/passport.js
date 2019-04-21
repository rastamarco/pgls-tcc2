const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Carregando o model de user
const User = require('../models/User');

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
        
        // Match user
		User.findOne( {email:email } )
			.then(user => {
                if(!user){
                    return done(null, false, { message: 'Email não registrado!' });
                }

		    //Match password
		        bcrypt.compare(password, user.password, (err, isMatch) => {
			        if(err) throw err;
			
			        if(isMatch) {
				        return done(null, user);
			        } else {
				        return done(null, false, { message: 'Senha incorreta' });
			        }
			    });
		    })
		    .catch(err => console.log(err));
        })
    );

    // Serializando e desserializando o usuário
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}