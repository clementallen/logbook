$('#logbook-tablist a').on('click', function(e) {
    e.preventDefault();
    window.location.hash = $(this).text();
});

function loadPageFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash === '') {
        $(`#logbook-tablist a[aria-controls="${new Date().getFullYear()}"]`).click();
    } else {
        $(`#logbook-tablist a[aria-controls=${hash}]`).click();
    }
}

// shows page depending on url
$(document).ready(loadPageFromHash);
$(window).on('hashchange', loadPageFromHash);

// Highlights active page in navbar
$(`a[href="${window.location.pathname}"]`).parent().addClass('active');

// Init material animations
$.material.init();

// If the page has a message
const messageAlert = $('.message-alert');
if (messageAlert.length) {
    $('body').append($('<div id="lightbox">'));
    const lightbox = $('#lightbox');

    setTimeout(() => {
        messageAlert.fadeOut();
        lightbox.fadeOut();
    }, 2000);
}

// Dismisses alerts and lightboxes
$('[data-dismiss=\'alert\']').on('click', () => {
    const lightbox = $('#lightbox');
    lightbox.fadeOut();
});

// Hamburger
$('.btn-hamburger').on('click', () => {
    $('.hamburger').toggleClass('is-active');
});
