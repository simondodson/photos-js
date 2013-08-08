var bucketUrl = 'http://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com';

module.exports = {
    /**
     * Get the thumbnail image url
     *
     * @param string albumId The album id
     * @param string photoName The photo name, without the extension. Eg. IMG_2534
     *
     * @return string
     */
    getThumbnailUrl: function (albumId, photoName) {
        return bucketUrl + '/' + albumId + '/' + photoName + '_thumb.jpg';
    },
    /**
     * Get the display image url
     *
     * @param string albumId The album id
     * @param string photoName The photo name, without the extension. Eg. IMG_2534

     * @return string
     */
    getDisplayUrl: function(albumId, photoName) {
        return bucketUrl + '/' + albumId + '/' + photoName + '_display.jpg';
    },
    /**
     * Get the original image url
     *
     * @param string albumId The album id
     * @param string photoName The photo name, without the extension. Eg. IMG_2534
     * @param string photoExt The photo extension, with the period. Eg. .JPG

     * @return string
     */
    getOriginalUrl: function (albumId, photoName, photoExt) {
        return bucketUrl + '/' + albumId + '/' + photoName + photoExt;
    },
    /**
     * Get an array of the relative paths to the original image and all thumbnails
     *
     * @param string albumId The album id
     * @param string photoName The photo name, without the extension. Eg. IMG_2534
     * @param string photoExt The photo extension, with the period. Eg. .JPG
     *
     * @return array
     */
    getPhotoPaths: function (albumId, photoName, photoExt) {
        return [
            '/' + albumId + '/' + photoName + '_thumb.jpg',
            '/' + albumId + '/' + photoName + '_display.jpg',
            '/' + albumId + '/' + photoName + photoExt
        ];
    },
    /**
     * Get the placeholder image url
     *
     * @return string
     */
    getPlaceholderUrl: function () {
        return process.env.PLACEHOLDER_IMAGE_URL;
    },
    /**
     * Generate the thumbnail images
     *
     * @param string albumId The album id
     * @param string photoFileName The photo file name. Eg. IMG_2534.JPG
     * @param function callback The callback function
     */
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
                    quality: 90
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
