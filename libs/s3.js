var knox = require('knox'),
    s3Lister = require('s3-lister');

var client = knox.createClient({
    key    : process.env.AWS_ACCESS_KEY_ID,
    secret : process.env.AWS_SECRET_ACCESS_KEY,
    bucket : process.env.S3_BUCKET_NAME
});

/**
 * Delete all files from a folder
 *
 * @param string folder The folder
 */
function deleteFolder(folder, callback) {
    var lister = new s3Lister(client, {
        prefix : folder
    });

    lister.on('data', function (data) {
        console.log("Deleting " + data.Key);
        client.del(data.Key).on('response', function(res) {
            // File successfully deleted
        }).end();
    })
    .on('error', function (err) {
        // Error
        callback(err);
    })
    .on('end', function () {
        // Success
        callback(null);
    });
}

module.exports = {
    deleteFolder: deleteFolder
};
