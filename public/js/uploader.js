var socket = io.connect(window.location.origin);

/* Services */
var files = [];
angular.module('uploaderApp.services', []).
    factory('notify', ['$window', function($window) {
        return function($scope, file) {
            getImageAttributes(file, function (file) {
                // Store the Angular.js data for this file
                files[file.name] = {
                    scope: $scope,
                    file: file
                };

                // Tell the backend this file has been uploaded
                socket.emit('uploaded', {
                    gallery: file.folder,
                    file: file.name,
                    aspect_ratio: file.aspect_ratio
                });
            });
        };
    }
]);

// The backend has notified us the thumbnail is being generated
socket.on('thumbnail', function (data) {
    pollThumbnailUrl(data.name, data.url);
});

function getImageAttributes(file, callback) {
    // Get the width, height and aspect ratio of the image
    var image = new Image();
    image.onload = function() {
        file.width = this.width;
        file.height = this.height;
        file.aspect_ratio = (this.width / this.height);

        callback(file);
    };
    image.onerror = function() {
        file.width = null;
        file.height = null;
        file.aspect_ratio = null;

        callback(file);
    };

    var url = window.URL || window.webkitURL;
    image.src = url.createObjectURL(file);
}

/**
 * Start polling the thumbnail url to see if it has been created yet.
 *
 * Once the thumbnail has been created, update angular.js with the url to the
 * thumbnail so it can be added to the view template.
 *
 * @param string fileName The file name
 * @param string url The url of the thumbnail
 */
function pollThumbnailUrl(fileName, url) {
    $.ajax({
        url: url,
        type: 'HEAD',
        error: function() {
            // 403/404'd, so we haven't found the thumbnail yet, keep waiting
            setTimeout(pollThumbnailUrl, 250, fileName, url);
        },
        success: function() {
            var $scope = files[fileName].scope;
            var file = files[fileName].file;

            // Found the thumbnail, update the page!
            $scope.$apply(function() {
                file.imgUrl = url;
            });
        }
    });
}
