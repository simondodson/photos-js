 var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

// Gallery
var GallerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    photos: [{
        name: { type: String, required: true },
        ext: { type: String, required: true }
    }]
});

module.exports = mongoose.model('Gallery', GallerySchema);
