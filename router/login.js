const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkUnAuthenticated = require("../auth/CheckUnAuth")

router.get('/',checkUnAuthenticated, (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/',checkUnAuthenticated, (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.comparePassword(req.body.password)) {
				req.session.userId = data.unique_id;
				res.send({ "status": "Success" ,"message": "Vous êtes connectés" });
			} else {
				res.send({ "status": "error" ,"message": "Mot de passe incorrect" });
			}
		} else {
			res.send({ "status": "error" ,"message": "Cet adresse mail ne correspond à aucun compte" });
		}
	});
});

module.exports = router;
