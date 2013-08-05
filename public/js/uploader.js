/* Services */
var uploadQueue = [];
angular.module('uploaderApp.services', []).
    factory('notify', ['$window', function($window) {
        return function($scope, file) {
            // This file has completed uploading, so add it to the upload queue
            uploadQueue.push({
                scope: $scope,
                file: file
            });
        };
    }
]);

/**
 * Process the upload queue one at a time
 */
function processUploadQueue() {
    if (uploadQueue.length > 0) {
        // Run the task
        var task = uploadQueue.shift();

        notifyUploadCallback(task.scope, task.file, function () {
            // After the task has completed, continue processing the queue
            processUploadQueue();
        });
    } else {
        // Wait until we have something in the queue
        setTimeout(processUploadQueue, 500);
    }
}

// Start looking for items in the queue immediately
processUploadQueue();

/**
 * Send the description of the uploaded file to the upload callback endpoint
 *
 * The upload callback makes a request which starts the thumbnail image generation.
 *
 * The upload callback endpoint will return the url of the uploaded file, as well
 * as the url for the thumbnail.
 *
 * @param Scope $scope The angular.js scope
 * @param File file The uploaded file
 * @param function callback The callback function
 */
function notifyUploadCallback($scope, file, callback) {
    $.getJSON('/upload/callback/?gallery=' + file.folder + '&file=' + file.name, function (result) {
        // Update the url parameter so that angular updates its view template
        $scope.$apply(function() {
            file.url = result.url;
        });

        // Start waiting for the thumbnail to be generated
        pollThumbnailUrl($scope, file, result.thumbUrl);

        // Trigger the callback
        callback();
    });
}

/**
 * Start polling the thumbnail url to see if it has been created yet.
 *
 * Once the thumbnail has been created, update angular.js with the url to the
 * thumbnail so it can be added to the view template.
 *
 * @param Scope $scope The angular.js scope
 * @param File file The uploaded file
 * @param string thumbUrl The url of the thumbnail
 */
function pollThumbnailUrl($scope, file, thumbUrl) {
    $.ajax({
        url: thumbUrl,
        type: 'HEAD',
        error: function() {
            // 403/404'd, so we haven't found the thumbnail yet, keep waiting
            setTimeout(pollThumbnailUrl, 1000, $scope, file, thumbUrl);
        },
        success: function() {
            // Found the thumbnail, update the page!
            $scope.$apply(function() {
                file.imgUrl = thumbUrl;
            });
        }
    });
}
