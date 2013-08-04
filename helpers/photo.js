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
    }
};
