function formatDuration(sec) {
    const minutes = Math.floor(sec / 60);
    const hours = Math.round(Math.floor(sec / 3600), 2);
    const remainingMinutes = minutes - (hours * 60);
    const formattedMinutes = (remainingMinutes <= 9 ? '0' : '') + remainingMinutes;

    return `${hours}:${formattedMinutes}`;
}

function formatDate(date) {
    return dateFormat(date, 'dS mmm');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toISOString().substr(11, 5);
}

function renderFlight(template, flight) {
    flight.date = formatDate(flight.date);
    flight.duration = formatDuration(flight.duration);
    flight.takeoffTime = formatTime(flight.takeoffTime);
    flight.landingTime = formatTime(flight.landingTime);
    flight.distance += ' km';

    if (flight.fileName === 'no-trace-available.igc') {
        flight.noTrace = true;
    } else {
        flight.noTrace = false;
    }

    $(`#${flight.year} .logbook-entries`).append(Mustache.render(template, flight));
}

function renderStats(template, stats, year) {
    stats.totalDistance += ' km';
    stats.totalDuration = formatDuration(stats.totalDuration);
    stats.averageDuration = formatDuration(stats.averageDuration);
    stats.averageDistance = `${Math.round(stats.averageDistance)} km`;

    if (!stats.pilot) {
        stats.pilot = 'Total';
    }

    if (year) {
        $(`#${year} .stat-entries`).append(Mustache.render(template, stats));
    } else {
        $('#stats .stat-entries').append(Mustache.render(template, stats));
    }
}

function getTemplate(name, callback) {
    $.get(`/templates/${name}.html`, (template) => {
        callback($(template).filter(`#${name}-template`).html());
    });
}

function compare(a, b) {
    if (a.date < b.date) {
        return -1;
    } else if (a.date > b.date) {
        return 1;
    }

    return 0;
}

function orderPilots(a, b) {
    if (b.pilot < a.pilot) {
        return 1;
    } else if (a.pilot < b.pilot) {
        return -1;
    }
    return 0;
}

function getFlights() {
    $.ajax({
        url: '/api/flights',
        success: (flights) => {
            flights.sort(compare);
            getTemplate('flight', (template) => {
                $.each(flights, (i, flight) => {
                    renderFlight(template, flight);
                });
                $('.logbook-table').fadeIn();
            });
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function getStats() {
    $.ajax({
        url: '/api/stats',
        success: (stats) => {
            getTemplate('stat', (template) => {
                stats[0].pilots.sort(orderPilots);
                $.each(stats[0].pilots, (i, statistics) => {
                    renderStats(template, statistics);
                });
                renderStats(template, stats[0]);
                $('.stats-table').fadeIn();
            });
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function getAnnualStats() {
    const years = [2014, 2015, 2016, 2017];

    getTemplate('stat', (template) => {
        $.each(years, (i) => {
            const currentYear = years[i];
            $.ajax({
                url: `/api/stats/${currentYear}`,
                success: (stats) => {
                    stats[0].pilots.sort(orderPilots);
                    $.each(stats[0].pilots, (j, statistics) => {
                        renderStats(template, statistics, currentYear);
                    });
                    renderStats(template, stats[0], currentYear);
                    $(`#${currentYear} .stats-table`).fadeIn();
                },
                error: (error) => {
                    console.log(error);
                }
            });
        });
    });
}

if (window.location.pathname === '/') {
    getFlights();
    getAnnualStats();
    getStats();
}
