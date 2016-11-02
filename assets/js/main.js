$('#logbook-tablist a').on('click', function(e) {
    e.preventDefault();
    window.location.hash = $(this).text();
});

function loadPageFromHash() {
    var hash = window.location.hash.substring(1);
    if(hash === '') {
        $('#logbook-tablist a[aria-controls="2016"]').click();
    } else {
        $('#logbook-tablist a[aria-controls=' + hash + ']').click();
    }
}

//shows page depending on url
$(document).ready(loadPageFromHash);
$(window).on('hashchange',loadPageFromHash);

// Highlights active page in navbar
$('a[href="' + this.location.pathname + '"]').parent().addClass('active');

// Init material animations
$.material.init();

// If the page has a message
var messageAlert = $('.message-alert');
if(messageAlert.length) {
    $('body').append($('<div id="lightbox">'));
    var lightbox = $('#lightbox');

    setTimeout(function() {
        messageAlert.fadeOut();
        lightbox.fadeOut();
    }, 2000);
}

// Dismisses alerts and lightboxes
$('[data-dismiss=\'alert\']').on('click', function() {
    lightbox.fadeOut();
});

// Hamburger
$('.btn-hamburger').on('click', function() {
    $('.hamburger').toggleClass('is-active');
});
