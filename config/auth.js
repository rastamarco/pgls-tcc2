module.exports = {
	ensureAuthenticated: function(req, res, next) {
	if(req.isAuthenticated()){

		return next();
	}
	req.flash('error_msg', 'Por favor faça um login para ver esse recurso!');
	res.redirect('/users/login');
	}
}