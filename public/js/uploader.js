var socket = io.connect(window.location.origin);

/* Services */
var files = [];
angular.module('uploaderApp.services', []).
    factory('notify', ['$window', function($window) {
        return function($scope, file) {
            // Store the Angular.js data for this file
            files[file.name] = {
                scope: $scope,
                file: file
            };

            // Tell the backend this file has been uploaded
            socket.emit('uploaded', {
                gallery: file.folder,
                file: file.name
            });
        };
    }
]);

// The backend has notified us the thumbnail is being generated
socket.on('thumbnail', function (data) {
    pollThumbnailUrl(data.name, data.url);
});

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
