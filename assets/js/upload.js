function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.toISOString().slice(11, 16);
}

function formatTask(taskArray) {
    var formattedTask = '';

    for(var i = 0; i < taskArray.length; i++) {
        var tp = taskArray[i].substring(17);

        if(tp.match(/\d+/g) === null && tp.trim() !== '') {
            formattedTask += tp + '-';
        }
    }

    return formattedTask.slice(0, -1);
}

function populateForm(data) {
    var form = $('#add-flight-form');
    var date = new Date(data.flightDate * 1000);
    var formattedDate = date.toISOString().slice(0,10);

    form.find('#pilot-field').val(data.headers[2].value);
    form.find('#reg-field').val(data.headers[4].value);
    form.find('#date-field').val(formattedDate);

    if(data.flightTimings !== null) {
        form.find('#takeoff-time-field').val(timestampToTime(data.flightTimings.takeoff));
        form.find('#landing-time-field').val(timestampToTime(data.flightTimings.landing));
    } else {
        form.find('#takeoff-time-field').val('');
        form.find('#landing-time-field').val('');
    }

    if(data.taskpoints.length > 0) {
        form.find('#task-field').val(formatTask(data.taskpoints));
    } else {
        form.find('#task-field').val('');
    }

    form.find('input, textarea').prop('disabled', false);
}

$('#file-upload').on('change', function(e) {
    e.preventDefault();

    if(this.files.length > 0) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = {
                trace: this.result
            };

            $.ajax({
                url: '/api/flight-info',
                type: 'POST',
                data: data,
                success: function(data) {
                    populateForm(data);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        };

        reader.readAsText(this.files[0]);
    }

});

$('#add-flight-form').submit(function(e) {
    e.preventDefault();

    var files = $('#file-upload').get(0).files;

    if(files.length > 0) {
        var form = $(this)[0];
        var formData = new FormData(form);

        formData.append('upload[]', files[0], files[0].name);

        $.ajax({
          url: '/api/flight',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
              $('#add-flight-success').show();
          }
        });
    }
});
