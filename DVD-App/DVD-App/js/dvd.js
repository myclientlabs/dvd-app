var basurl = "http://dvd-library.apphb.com";

$(document).ready(function () {

    loadDVDs();

    $('#editDVD').hide();

    $('#gotoCreateButton').click(function () {

        $('#mainPage').hide();

        $('#addDVD').show();

    });

    $('#addCancel').click(function () {

        resetAll();

    });


    $('#editCancel').click(function () {

        resetAll();

    });


    $('#displayCancel').click(function () {

        resetAll();

    });

    // Add Button onclick handler
    $('#addDVDButton').click(function (event) {

        $('#adderrorMessages').empty();

        // check for errors and display any that we have
        // pass the input associated with the add form to the validation function

        if ($('#addDVDTitle').val() == "") {

            $('#adderrorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Please enter a title for the DVD.'));

            var stop = true;

        }

        var year = $('#addReleaseYear').val();

        if (year.length != 4 || isNaN(year) == true) {

            $('#adderrorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Please enter a 4-digit year.'));

            var stop = true;
        }

        if (stop == true) { return false; }

        // if we made it here, there are no errors so make the ajax call
        $.ajax({
            type: 'POST',
            url: basurl + '/dvd',
            data: JSON.stringify({
                title: $('#addDVDTitle').val(),
                releaseYear: $('#addReleaseYear').val(),
                director: $('#addDirector').val(),
                rating: $('#addRating').val(),
                notes: $('#addNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function (data, status) {
                $('#addDVD').hide();
                $('#mainPage').show();

                // clear errorMessages
                $('#errorMessages').empty();
                // Clear the form and reload the table
                $('#addDVDTitle').val('');
                $('#addReleaseYear').val('');
                $('#addDirector').val('');
                $('#addRating').val('');
                $('#addNotes').val('');
                loadDVDs();
                $('#errorMessages').empty();
            },
            error: function () {
                $('#errorMessages')
                   .append($('<li>')
                   .attr({ class: 'list-group-item list-group-item-danger' })
                   .text('Error calling web service.  Please try again later.'));
            }
        });

        loadDVDs();

    });

    // Update Button onclick handler
    $('#editDVDButton').click(function (event) {

        $('#errorMessages').empty();

        $('#editDVD').hide();
        $('#mainPage').show();

        // check for errors and display any that we have
        // pass the input associated with the edit form to the validation function
        if ($('#editDVDTitle').val() == "") {

            $('#errorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Please enter a title for the DVD.'));

            var stop = true;

        }

        var year = $('#editReleaseYear').val();

        if (year.length != 4 || isNaN(year) == true) {

            $('#errorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Please enter a 4-digit year.'));

            var stop = true;
        }

        if (stop == true) { return false; }

        // if we get to here, there were no errors, so make the Ajax call
        $.ajax({
            async: true,
            crossDomain: true,
            type: 'PUT',
            url: basurl + '/dvd/' + $('#editDVDId').val(),
            dataType: 'json',
            processData: false,
            data: JSON.stringify({
                dvdId: $('#editDVDId').val(),
                title: $('#editDVDTitle').val(),
                releaseYear: $('#editReleaseYear').val(),
                director: $('#editDirector').val(),
                rating: $('#editRating').val(),
                notes: $('#editNotes').val(),
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function () {

                loadDVDs();
                $('#errorMessages').empty();

            },
            error: function () {
                $('#errorMessages')
                   .append($('<li>')
                   .attr({ class: 'list-group-item list-group-item-danger' })
                   .text('Error calling web service.  Please try again later.'));
            }
        })
    });

    $('#searchButton').click(function () {

        clearDVDTable();

        resetAll();

        // check for errors and display any that we have
        // pass the input associated with the edit form to the validation function
        //var haveValidationErrors = checkAndDisplayValidationErrors($('#mainPage').find('input'));

        // if we have errors, bail out by returning false
        //if (haveValidationErrors) {
        //    return false;
        //}

        var choice = $('#dropDown').val();
        var term = $('#searchTerm').val();

        if (choice == "showAll") {
            var tempurl = basurl + '/dvds';
        }
        else if (choice == "searchTitle" && term != null) {
            var tempurl = basurl + '/dvds/title/' + term;
        }
        else if (choice == "searchYear" && term != null && term.length == 4 && isNaN(term) == false) {
            var tempurl = basurl + '/dvds/year/' + term;
        }
        else if (choice == "searchDirector" && term != null) {
            var tempurl = basurl + '/dvds/director/' + term;
        }
        else if (choice == "searchRating" && term != null) {
            var tempurl = basurl + '/dvds/rating/' + term;
        }
        else {
            //  error: function() {
            $('#errorMessages').append($('<li>Both Search Category and Search Term are required</li>'))
            //       .attr({class: 'list-group-item list-group-item-danger'})
            //       .text('Both Search Category and Search Term are required');
            //}
        }
        searchDVDs(tempurl);
    });
})

function loadDVDs() {
    // we need to clear the previous content so we don't append to it
    clearDVDTable();

    resetAll();

    $('#errorMessages').empty();

    // grab the the tbody element that will hold the rows of contact information
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: basurl + '/dvds',
        success: function (data, status) {
            $.each(data, function (index, dvd) {
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var id = dvd.dvdId;

                var row = '<tr>';
                row += '<td align="center" width="25%"><a onclick="displayDVD(' + id + ')">' + title + '</a></td>';
                row += '<td align="center" width="25%">' + releaseYear + '</td>';
                row += '<td align="center" width="15%">' + director + '</td>';
                row += '<td align="center" width="10%">' + rating + '</td>';
                row += '<td align="center" width="5%"><a onclick="showEditForm(' + id + ')">Edit</a></td>';
                row += '<td align="center" width="5%"><a onclick="deleteDVD(' + id + ')">Delete</a></td>';
                row += '<td width="15%"></td>';
                row += '</tr>';
                contentRows.append(row);

                $('#errorMessages').empty();
            });
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Please try again later.'));
        }

    });
}

function clearDVDTable() {
    $('#contentRows').empty();
}

// processes validation errors for the given input.  returns true if there
// are validation errors, false otherwise
function checkAndDisplayValidationErrors(input) {
    // clear displayed error message if there are any
    $('#errorMessages').empty();
    // check for HTML5 validation errors and process/display appropriately
    // a place to hold error messages
    var errorMessages = [];

    // loop through each input and check for validation errors
    input.each(function () {
        // Use the HTML5 validation API to find the validation errors
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    // put any error messages in the errorMessages div
    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}

function showEditForm(dvdId) {

    $('#errorMessages').empty();

    $('#mainPage').hide();
    $('#addDVD').hide();
    $('#displayDetail').hide();

    //clear errorMessages
    $('#errorMessages').empty();
    // get the contact details from the server and then fill and show the
    // form on success
    $.ajax({
        type: 'GET',
        url: basurl + '/dvd/' + dvdId,
        success: function (data, status) {
            $('#editDVDTitle').val(data.title);
            $('#editReleaseYear').val(data.releaseYear);
            $('#editDirector').val(data.director);
            $('#editRating').val(data.rating);
            $('#editNotes').val(data.notes);
            $('#editDVDId').val(data.dvdId);

            $('#errorMessages').empty();
        },
        error: function () {
            $('#errorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Error calling web service.  Please try again later.'));
        }
    });

    $('#editDVD').show();
}

function deleteDVD(dvdId) {

    var txt;

    var r = confirm("Are you sure you want to delete this DVD from your collection?");
    if (r == true) {

        $.ajax({
            type: 'DELETE',
            url: basurl + "/dvd/" + dvdId,
            success: function (status) {
                loadDVDs();
            }
        });

    } else {
        loadDVDs();
    }

}

function displayDVD(dvdId) {

    $('#errorMessages').empty();

    $('#mainPage').hide();
    $('#displayDetail').show();

    $.ajax({
        type: 'GET',
        url: basurl + '/dvd/' + dvdId,
        success: function (data, status) {
            $('#displayTitle').text(data.title);
            $('#displayYear').text(data.releaseYear);
            $('#displayDirector').text(data.director);
            $('#displayRating').text(data.rating);
            $('#displayNotes').text(data.notes);

            $('#errorMessages').empty();
        },
        error: function () {
            $('#errorMessages')
               .append($('<li>')
               .attr({ class: 'list-group-item list-group-item-danger' })
               .text('Error calling web service.  Please try again later.'));
        }
    });
}

function searchDVDs(tempURL) {
    // we need to clear the previous content so we don't append to it
    clearDVDTable();

    resetAll();

    $('#errorMessages').empty();

    // grab the the tbody element that will hold the rows of contact information
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: tempURL,
        success: function (data, status) {
            $.each(data, function (index, dvd) {
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var id = dvd.dvdId;

                var row = '<tr>';
                row += '<td align="center" width="25%"><a onclick="displayDVD(' + id + ')">' + title + '</a></td>';
                row += '<td align="center" width="25%">' + releaseYear + '</td>';
                row += '<td align="center" width="15%">' + director + '</td>';
                row += '<td align="center" width="10%">' + rating + '</td>';
                row += '<td align="center" width="5%"><a onclick="showEditForm(' + id + ')">Edit</a></td>';
                row += '<td align="center" width="5%"><a onclick="deleteDVD(' + id + ')">Delete</a></td>';
                row += '<td width="15%"></td>';
                row += '</tr>';
                contentRows.append(row);

                $('#errorMessages').empty();
            });
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Both Search Category and Search Term are required.'));
        }

    });
}

function resetAll() {

    $('#mainPage').show();
    $('#addDVD').hide();
    $('#editDVD').hide();
    $('#displayDetail').hide();
    $('#errorMessages').empty();

}

function checkAndDisplayValidationErrors(input) {
    // clear displayed error message if there are any
    $('#errorMessages').empty();
    // check for HTML5 validation errors and process/display appropriately
    // a place to hold error messages
    var errorMessages = [];

    // loop through each input and check for validation errors
    input.each(function () {
        // Use the HTML5 validation API to find the validation errors
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    // put any error messages in the errorMessages div
    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}
