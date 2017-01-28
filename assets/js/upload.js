function timestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toISOString().slice(11, 16);
}

function getTurnpoints(callback) {
    $.get('/api/turnpoints', (data) => {
        callback(data);
    });
}

function formatTask(taskArray, callback) {
    let formattedTask = '';

    getTurnpoints((turnpoints) => {
        for (let i = 0; i < taskArray.length; i++) {
            let tp = taskArray[i].substring(17).toLowerCase();

            if (Object.prototype.hasOwnProperty.call(turnpoints, tp)) {
                tp = turnpoints[tp];
            }

            if (tp.match(/\d+/g) === null && tp.trim() !== '') {
                formattedTask += `${tp} - `;
            }
        }
        callback(formattedTask.slice(0, -3));
    });
}

function populateForm(data) {
    const form = $('#add-flight-form');
    const date = new Date(data.flightDate * 1000);
    const formattedDate = date.toISOString().slice(0, 10);

    form.find('#date-field').val(formattedDate);

    if (data.headers[2]) {
        form.find('#pilot-field').val(data.headers[2].value);
    }

    if (data.headers[4]) {
        form.find('#reg-field').val(data.headers[4].value);
    }

    if (data.flightTimings !== null) {
        form.find('#takeoff-time-field').val(timestampToTime(data.flightTimings.takeoff));
        form.find('#landing-time-field').val(timestampToTime(data.flightTimings.landing));
    } else {
        form.find('#takeoff-time-field').val('');
        form.find('#landing-time-field').val('');
    }

    if (data.taskpoints.length > 0) {
        formatTask(data.taskpoints, (formattedTask) => {
            form.find('#task-field').val(formattedTask);
        });
    } else {
        form.find('#task-field').val('Local');
    }

    form.find('input, textarea, select').prop('disabled', false);
}

$('#file-upload').on('change', function(e) {
    e.preventDefault();

    if (this.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function() {
            const data = {
                trace: this.result
            };

            $.ajax({
                url: '/api/flight-info',
                type: 'POST',
                data,
                success: (response) => {
                    populateForm(response);
                },
                error: (error) => {
                    console.log(error);
                }
            });
        };

        reader.readAsText(this.files[0]);
    }
});

$('#add-flight-form').submit(function(e) {
    e.preventDefault();

    const files = $('#file-upload').get(0).files;

    if (files.length > 0) {
        const form = $(this)[0];
        const formData = new FormData(form);

        formData.append('upload[]', files[0], files[0].name);

        const date = document.getElementById('date-field').value;
        const takeoff = document.getElementById('takeoff-time-field').value;
        const landing = document.getElementById('landing-time-field').value;

        const takeoffTimestamp = new Date(`${date} ${takeoff}`).getTime();
        const landingTimestamp = new Date(`${date} ${landing}`).getTime();

        formData.append('takeoffTimestamp', takeoffTimestamp);
        formData.append('landingTimestamp', landingTimestamp);

        formData.append('pilot', $('#pilot-field option:selected').val());

        $('#add-flight-error').hide();
        $('#add-flight-success').text('Uploading...').show();

        $.ajax({
            url: '/api/flight',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (data) => {
                $('#add-flight-error').hide();
                $('#add-flight-success').text('Flight upload complete').show();
                document.getElementById('add-flight-form').reset();
            },
            error: (err) => {
                $('#add-flight-success').hide();
                $('#add-flight-error').text(JSON.stringify(err)).show();
            }
        });
    }
});
