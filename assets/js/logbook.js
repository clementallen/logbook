function renderFlight(flight) {
    $.get('/templates/flight.html', function(template) {
        template = $(template).filter('#flight-template').html();
        flight.date = formatDate(flight.date);
        flight.duration = formatDuration(flight.duration);
        flight.takeoffTime = formatTime(flight.takeoffTime);
        flight.landingTime = formatTime(flight.landingTime);
        $('.logbook-container').append(Mustache.render(template, flight));
    });
}

function formatDate(date) {
    return dateFormat(date, 'dS mmm');
}

function formatDuration(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    return h + ':' + m;
}

function formatTime(timestamp) {
    var date = new Date(timestamp);

    return date.getHours() + ':' + date.getMinutes();
}

function getFlights() {
    $.ajax({
        url: '/api/flights',
        success: function(flights) {
            $.each(flights, function(i, flight){
                console.log(flight);
                renderFlight(flight);
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

getFlights();
