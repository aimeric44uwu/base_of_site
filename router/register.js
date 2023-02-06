const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkUnAuthenticated = require("../auth/CheckUnAuth")
const { v4: uuidv4,} = require('uuid');

router.get('/',checkUnAuthenticated, (req, res, next) => {
	return res.render('register.ejs');
});

router.post('/', checkUnAuthenticated, (req, res, next) => {
	let personInfo = req.body;
	var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

	if (!personInfo.email || !personInfo.firstname || !personInfo.lastname || !personInfo.phonenumber || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {
			if (personInfo.firstName == undefined || personInfo.firstName == "undefined" || personInfo.firstName == true || personInfo.firstName == "true" || personInfo.firstName == false || personInfo.firstName == "false")
				User.findOne({ email: personInfo.email }, (err, data) => {
					if (!data) {
						let c;
						User.findOne({}, (err, data) => {
							c = uuidv4();
							let newPerson = new User({
								unique_id: c,
								phonenumber: personInfo.phonenumber,
								email: personInfo.email,
								firstName: personInfo.firstname,
								lastName: personInfo.lastname,
								password: personInfo.password,
								creationIp: ip,
								LastModificationIp: ip,
							});
							newPerson.save((err, Person) => {
								if (err) {
									console.log(err);
									res.send({ "status": "error", "message": "informations manquantes ou incorrect" });
								}
							});
						}).sort({ _id: -1 }).limit(1);
						res.send({ "status": "Success", "message": "Vous êtes enregistré vous pouvez mainenant vous connecter." });
					} else {
						res.send({ "status": "error", "message": "Cet adresse mail est déjà utilisé pour un autre compte." });
					}
				});
		} else {
			res.send({ "status": "error", "message": "Les mots de passe ne correspondent pas." });
		}
	}
});

module.exports = router;
