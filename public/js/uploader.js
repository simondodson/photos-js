/* Services */
var queue = [];
angular.module('uploaderApp.services', []).
    factory('notify', ['$window', function($window) {
        return function($scope, file) {
            queue.push({
                scope: $scope,
                file: file
            });
        }
    }
]);

function processQueue() {
    if (queue.length > 0) {
        // Run the task
        var task = queue.shift();

        triggerUploadCallback(task.scope, task.file, function () {
            // After the task has completed, continue processing the queue
            processQueue();
        });
    } else {
        // Wait until we have something in the queue
        setTimeout(processQueue, 500);
    }
}
processQueue();

function triggerUploadCallback($scope, file, callback) {
    $.getJSON('/upload/callback/?gallery=' + file.folder + '&file=' + file.name, function (result) {
        // Update the url parameter in angular
        $scope.$apply(function() {
            file.url = result.url;
        });

        // Start waiting for the thumbnail to be generated
        waitForThumbnail($scope, file, result.thumbUrl);

        // Trigger the callback
        callback();
    });
}

// Wait until the thumbnail is available before adding the image to the page
function waitForThumbnail ($scope, file, thumbUrl) {
    $.ajax({
        url: thumbUrl,
        type: 'HEAD',
        error: function() {
            // 403/404'd, so we haven't found the thumbnail yet, keep waiting
            setTimeout(waitForThumbnail, 1000, $scope, file, thumbUrl);
        },
        success: function() {
            // Found the thumbnail, update the page!
            $scope.$apply(function() {
                file.imgUrl = thumbUrl;
            });
        }
    });
};

