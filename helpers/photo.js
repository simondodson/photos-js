var bucketUrl = 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com';

module.exports = {
    /**
     * Get the thumbnail image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo
     *
     * @return string
     */
    getThumbnailUrl: function (gallery, photo) {
        return bucketUrl + '/' + gallery.getGalleryPath() + '/' + photo.getThumbnailPath();
    },
    /**
     * Get the display image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo

     * @return string
     */
    getDisplayUrl: function (gallery, photo) {
        return bucketUrl + '/' + gallery.getGalleryPath() + '/' + photo.getDisplayPath();
    },
    /**
     * Get the original image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo

     * @return string
     */
    getOriginalUrl: function (gallery, photo) {
        return bucketUrl + '/' + gallery.getGalleryPath() + '/' + photo.getOriginalPath();
    },
    /**
     * Get an array of the relative paths to the original image and all thumbnails
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo
     *
     * @return array
     */
    getPhotoPaths: function (gallery, photo) {
        return [
            '/' + gallery.getGalleryPath() + '/' + photo.getThumbnailPath(),
            '/' + gallery.getGalleryPath() + '/' + photo.getDisplayPath(),
            '/' + gallery.getGalleryPath() + '/' + photo.getOriginalPath()
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
     * @param string galleryId The galllery id
     * @param string photoFileName The photo file name. Eg. IMG_2534.JPG
     * @param function callback The callback function
     */
    generateThumbnail: function (galleryId, photoFileName, callback) {
        var sqs = require("../libs/sqs");

        // Construct the SQS message
        var sqsMessageBody = JSON.stringify({
            original: galleryId + '/' + photoFileName,
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
