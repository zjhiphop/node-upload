var http = require("http");
var url = require("url");

var server = require("./index");


http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;

    console.log(pathname);

    switch (pathname) {
        case '/upload':
            server.upload(response, request);
            break;
        case '/show':
            server.show(response, request);
            break;
        case '/':
        case '/start':
            server.start(response);
            break;
    }

}).listen(8888);