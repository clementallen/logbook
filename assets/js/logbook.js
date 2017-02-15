function formatDuration(sec) {
    const minutes = Math.floor(sec / 60);
    const hours = Math.round(Math.floor(sec / 3600), 2);
    const remainingMinutes = minutes - (hours * 60);
    const formattedMinutes = (remainingMinutes <= 9 ? '0' : '') + remainingMinutes;

    return `${hours}:${formattedMinutes}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toISOString().substr(11, 5);
}

function renderFlight(template, flight) {
    flight.date = dateFormat(flight.date, 'dS mmm');
    flight.duration = formatDuration(flight.duration);
    flight.takeoffTime = formatTime(flight.takeoffTime);
    flight.landingTime = formatTime(flight.landingTime);
    flight.noTrace = (flight.fileName === 'no-trace-available.igc');

    $(`#${flight.year} .logbook-entries`).append(Mustache.render(template, flight));
}

function renderStats(template, stats, year = 'stats') {
    stats.totalDuration = formatDuration(stats.totalDuration);
    stats.averageDuration = formatDuration(stats.averageDuration);
    stats.averageDistance = Math.round(stats.averageDistance);
    stats.pilot = stats.pilot ? stats.pilot : 'Total';

    const renderedTemplate = Mustache.render(template, stats);

    $(`#${year} .stat-entries`).append(renderedTemplate);
}

function getTemplate(name) {
    return $(`#${name}-template`).html();
}

function renderError(error, selector) {
    const template = getTemplate('error');
    const renderedTemplate = Mustache.render(template, error);
    $(selector).html(renderedTemplate);
}

function sort(a, b, value) {
    if (a[value] < b[value]) {
        return -1;
    } else if (a[value] > b[value]) {
        return 1;
    }

    return 0;
}

function getFlights() {
    $.ajax({
        url: '/api/flights',
        success: (flights) => {
            flights.sort((a, b) => {
                return sort(a, b, 'date');
            });
            const template = getTemplate('flight');
            $.each(flights, (i, flight) => {
                renderFlight(template, flight);
            });
            $('.logbook-table').fadeIn();
        },
        error: (error) => {
            const errorToDisplay = {
                message: 'Unable to load flights, please try again'
            };
            renderError(errorToDisplay, '.logbook-flights');
        }
    });
}

function getStats() {
    $.ajax({
        url: '/api/stats',
        success: (stats) => {
            const template = getTemplate('stat');
            stats[0].pilots.sort((a, b) => {
                return sort(a, b, 'pilot');
            });
            $.each(stats[0].pilots, (i, statistics) => {
                renderStats(template, statistics);
            });
            renderStats(template, stats[0]);
            $('.stats-table').fadeIn();
        },
        error: (error) => {
            const errorToDisplay = {
                message: 'Unable to load stats, please try again'
            };
            renderError(errorToDisplay, '#stats');
        }
    });
}

function getAnnualStats() {
    const years = [];
    const template = getTemplate('stat');

    for (let i = new Date().getFullYear(); i >= 2014; i--) {
        years.push(i);
    }

    $.each(years, (i) => {
        const currentYear = years[i];
        $.ajax({
            url: `/api/stats/${currentYear}`,
            success: (stats) => {
                stats[0].pilots.sort((a, b) => {
                    return sort(a, b, 'pilot');
                });
                $.each(stats[0].pilots, (j, statistics) => {
                    renderStats(template, statistics, currentYear);
                });
                renderStats(template, stats[0], currentYear);
                $(`#${currentYear} .stats-table`).fadeIn();
            },
            error: (error) => {
                const errorToDisplay = {
                    message: 'Unable to load stats, please try again'
                };
                renderError(errorToDisplay, `#${currentYear} .stats-container`);
            }
        });
    });
}

if (window.location.pathname === '/') {
    getFlights();
    getAnnualStats();
    getStats();
}
