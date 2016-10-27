var messageAlert = $('.message-alert');

// Highlights active page in navbar
$('a[href="' + this.location.pathname + '"]').parent().addClass('active');

// Init material animations
$.material.init();

// If the page has a message
if(messageAlert.length) {
    $('body').append($('<div id="lightbox">'));
    var lightbox = $('#lightbox');

    setTimeout(function() {
        messageAlert.fadeOut();
        lightbox.fadeOut();
    }, 2000);
}

// Dismisses modals
$('[data-dismiss=\'modal\']').on('click', function() {
    $('.modal').fadeOut();
});

// Dismisses alerts and lightboxes
$('[data-dismiss=\'alert\']').on('click', function() {
    lightbox.fadeOut();
});

// Hamburger
$('.btn-hamburger').on('click', function() {
    $('.hamburger').toggleClass('is-active');
});

// Shows the add flight field
$('.add-flight-button').on('click', function() {
    $('.modal').fadeIn();
    $('#pilot-field').focus();
});

$('#file-upload').on('change', function(e) {
    e.preventDefault();

    var files = $(this).get(0).files;

    if(files.length > 0) {
        var formData = new FormData();

        formData.append('upload[]', files[0], files[0].name);

        $.ajax({
          url: '/api/flight',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
              console.log('upload successful!');
          }
        });
    }
});
