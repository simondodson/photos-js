exports.index = function(req, res){
    var Gallery = require("../models/gallery"),
        photoHelper = require('../helpers/photo');

    // Get a list of all albums
    Gallery.find().populate('photos.owner', 'username').exec(function (err, albums) {
        // Sort the albums by date
        var _ = require('underscore');
        albums = _.sortBy(albums, function (album) {
            var date = new Date(album.date);
            return -1 * date.getTime();
        });

        res.render('index', {
            albums: albums
        });
    });
};
