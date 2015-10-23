var http = require("http");

var server = http.createServer(function(request, response) {	

    if (request.method == "POST"){
        request.on("data", function(jsonBody){
            var parsedBody = JSON.parse(jsonBody);
            console.log(parsedBody);
            response.writeHead(200, {
                "Content-Type": "application/json",
				"Access-Control-Allow-Origin" : '*',
                "Access-Control-Expose-Headers": "http://127.0.0.1:9000",
                "Content-Language":"utf-8"
            });
            response.write(JSON.stringify(parsedBody));
            response.end();
        });
    }

});

server.listen(9000);
console.log("Server is listening");
