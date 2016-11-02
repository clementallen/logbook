function renderFlight(template, flight) {
    flight.date = formatDate(flight.date);
    flight.duration = formatDuration(flight.duration);
    flight.takeoffTime = formatTime(flight.takeoffTime);
    flight.landingTime = formatTime(flight.landingTime);
    $('#' + flight.year + ' .logbook-entries').append(Mustache.render(template, flight));
}

function renderStats(template, stats) {
    stats.totalDuration = formatDuration(stats.totalDuration);
    stats.averageDuration = formatDuration(stats.averageDuration);
    stats.averageDistance = Math.round(stats.averageDistance);
    $('.stat-entries').append(Mustache.render(template, stats));
}

function getTemplate(name, callback) {
    $.get('/templates/' + name + '.html', function(template) {
        callback($(template).filter('#' + name + '-template').html());
    });
}

function formatDate(date) {
    return dateFormat(date, 'dS mmm');
}

function formatDuration(d) {
    var date = new Date(null);
    date.setSeconds(d);
    return date.toISOString().substr(11, 5);
}

function formatTime(timestamp) {
    var date = new Date(timestamp);

    return date.toISOString().substr(11, 5);
}

function getFlights() {
    $.ajax({
        url: '/api/flights',
        success: function(flights) {
            getTemplate('flight', function(template) {
                $.each(flights, function(i, flight){
                    renderFlight(template, flight);
                });
                $('.logbook-table').fadeIn();
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getStats() {
    $.ajax({
        url: '/api/stats',
        success: function(stats) {
            getTemplate('stat', function(template) {
                $.each(stats[0].pilots, function(i, stats) {
                    renderStats(template, stats);
                });
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

getFlights();

getStats();
