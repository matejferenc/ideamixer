function load2words() {
        $.getJSON("idea/generate", {}, function (data, status) {
                $("#word1").text(data[0]);
                $("#word2").text(data[1]);
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
