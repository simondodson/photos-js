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
        uploader.locals.title = "Upload Photos to " + gallery.name;

        uploader.index(req, res, next);
    });
};

/**
 * GET callback page after a successful upload
 */
exports.callback = function(req, res){
    var path = require("path"),
        Gallery = require('../models/gallery'),
        _ = require('underscore'),
        photoHelper = require('../helpers/photo');

    if (typeof(req.query.file) == "undefined") {
        throw "Cannot find query parameter: file";
    }

    if (typeof(req.query.gallery) == "undefined") {
        throw "Cannot find query parameter: gallery";
    }

    // Add the photo to the gallery
    Gallery.findById(req.query.gallery, function (err, gallery) {
        if (err) throw err;

        // Add the photo to the gallery
        var photo = {
            name: path.basename(req.query.file, path.extname(req.query.file)),
            ext: path.extname(req.query.file)
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
            photoHelper.generateThumbnail(req.query.gallery, req.query.file, function (err) {
                if (err) {
                    return res.send(error, 500);
                }

                // Send back the image url and thumbnail url to the uploader page
                return res.send({
                    url: photoHelper.getOriginalUrl(gallery.id, photo.name, photo.ext),
                    thumbUrl: photoHelper.getThumbnailUrl(gallery.id, photo.name)
                }, 200);
            });
        });
    });
};

