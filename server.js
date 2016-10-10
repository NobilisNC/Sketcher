var fs = require("fs");
var http = require("http").Server();
var io = require("socket.io")(http);

var port = 3000;

io.on("connection", function(socket){
    console.log("User connected.");

    socket.on("mov", function(data){
        console.log("Movement : "+data);
    });

    socket.on("sav", function(data){
        var file = fs.openSync('lol.png', 'w');
        var buff = new Buffer(data.data, 'base64');
        fs.write(file, buff, 0, buff.length, 0, function(err, data){
            console.log("File saved.");
        });
        console.log("Save : "+data.data);
    });
});

http.listen(port, function(){
    console.log("Listening on "+port+".");
});

// Tous les X secondes, on envoie aux clients "qui modifie le dessin à ce temps T"
