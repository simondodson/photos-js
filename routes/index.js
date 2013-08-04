exports.index = function(req, res){
    var Gallery = require("../models/gallery"),
        _ = require('underscore');

    Gallery.find().exec(function (err, albums) {
        // Sort the albums by date
        albums = _.sortBy(albums, function (album) {
            return -1 * album.date;
        });

        res.render('index', {
            albums: albums,
            placeholderImg: process.env.PLACEHOLDER_IMAGE_URL,
            s3Url: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com',
            photoHelper: require('../helpers/photo')
        });
    });
};
