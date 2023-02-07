const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkUnAuthenticated = require("../auth/CheckUnAuth")

if(process.env.ENABLE_EXTERNAL_API == "true") {
	router.get('/',checkUnAuthenticated, (req, res, next) => {
		return res.render('login.ejs', {
			"baseurl": process.env.API_URL.slice(0, -1) + ":" + process.env.API_PORT
		});
	});
}else{
	router.get('/',checkUnAuthenticated, (req, res, next) => {
		return res.render('login.ejs', {
			"baseurl": process.env.BASE_URL.slice(0, -1)
		});
	});
}

if(process.env.ENABLE_EXTERNAL_API != "true")
	router.use("/", require("../api/login-api"))

module.exports = router;
