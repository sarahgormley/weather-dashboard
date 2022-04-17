var apiKey = "74b589766e2c1c1f69016c5e5740ff80";
requestUrl = '';

fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    });