var Photo = Backbone.Model.extend({
});

var PhotosList = Backbone.Collection.extend({
    model: Photo
});

var GalleriesList = Backbone.Collection.extend({
    url: '/list'
});

var galleries = new GalleriesList();
galleries.fetch();
galleries.on('sync', function () {
    var album = galleries.at(0);
    var photos = new PhotosList(galleries.at(0).get('photos'));
    main(album, photos);
});

function main (album, photos) {
    // Ideal photo distribution
    // Retrieved on 2013-08-13 from http://www.crispymtn.com/stories/the-algorithm-for-a-perfectly-balanced-photo-gallery
    var ideal_height, index, partition, row_buffer, rows, summed_width, viewport_width, weights;
    viewport_width = $('.container .row').first().width();
    ideal_height = parseInt($(window).height() / 5, 10);
    summed_width = photos.reduce(function(sum, p) {
        return sum += p.get('aspect_ratio') * ideal_height;
    }, 0);

    rows = Math.round(summed_width / viewport_width);

    if (rows < 1) {
        // (2a) Fallback to just standard size
        photos.each(function(photo) {
            return photo.set('size', [
                parseInt(ideal_height * photo.get('aspect_ratio'), 10),
                ideal_height
            ]);
        });
    } else {
        // (2b) Distribute photos over rows using the aspect ratio as weight
        weights = photos.map(function(p) {
            return parseInt(p.get('aspect_ratio') * 100, 10);
        });
        partition = linear_partition(weights, rows);

        // (3) Iterate through partition
        index = 0;
        row_buffer = new Backbone.Collection();
        _.each(partition, function(row) {
            var summed_ratios;
            row_buffer.reset();
            _.each(row, function() {
                return row_buffer.add(photos.at(index++));
            });
            summed_ratios = row_buffer.reduce((function(sum, p) {
                return sum += p.get('aspect_ratio');
            }), 0);
            return row_buffer.each(function(photo) {
                return photo.set('size', [
                    parseInt(viewport_width / summed_ratios * photo.get('aspect_ratio'), 10),
                    parseInt(viewport_width / summed_ratios, 10)
                ]);
            });
        });

        // Add them photos!
        var photosParent = $('.photos').first();
        row_buffer.each(function (photo) {
            photo.set({
                placeholderUrl: Helper_Photo.getPlaceholderUrl(),
                thumbUrl: Helper_Photo.getThumbnailUrl(album.attributes, photo.attributes),
                displayUrl: Helper_Photo.getDisplayUrl(album.attributes, photo.attributes),
                originalUrl: Helper_Photo.getOriginalUrl(album.attributes, photo.attributes)
            });
            console.log(photo.attributes);
            var html = _.template($('#photo.template').html(), photo.attributes);
            $('.photos').first().append(html);
        });

        // Start that lazy loadin'
        $('.photos img').unveil(200);
    }
}
