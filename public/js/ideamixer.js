var words = [];

function load2words() {
        $.getJSON("idea/generate", {}, function (data, status) {
                words = data;
                $("#word1").text(data[0]);
                $("#word2").text(data[1]);
                logGenerate2();
        });
}

function rate(rating) {
    $.postJSON("idea/rate", {rating: rating, words: words}, function() {
        logRating(words[0] + ", " + words[1], (rating == 'GOOD') ? 1 : 0);
        load2words();
    });
}

$.getJSON = function(url, requestData, callback) {
    return $.ajax({
        'type': 'GET',
        'url': url,
        'contentType': 'application/json',
        'data': requestData,
        'success': callback,
        headers: {
            'Accept': 'application/json'
        }
    });
};

$.postJSON = function(url, data, callback) {
    return $.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/x-www-form-urlencoded',
        'data': data,
        'dataType': 'text',
        'success': callback,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};