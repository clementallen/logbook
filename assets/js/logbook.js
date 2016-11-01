function renderFlight(template, flight) {
    flight.date = formatDate(flight.date);
    flight.duration = formatDuration(flight.duration);
    flight.takeoffTime = formatTime(flight.takeoffTime);
    flight.landingTime = formatTime(flight.landingTime);
    $('.logbook-container').append(Mustache.render(template, flight));
}

function getTemplate(callback) {
    $.get('/templates/flight.html', function(template) {
        callback($(template).filter('#flight-template').html());
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
            getTemplate(function(template) {
                $.each(flights, function(i, flight){
                    renderFlight(template, flight);
                });
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

getFlights();
