// Global includes
var _ = require('underscore');

// Global variables
exports.locals = {};

exports.index = function(req, res){
    var mongo = require("../libs/mongo");

    mongo.gallery.findAll(function (err, albums) {
        res.render('index', _.extend({
            albums: albums,
            placeholderImg: process.env.PLACEHOLDER_IMAGE_URL,
            s3Url: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com'
        }, exports.locals));
    });
};
