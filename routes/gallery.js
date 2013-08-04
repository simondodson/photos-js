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

exports.delete = function(req, res) {
    var Gallery = require("../models/gallery"),
        s3 = require('../libs/s3');

    Gallery.findOne({_id: req.params.gallery}, function (err, gallery) {
        if (err) throw err;

        if (!gallery) {
            res.status(404);
            res.render('error', {
                title: "Not Found",
                message: "Could not find gallery " + req.params.gallery
            });
        }

        // Remove the gallery folder in S3
        s3.deleteFolder(req.params.gallery, function (err) {
            if (err) throw err;

            // Remove the gallery from the database
            gallery.remove(function (err) {
                if (err) throw err;

                req.flash('success', 'Gallery ' + gallery.name + ' removed successfully');
                res.redirect('/');
            });
        });
    });
};
