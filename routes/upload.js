exports.index = function(req, res, next) {
    var uploader = require('../public/components/amazon-s3-multi-uploader/uploader-routes');

    // Set the title for the upload page
    uploader.locals.title = "Upload Photos";

    uploader.index(req, res, next);
};

/**
 * GET callback page after a successful upload
 */
exports.callback = function(req, res){
    var path = require("path"),
        Gallery = require('../models/gallery'),
        _ = require('underscore');

    if (typeof(req.query.file) == "undefined") {
        throw "Cannot find query parameter: file";
    }

    if (typeof(req.query.gallery) == "undefined") {
        throw "Cannot find query parameter: gallery";
    }

    // Construct the SQS message
    var filePath = path.normalize(req.query.gallery + '/' + req.query.file).replace(/^\//, '');
    var sqsMessageBody = JSON.stringify({
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
    });

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
            var sqs = require("../libs/aws").sqs;

            // Tell the queue to start resizing the thumbnail
            sqs.sendMessage({QueueUrl: process.env.AWS_SQS_QUEUE, MessageBody: sqsMessageBody}, function(err, data) {
                if (err) {
                    return res.send(error, 500);
                }

                // Send back the image url and thumbnail url to the uploader page
                var photoHelper = require('../helpers/photo');
                return res.send({
                    url: photoHelper.getOriginalUrl(gallery.id, photo.name, photo.ext),
                    thumbUrl: photoHelper.getThumbnailUrl(gallery.id, photo.name)
                }, 200);
            });
        });
    });
};

