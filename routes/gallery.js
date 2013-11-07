var Gallery = require('../models/gallery'),
    s3 = require('../libs/s3'),
    _ = require('underscore');

exports.list = function (req, res) {
    // Get a list of all albums
    Gallery.find().populate('photos.owner', 'username').exec(function (err, albums) {
        // Sort the albums by date
        albums = _.sortBy(albums, function (album) {
            var date = new Date(album.date);
            return -1 * date.getTime();
        });

        res.set('Content-Type', 'application/json');
        res.send(200, albums);
    });
};

exports.index = function(req, res){
    res.render('create');
};

exports.post = function(req, res){
    var gallery = new Gallery(req.body);

    gallery.save(function (err, gallery) {
        if (err) throw err;
        res.redirect('/upload/' + gallery.id);
    });
};

exports.delete = function(req, res) {
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

exports.delete_photo = function (req, res) {
    if (req.params.gallery === undefined) {
        throw "Cannot find album parameter";
    }

    if (req.params.photo === undefined) {
        throw "Cannot find photo parameter";
    }

    Gallery.findOne({_id: req.params.gallery}, function (err, gallery) {
        if (err) throw err;

        if (!gallery) {
            res.status(404);
            res.render('error', {
                title: "Not Found",
                message: "Could not find gallery " + req.params.gallery
            });
        }

        // Get the details of the photo we're going to delete
        var photo = _.filter(gallery.photos, function (photo) {
            if (photo._id == req.params.photo) {
                return true;
            }

            return false;
        })[0];

        // Remove the photo files from S3
        s3.deletePhoto(gallery, photo, function (err) {
            if (err) throw err;

            // Remove the photo from the array
            gallery.photos = _.filter(gallery.photos, function (photo) {
                if (photo._id == req.params.photo) {
                    return false;
                }

                return true;
            });

            // Save the gallery
            gallery.save(function (err) {
                if (err) throw err;

                req.flash('success', 'Photo removed successfully');
                res.redirect('/');
            });
        });
    });
};
