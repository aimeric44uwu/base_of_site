const User = require('../models/user');

function checkAuthenticated(req, res, next) {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
      res.redirect('/login')
    		} else {
      return next()
		}
	});

}

module.exports = checkAuthenticated