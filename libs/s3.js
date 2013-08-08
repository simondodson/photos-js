var knox = require('knox'),
    s3Lister = require('s3-lister');

var client = knox.createClient({
    key    : process.env.AWS_ACCESS_KEY_ID,
    secret : process.env.AWS_SECRET_ACCESS_KEY,
    bucket : process.env.S3_BUCKET_NAME
});

module.exports = {
    /**
     * Delete all files from a folder
     *
     * @param string folder The folder
     * @param function callback The callback function
     */
    deleteFolder: function (folder, callback) {
        // S3 Lister will return *all* items in a folder,
        // instead of just returning the first 1,000 like the AWS SDK does.
        var lister = new s3Lister(client, {
            prefix : folder
        });

        lister.on('data', function (data) {
            client.del(data.Key).on('response', function(res) {
                // File successfully deleted
            }).end();
        })
        .on('error', function (err) {
            // Error
            callback(err);
        })
        .on('end', function () {
            // Success, trigger the callback
            callback(null);
        });
    },
    /**
     * Delete a photo and all its thumbnails
     *
     * @param string gallery The gallery id
     * @param string photo The photo id
     * @param function callback The callback function
     */
    deletePhoto: function(gallery, photo, callback) {
        var photoHelper = require('../helpers/photo');

        // Delete the photos
        var photos = photoHelper.getPhotoPaths(gallery, photo);
        client.deleteMultiple(photos, function(err, res){
            callback(err);
        });
    }
};
