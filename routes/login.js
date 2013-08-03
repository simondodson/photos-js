// Global includes
var _ = require('underscore');

// Global variables
exports.locals = {};

exports.index = function (req, res) {
    res.render('login', _.extend({
        title: "Login"
    }, exports.locals));
};

exports.post = function (req, res) {
    var isValidUsername = (req.body.username == process.env.ADMIN_USERNAME);
    var isValidPassword = (req.body.password == process.env.ADMIN_PASSWORD);

    if (isValidUsername && isValidPassword) {
        req.session.user = {};
        req.session.user.isAuthenticated = true;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
};
