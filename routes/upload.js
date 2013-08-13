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

    // Setup the socket to process uploads
    processUploads(req.user);
};

/**
 * Setup a socket to process uploads
 *
 * @param User user The user
 */
function processUploads(user) {
    var io = require('../libs/socket.io');

    // Setup the process upload socket
    io.sockets.on('connection', function(socket) {
        var photoQueue = [];

        // When a photo comes in, add it to the queue
        socket.on('uploaded', function (data) {
            if (data.file === undefined) {
                throw "Cannot find parameter: file";
            }

            if (data.gallery === undefined) {
                throw "Cannot find parameter: gallery";
            }

            photoQueue.push(data);
        });

        // Process the uploaded photos one by one
        var processQueue = function () {
            if (photoQueue.length > 0) {
                var data = photoQueue.shift();
                console.log("Processing " + data.gallery + '/' + data.file);

                // Add the photo to the gallery
                var Gallery = require('../models/gallery');
                Gallery.findById(data.gallery, function (err, gallery) {
                    if (err) throw err;

                    var path = require("path"),
                        _ = require('underscore');

                    // Add the photo to the gallery
                    var photo = {
                        name: path.basename(data.file, path.extname(data.file)),
                        ext: path.extname(data.file),
                        owner: user._id
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
                            if (err) throw err;

                            // Get the the photo object
                            var photo = _.filter(gallery.photos, function (photo) {
                                if (photo.name + photo.ext == data.file) {
                                    return true;
                                }

                                return false;
                            })[0];

                            // Send back the image url and thumbnail url to the uploader page
                            socket.emit('thumbnail', {
                                name: photo.getOriginalPath(),
                                url: photoHelper.getThumbnailUrl(gallery, photo)
                            });
                        });

                        // Process the next photo in the queue
                        processQueue();
                    });
                });
            } else {
                // Wait for any photos
                setTimeout(processQueue, 250);
            }
        };
        processQueue();
    });
}
