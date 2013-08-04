var bucketUrl = 'http://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com';

module.exports = {
    getThumbnailUrl: function (albumId, photoName) {
        return bucketUrl + '/' + albumId + '/' + photoName + '_thumb.jpg';
    },
    getDisplayUrl: function(albumId, photoName) {
        return bucketUrl + '/' + albumId + '/' + photoName + '_display.jpg';
    },
    getOriginalUrl: function (albumId, photoName, photoExt) {
        return bucketUrl + '/' + albumId + '/' + photoName + photoExt;
    },
    generateThumbnail: function (albumId, photoFileName, callback) {
        var sqs = require("../libs/sqs");

        // Construct the SQS message
        var sqsMessageBody = JSON.stringify({
            original: albumId + '/' + photoFileName,
            descriptions: [
                {
                    height: 200,
                    width: 200,
                    suffix: "thumb",
                    quality: 80
                },
                {
                    height: 1200,
                    width: 1200,
                    suffix: "display",
                    quality: 80
                }
            ]
        });

        // Tell the queue to start resizing the thumbnail
        sqs.sendMessage({QueueUrl: process.env.AWS_SQS_QUEUE, MessageBody: sqsMessageBody}, function(err, data) {
            if (err) callback(err);

            callback(null);
        });
    }
};
