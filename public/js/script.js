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

    // Hover over album titles
    $('.album-title').hover(function () {
        $(this).find('a.anchor i').toggleClass('hide');
    });

    // The "More" button
    $('.btn-more').click(function (e) {
        // Hide the button
        $(this).hide();
        $(this).parent().find('.btn-less').show();

        // Show all the hidden thumbnails
        $(this).parents('.row').find('.hide-toggle').toggleClass('hide');

        // Start that lazy loadin'
        $(this).parents('.row').find('.img-thumbnail img').unveil(200);
    });

    // The "Less" button
    $('.btn-less').click(function (e) {
        // Hide the button
        $(this).hide();
        $(this).parent().find('.btn-more').show();

        // Show all the hidden thumbnails
        $(this).parents('.row').find('.hide-toggle').toggleClass('hide');
    });
});
