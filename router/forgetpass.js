const User = require('../models/user');
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
	return res.render('forget.ejs');
});

router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.send({ "Success": "Email incorrect!" });
        try {

			const user = await User.findOne({ email: req.body.email })

			if (!user) return res.send({ "Success": "Wrong email!" });
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
			}
	
			const link = `${process.env.BASE_URL}/forgetpass/${user._id}/${token.token}`;
			if(sendEmail(user.email, "Password reset", link) = 0){
				res.send({ "Success": "succes" });
			}else{
				return res.send({ "Success": "error" });
			}
		}catch(error){
			console.log(error);
			return res.send({ "Success": "error" });
		}
	
	
    } catch (error) {
		console.log(error);
		return res.send({ "Success": "error" });
		
    }
});

router.get('/:userId/:token', async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) return res.send("erreur lien invalide ou expiré");
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.send("erreur lien invalide ou expiré");
	}catch(error){
		return res.send("erreur lien invalide ou expiré");
	}


	

	return res.render('newpasswd.ejs');
});

router.post("/:userId/:token", async (req, res) => {
    try {
		var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

		try {
			const user = await User.findById(req.params.userId);
			if (!user) return res.send({ "Success": "error invalid link" });
			const token = await Token.findOne({
				userId: user._id,
				token: req.params.token,
			});
			if (!token) return res.status(400).send("Invalid link or expired");
			user.oldPassword = user.password;
			user.LastModification = Date.now();
			user.LastModificationIp = ip;
			user.password = req.body.password;
			await user.save();
			await token.delete();
	
			res.send({ "Success": "succes" });
		}catch(error){
			console.log(error)
			return res.send({ "Success": "error invalid link" });
		}
		
        
    } catch (error) {
		res.send({ "Success": "error" });
        console.log(error);
    }
});

module.exports = router;