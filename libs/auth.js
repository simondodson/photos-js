var everyauth = require('everyauth');

var usersByLogin = [];
usersByLogin[process.env.ADMIN_USERNAME] = {
    login: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
};

everyauth.everymodule.findUserById( function (id, callback) {
    callback(null, usersByLogin[id]);
});

everyauth.password
    .loginWith('login')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .authenticate( function (login, password) {
        var errors = [];
        if (!login) errors.push('Missing login');
        if (!password) errors.push('Missing password');
        if (errors.length) return errors;
        var user = usersByLogin[login];
        if (!user) return ['Login failed'];
        if (user.password !== password) return ['Login failed'];
        return user;
    })
    .getRegisterPath('/registration-unsupported')
    .postRegisterPath('/registration-unsupported')
    .registerView('registration-unsupported')
    .validateRegistration( function (newUserAttrs, errors) {
        return ['Registration not supported'];
    })
    .registerUser( function (newUserAttrs) {
        return ['Registration not supported'];
    })
    .loginSuccessRedirect('/');

module.exports = everyauth;
