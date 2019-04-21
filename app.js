const express = require('express');
const app = express();
const expressLayouts = require ('express-ejs-layouts');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;
// CONEXÃO COM MONGO
mongoose.connect(db, {useNewUrlParser: true })
	.then(() => console.log('Conectado com MondoDB'))
	.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//BodyParser
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Variáveis Globais de mensagens
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
	next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));

// Mensagem quando não achar uma página
app.use(function(req, res, next) {
	var err = new Error('Página não Encontrada!');
	err.status = 404;
	next(err);
});

app.listen(PORT, console.log(`Servidor rodando na porta ${PORT}`));