
  const User = require('../models/user');

  function checkNotAuthenticated(req, res, next) {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {

      return next()
    		} else {
    res.redirect('/')

		}
	});

}

module.exports = checkNotAuthenticated