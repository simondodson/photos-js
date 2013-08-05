$(document).ready(function () {
    if ($('.img-thumbnail').length > 0) {
        // Create the lightbox
        $('.img-thumbnail').zerobox({
            preLoad: false
        });

        // Start that lazy loadin'
        $('.img-thumbnail:visible').unveil(200);
    }
});
