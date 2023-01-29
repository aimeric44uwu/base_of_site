const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkAuthenticated = require("../auth/CheckAuth")

router.get('/',checkAuthenticated, (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.firstName, "email": data.email });
		}
	});
});


module.exports = router;