var bucketUrl = 'https://' + Config.S3.Bucket + '.s3.amazonaws.com';

var Helper_Photo =  {

    getPlaceholderUrl: function () {
        return Config.Photo.Placeholder;
    },

    /**
     * Get the path to the gallery
     *
     * @return string
     */
    getGalleryPath:  function (gallery) {
        return gallery._id;
    },

    /**
     * Get the thumbnail image path
     *
     * @return string
     */
    getThumbnailPath:  function(photo) {
        return photo.name + '_thumb.jpg';
    },

    /**
     * Get the thumbnail image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo
     *
     * @return string
     */
    getThumbnailUrl: function (gallery, photo) {
        return bucketUrl + '/' + this.getGalleryPath(gallery) + '/' + this.getThumbnailPath(photo);
    },

    /**
     * Get the display image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo

     * @return string
     */
    getDisplayUrl: function (gallery, photo) {
        return bucketUrl + '/' + this.getGalleryPath(gallery) + '/' + this.getDisplayPath(photo);
    },

    /**
     * Get the display image path
     *
     * @return string
     */
    getDisplayPath: function(photo) {
        return photo.name + '_display.jpg';
    },

    /**
     * Get the original image url
     *
     * @param Gallery gallery The gallery
     * @param Photo photo The photo

     * @return string
     */
    getOriginalUrl: function (gallery, photo) {
        return bucketUrl + '/' + this.getGalleryPath(gallery) + '/' + this.getOriginalPath(photo);
    },

    /**
     * Get the original image path
     *
     * @return string
     */
    getOriginalPath: function(photo) {
        return photo.name + photo.ext;
    }
};
