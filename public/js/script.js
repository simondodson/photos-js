$(document).ready(function () {
    if ($('.img-thumbnail img').length > 0) {
        // Create the lightbox
        $('.img-thumbnail img').zerobox({
            preLoad: false
        });

        // Start that lazy loadin'
        $('.img-thumbnail img').unveil(200);
    }

    $('.button-delete-album').click(function (e) {
        var albumName = $(this).attr('data-album-name');
        if (confirm("Are you sure you want to delete " + albumName)) {
            // Allow the link click to propagate
            return true;
        } else {
            e.preventDefault();
        }
    });

    // The "More" button
    $('.btn-more').click(function (e) {
        // Hide the button
        $(this).hide();

        // Show all the hidden thumbnails
        $(this).parent().find('.hide-toggle').toggleClass('hide');

        // Start that lazy loadin'
        $(this).parent().find('.img-thumbnail img').unveil(200);
    });
});
