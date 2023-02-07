const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkAuthenticated = require("../auth/CheckAuth")
const Cart = require('../models/cart');

router.get('/',checkAuthenticated, (req, res, next) => {
	return res.render('deleteacc.ejs');
});

router.post('/',checkAuthenticated, (req, res, next) => {
    
    try {
        let account = User.findOne({ unique_id: req.session.userId }, async (err, data) => {
            if (!data) {
                res.redirect('/');
            } else {
                let id = data._id;
                const user = await User.findByIdAndDelete(id);
                if (!user) {
                    return res.send({ "status": "error", "message": "an error occured" });
                }         
                // Cart.findOne({ userId: id }, (err, datacart) => {
                //     Cart.findByIdAndDelete(datacart._id);
                // })
                req.session.destroy((err) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.send({ "status": "success", "message": "account deleted"  });
                    }
                });
            }
        });
    }  catch (error) {}
});

module.exports = router;