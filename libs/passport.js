var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

passport.serializeUser(function(User, callback) {
    callback(null, User.id);
});

passport.deserializeUser(function(id, callback) {
    User.findOne({ _id: id }).exec(function (err, user) {
        callback(err, user);
    });
});

// Verify a POST to the /login page
passport.use(new LocalStrategy(
    function(username, password, callback) {
        process.nextTick(function () {
            User.findOne({ username: username }).exec(function (err, User) {
                if (err) {
                    return callback(err);
                }

                if (!User) {
                    return callback(null, false, {
                        message: 'Unknown user ' + username
                    });
                }

                // test a matching password
                User.validPassword(password, function(err, isMatch) {
                    if (err) throw err;

                    if (!isMatch) {
                        return callback(null, false, {
                            message: 'Invalid password'
                        });
                    }

                    return callback(null, User);
                });
            });
        });
    }
));

module.exports = passport;
