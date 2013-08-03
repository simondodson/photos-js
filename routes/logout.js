
exports.index = function (req, res) {
    req.session.user = {};
    return res.redirect('/');
};
