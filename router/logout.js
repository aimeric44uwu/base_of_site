const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkAuthenticated = require("../auth/CheckAuth")

router.get('/',checkAuthenticated, (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {

				return res.redirect('/');
			}
		});
	}
});

module.exports = router;