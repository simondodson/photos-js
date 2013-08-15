// Ideal photo distribution
// Retrieved on 2013-08-13 from http://www.crispymtn.com/stories/the-algorithm-for-a-perfectly-balanced-photo-gallery
var ideal_height, index, partition, row_buffer, rows, summed_width, viewport_width, weights;

viewport_width = $(window).width();

ideal_height = parseInt($(window).height() / 2, 10);

summed_width = photos.reduce((function(sum, p) {
  return sum += p.get('aspect_ratio') * ideal_height;
}), 0);

rows = Math.round(summed_width / viewport_width);

if (rows < 1) {
  photos.each(function(photo) {
    return photo.view.resize(parseInt(ideal_height * photo.get('aspect_ratio'), 10), ideal_height);
  });
} else {
  weights = photos.map(function(p) {
    return parseInt(p.get('aspect_ratio') * 100, 10);
  });
  partition = linear_partition(weights, rows);
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
      return photo.view.resize(parseInt(viewport_width / summed_ratios * photo.get('aspect_ratio'), 10), parseInt(viewport_width / summed_ratios, 10));
    });
  });
}
