exports.index = function(req, res) {
    res.render('user');
};

exports.post = function(req, res) {
    var User = require('../models/user');

    if (req.user.username != req.body.username) {
        req.user.username = req.body.username;
    }

    if (req.body.password.length > 0) {
        req.user.password = req.body.password;
    }

    req.user.save(function(err) {
        if (err) {
            if (err.name == 'MongoError') {
                req.flash('error', err.err);
            } else if (err.errors && err.errors.username.type == 'required') {
                req.flash('error', "Username is required");
            }
        } else {
            req.flash('success', "Account Settings updated successfully");
        }

        res.redirect('/user');
    });

};
