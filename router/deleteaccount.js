const express = require('express');
const router = express.Router();
const User = require('../models/user');
const checkAuthenticated = require("../auth/CheckAuth")


router.get('/',checkAuthenticated, (req, res, next) => {
	return res.render('deleteacc.ejs');
});

router.post('/',checkAuthenticated, (req, res, next) => {
    
    try {
        let account = User.findOne({ unique_id: req.session.userId }, (err, data) => {
            if (!data) {
                res.redirect('/');
            } else {
                console.log(data.id)
                account.delete()
                req.session.destroy((err) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.send({ "Success": "Success!" });
                    }
                });
            }
        });
    }  catch (error) {}
});

module.exports = router;