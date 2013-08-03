// Global includes
var _ = require('underscore');

// Global variables
exports.locals = {};

exports.index = function(req, res, next) {
    var uploader = require('../public/components/amazon-s3-multi-uploader/uploader-routes');

    // Set the title for the upload page
    uploader.locals = _.extend(exports.locals, {
        title: "Upload Photos"
    });

    uploader.index(req, res, next);
};

/**
 * GET callback page after a successful upload
 */
exports.callback = function(req, res){
    var sqs = require("../libs/aws").sqs,
        path = require("path"),
        mongo = require('../libs/mongo'),
        _ = require('underscore');

    if (typeof(req.query.file) == "undefined") {
        throw "Cannot find query parameter: file";
    }

    if (typeof(req.query.gallery) == "undefined") {
        throw "Cannot find query parameter: gallery";
    }

    // Add the photo to the gallery
    mongo.gallery.findById(req.query.gallery, function (err, gallery) {
        if (gallery.photos === undefined) {
            gallery.photos = [];
        }

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

        mongo.gallery.save(gallery, function (err) {
            console.log('Saved', gallery);
        });
    });
    res.send(null, 200);

    var filePath = path.normalize(req.query.gallery + '/' + req.query.file).replace(/^\//, '');
    var config = {
        // Strip leading slashes from path
        original: filePath,
        descriptions: [
            {
                height: 200,
                width: 200,
                suffix: "thumb"
            },
            {
                height: 1200,
                width: 1200,
                suffix: "display"
            }
        ]
    };

    sqs.sendMessage({QueueUrl: process.env.AWS_SQS_QUEUE, MessageBody: JSON.stringify(config)}, function(err, data) {
        if (err) {
            console.log(err);
            return res.send(error, 500);
        }

        return res.send('{status: "ok"}', 200);
    });
};

