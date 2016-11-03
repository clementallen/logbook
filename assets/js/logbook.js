function renderFlight(template, flight) {
    flight.date = formatDate(flight.date);
    flight.duration = formatDuration(flight.duration);
    flight.takeoffTime = formatTime(flight.takeoffTime);
    flight.landingTime = formatTime(flight.landingTime);
    flight.distance += ' km';

    if(flight.fileName == 'no-trace-available.igc') {
        flight.noTrace = true;
    } else {
        flight.noTrace = false;
    }

    $('#' + flight.year + ' .logbook-entries').append(Mustache.render(template, flight));
}

function renderStats(template, stats, year) {
    stats.totalDistance += ' km';
    stats.totalDuration = formatDuration(stats.totalDuration);
    stats.averageDuration = formatDuration(stats.averageDuration);
    stats.averageDistance = Math.round(stats.averageDistance) + ' km';

    if(!stats.pilot) {
        stats.pilot = 'Total';
    }

    if(year) {
        $('#' + year + ' .stat-entries').append(Mustache.render(template, stats));
    } else {
        $('#stats .stat-entries').append(Mustache.render(template, stats));
    }
}

function getTemplate(name, callback) {
    $.get('/templates/' + name + '.html', function(template) {
        callback($(template).filter('#' + name + '-template').html());
    });
}

function formatDate(date) {
    return dateFormat(date, 'dS mmm');
}

function formatDuration(sec) {
    var minutes = Math.floor(sec / 60);
    var hours = Math.round(Math.floor(sec / 3600), 2);

    var remainingMinutes = minutes - (hours * 60);

    var formattedMinutes = (remainingMinutes <= 9 ? '0' : '') + remainingMinutes;

    return hours + ':' + formattedMinutes;
}

function formatTime(timestamp) {
    var date = new Date(timestamp);

    return date.toISOString().substr(11, 5);
}

function compare(a, b) {
    if (a.date < b.date) {
        return -1;

    } else if(a.date > b.date) {
        return 1;
    }

    return 0;
}

function orderPilots(a, b) {
    return b.pilot < a.pilot ?  1
         : b.pilot > a.pilot ? -1
         : 0;
}

function getFlights() {
    $.ajax({
        url: '/api/flights',
        success: function(flights) {
            flights.sort(compare);
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
                stats[0].pilots.sort(orderPilots);
                $.each(stats[0].pilots, function(i, stats) {
                    renderStats(template, stats);
                });
                renderStats(template, stats[0]);
                $('.stats-table').fadeIn();
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getAnnualStats() {
    var years = [2014, 2015, 2016];

    getTemplate('stat', function(template) {
        $.each(years, function(i, stats) {
            var currentYear = years[i];
            $.ajax({
                url: '/api/stats/' + currentYear,
                success: function(stats) {
                    stats[0].pilots.sort(orderPilots);
                    $.each(stats[0].pilots, function(i, stats) {
                        renderStats(template, stats, currentYear);
                    });
                    renderStats(template, stats[0], currentYear);
                    $('#' + currentYear + ' .stats-table').fadeIn();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    });
}

getFlights();

getAnnualStats();

getStats();
