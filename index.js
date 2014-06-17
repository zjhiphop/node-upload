var requestHandler = {},
    url = require("url"),
    qs = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    mime = require("mime");


requestHandler.start = function(response) {
    var body = "<html>\n" +
        "<head>\n" +
        "\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n" +
        "\t<title>Welcome to the nodejs tutorial</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "\t<form action=\"/upload\" method=\"post\" enctype=\"multipart/form-data\">\n" +
        "\t\t<input type=\"file\" name=\"upload\" />\n" + "\t\t<input type=\"submit\" value=\"Upload File\" />\n" +
        "\t</form>\n" +
        "</body>\n" +
        "</html>\n";

    console.log("Request for 'start' is called.");

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.end(body);
};

requestHandler.upload = function(response, request) {
    console.log("Request for 'upload' is called.");

    var form = new formidable.IncomingForm();

    console.log("Preparing upload");


    form.parse(request, function(error, fields, files) {
        console.log("Completed Parsing");

        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.end("CRAP! " + error + "\n");
            return;
        }

        var file = (files.image || files.upload); // if request from http-nest-proxy, only exists files.image

        fs.renameSync(file.path, "/tmp/" + file.name);

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image <br />");
        response.end("<img src='/show?i=" + file.name + "' />");

    });
};

requestHandler.show = function(response, request) {
    console.log("Request handler 'show' was called. ");

    var image = qs.parse(url.parse(request.url).query).i;

    if (!image) {
        response.writeHead(500, {
            "Content-Type": "text/plain"
        });
        response.end(" No Image in QueryString ");
        return;
    }

    fs.readFile("/tmp/" + image, "binary", function(error, file) {
        var type = "";

        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.end(error + "\n");
            return;
        }

        type = mime.lookup(file);

        response.writeHead(200, {
            "Content-Type": type
        });
        response.end(file, "binary");

    });
};


exports.start = requestHandler.start;
exports.upload = requestHandler.upload;
exports.show = requestHandler.show;