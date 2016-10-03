var http = require("http").Server();
var io = require("socket.io")(http);

var port = 3000;

io.on("connection", function(socket){
    console.log("User connected.");

    socket.on("mov", function(data){
        console.log("Movement : "+data);
    });
});

http.listen(port, function(){
    console.log("Listening on "+port+".");
});