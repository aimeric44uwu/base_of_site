const express = require('express');
const router = express.Router();
const User = require('../models/user');
const product = require("../products.json")
const Cart = require('../models/cart');

router.get('/api/productitem', async (req, res, next) => {
	return res.status(201).send(product);
})

router.post('/api/productitem', async (req, res, next) => {
	try {
		var myArray = {}
		var k = 0;
		for (var i = 0; i < Object.keys(product).length; i++) {
			if (product[i][0].name == req.body.searchedelement) {
				myArray = '{"0":' + JSON.stringify(product[i]) + ''
			}
		}
		for (var j = 0; j < Object.keys(product).length; j++) {
			if (product[j][0].name != req.body.searchedelement) {
				k++
				myArray += ',"' + k + '":' + JSON.stringify(product[j]) + ''
			}
		}
		myArray += '}'
		JSON.parse(myArray)
		return res.status(201).send(myArray);
	} catch (e) {
		return res.status(201).send(product);
	}
})

module.exports = router;
