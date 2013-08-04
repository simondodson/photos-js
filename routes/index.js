exports.index = function(req, res){
    var Gallery = require("../models/gallery");

    Gallery.find().exec(function (err, albums) {
        console.log(albums);
        res.render('index', {
            albums: albums,
            placeholderImg: process.env.PLACEHOLDER_IMAGE_URL,
            s3Url: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com',
            photoHelper: require('../helpers/photo')
        });
    });
};
