exports.index = function(req, res, next) {
    var uploader = require('../public/components/amazon-s3-multi-uploader/uploader-routes'),
        Gallery = require('../models/gallery');

    Gallery.findOne({_id: req.params.folder}, function (err, gallery) {
        if (err) throw err;

        if (!gallery) {
            res.status(404);
            res.render('error', {
                title: "Not Found",
                message: "Could not find gallery " + req.params.folder
            });
        }

        // Set the title for the upload page
        uploader.locals.title = "Add Photos to " + gallery.name;

        uploader.index(req, res, next);
    });
};

/**
 * GET callback page after a successful upload
 */
exports.callback = function(req, res){
    if (req.query.file === undefined) {
        throw "Cannot find query parameter: file";
    }

    if (req.query.gallery === undefined) {
        throw "Cannot find query parameter: gallery";
    }

    // Add the photo to the gallery
    var Gallery = require('../models/gallery');
    Gallery.findById(req.query.gallery, function (err, gallery) {
        if (err) throw err;

        var path = require("path"),
            _ = require('underscore');

        // Add the photo to the gallery
        var photo = {
            name: path.basename(req.query.file, path.extname(req.query.file)),
            ext: path.extname(req.query.file),
            owner: req.user._id
        };
        gallery.photos.push(photo);

        // Remove duplicates if they exist
        gallery.photos = _.uniq(gallery.photos, false, function (photo) {
            return photo.name + photo.ext;
        });

        // Sort by filename
        gallery.photos = _.sortBy(gallery.photos, function (photo) {
            return photo.name + photo.ext;
        });

        gallery.save(function (err, gallery) {
            // Generate the thumbnail
            var photoHelper = require('../helpers/photo');
            photoHelper.generateThumbnail(gallery._id, photo.name + photo.ext, function (err) {
                if (err) {
                    return res.send(error, 500);
                }

                // Get the the photo object
                var photo = _.filter(gallery.photos, function (photo) {
                    if (photo.name + photo.ext == req.query.file) {
                        return true;
                    }

                    return false;
                })[0];

                // Send back the image url and thumbnail url to the uploader page
                return res.send({
                    url: photoHelper.getOriginalUrl(gallery, photo),
                    thumbUrl: photoHelper.getThumbnailUrl(gallery, photo)
                }, 200);
            });
        });
    });
};

