exports.index = function(req, res){
    var Gallery = require("../models/gallery");

    // Get a list of all albums
    Gallery.find().exec(function (err, albums) {
        // Sort the albums by date
        var _ = require('underscore');
        albums = _.sortBy(albums, function (album) {
            return -1 * album.date;
        });

        res.render('index', {
            albums: albums,
            photoHelper: require('../helpers/photo')
        });
    });
};
