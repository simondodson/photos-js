 var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     User = require('./user');

var PhotoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ext: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    aspect_ratio: { type: Number, required: true }
});

/**
 * Get the thumbnail image path
 *
 * @return string
 */
PhotoSchema.method('getThumbnailPath', function() {
    return this.name + '_thumb.jpg';
});

/**
 * Get the display image path
 *
 * @return string
 */
PhotoSchema.method('getDisplayPath', function() {
    return this.name + '_display.jpg';
});

/**
 * Get the original image path
 *
 * @return string
 */
PhotoSchema.method('getOriginalPath', function() {
    return this.name + this.ext;
});

var GallerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    photos: [ PhotoSchema ]
});

/**
 * Get the path to the gallery
 *
 * @return string
 */
GallerySchema.method('getGalleryPath', function () {
    return this._id;
});

module.exports = mongoose.model('Gallery', GallerySchema);
