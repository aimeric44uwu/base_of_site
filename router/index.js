const express = require('express');
const router = express.Router();
const User = require('../models/user');
const product = require("../products.json")
const Cart = require('../models/cart');

router.get('/', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			return res.render('index.ejs', {
				"logged": false,
				"name": undefined,
				"baseurl": (process.env.ENABLE_EXTERNAL_API == "true") ? 
				process.env.API_URL.slice(0, -1) + ":" + process.env.API_PORT
				 : process.env.BASE_URL.slice(0, -1) + ":" + process.env.PORT,
			});
		} else {
			Cart.findOne({ userId: data._id }, (err, cartofuser) => {
				return res.render('index.ejs', {
					"logged": true,
					"name": data.firstName,
					"baseurl": (process.env.ENABLE_EXTERNAL_API == "true") ? 
					process.env.API_URL.slice(0, -1) + ":" + process.env.API_PORT
					 : process.env.BASE_URL.slice(0, -1) + ":" + process.env.PORT,
					product: product,
					cartvar: cartofuser
				});
			})
			//<% for(var eacharticle=0; eacharticle < Object.keys(cartvar.products).length; eacharticle++) {
		}
	});
});
router.post('/', async (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, async (err, data) => {
		if (!data) {
			res.send({ "status": "unlogged", "message": "" });
		} else {
			const { productId, quantity } = req.body;
			const userId = data._id;
			try {
				let cart = await Cart.findOne({ userId });
				if (cart) {
					//cart exists for user
					let itemIndex = cart.products.findIndex(p => p.productId == productId);
					if (itemIndex > -1) {
						//product exists in the cart, update the quantity
						let productItem = cart.products[itemIndex];
						productItem.quantity = quantity;
						cart.products[itemIndex] = productItem;
					} else {
						//product does not exists in cart, add new item
						cart.products.push({ productId, quantity });
					}
					cart = await cart.save();
					return res.status(201).send(cart);
				} else {
					//no cart for user, create new cart
					const newCart = await Cart.create({
						userId,
						products: [{ productId, quantity }]
					});
					return res.status(201).send(newCart);
				}
			} catch (err) {
				console.log(err);
				res.status(500).send("Something went wrong");
			}
		}
	});
});

router.get('/api/Cartitem', async (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		Cart.findOne({ userId: data._id }, (err, cartofuser) => {
			if(cartofuser != null){
			let productsunformatted = '{';
			for(var eacharticle=0; eacharticle < Object.keys(cartofuser.products).length; eacharticle++) {
				productsunformatted += '"' + eacharticle + '": {"name":"'+product[cartofuser.products[eacharticle]._doc.productId][0].name+'", "img":"'+product[cartofuser.products[eacharticle]._doc.productId][0].img + '","price":' + product[cartofuser.products[eacharticle]._doc.productId][0].priceatml * cartofuser.products[eacharticle]._doc.quantity + ',"quantity":' + cartofuser.products[eacharticle]._doc.quantity + '}'
				if(eacharticle < Object.keys(cartofuser.products).length - 1) productsunformatted += ","
			}
			productsunformatted += '}'
			return res.status(201).send(JSON.parse(productsunformatted));
		}
		return res.status(201).send("nothing in cart");
	})
	})
})

if(process.env.ENABLE_EXTERNAL_API != "true")
	router.use("/", require("../api/index-api"))

module.exports = router;