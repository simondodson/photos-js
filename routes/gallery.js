exports.index = function(req, res){
    res.render('create');
};

exports.post = function(req, res){
    var Gallery = require('../models/gallery');

    var gallery = new Gallery(req.body);
    gallery.save(function (err, gallery) {
        if (err) throw err;
        res.redirect('/upload/' + gallery.id);
    });
};
