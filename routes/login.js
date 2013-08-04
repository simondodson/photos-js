exports.index = function (req, res){
    res.render('login', {
        message: req.flash('error')
    });
};

exports.post = function (req, res) {
    res.redirect('/');
};
