$(document).ready(function () {
    if ($('.img-thumbnail').length > 0) {
        // Create the lightbox
        $('.img-thumbnail').zerobox({
            preLoad: false
        });

        // Start that lazy loadin'
        $('.img-thumbnail:visible').unveil(200);
    }

    $('.button-delete-album').click(function (e) {
        var albumName = $(this).attr('data-album-name');
        if (confirm("Are you sure you want to delete " + albumName)) {
            // Allow the link click to propagate
            return true;
        } else {
            e.preventDefault();
        };
    })
});
