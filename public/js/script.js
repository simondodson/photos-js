$(document).ready(function () {
    // Create the lightbox
    $('.img-thumbnail').zerobox({
        preLoad: false
    });

    // Start that lazy loadin'
    $('.img-thumbnail:visible').unveil(200);
});
