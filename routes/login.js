exports.index = function (req, res){
    res.render('login');
};

exports.post = function (req, res) {
    res.redirect('/');
};
