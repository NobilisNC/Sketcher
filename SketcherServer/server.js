"use strict";
var fs = require('fs');
var http = require('http')
var serv = http.Server(answerRequest);
var io = require('socket.io')(serv);

var port = 10053;
var verb = 2; // Can be 0: errors, 1: warnings, 2: info

var user = null;
var users = [ 3372 ]; // This is proper a database

function answerRequest(request, response) {
	response.setHeader('Location', '/');
	response.end('success');
}

io.on('connection', function(socket){
	var token = null;

	socket.on('login', function(data) {
		data = JSON.parse(data);

		http.get('http://localhost:8000/api/'+data.token, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
				error = new Error('Request Failed.\nStatus Code: '+statusCode);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('Invalid content-type.\nExpected application/json but received '+contentType);
			}
			if (error) {
				console.log(error.message);
				res.resume();
				return;
			}

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				try {
					let parsedData = JSON.parse(rawData);
					if(parsedData.status == 'success') {
						token = data.token;
						io.emit('hello');
					}
				} catch (e) {
					console.log(e.message);
				}
			});
		}).on('error', (e) => {
		  console.log('Got error: '+e.message);
		});
	});

	socket.on('addObject', function(data){
		// Store given object in an array
		// Save this array to DB from time to time
		// Broadcast addObject to all clients with commiting client ID included
        console.log('addObject : '+data);
    });

	socket.on('getFreshObjectsList', function(){
		// Returns a fresh version of this sketch objects
        console.log('[+] getFreshObjectsList request received.');

		http.get('http://localhost:8000/api/'+token+'/refresh', (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
			error = new Error('getFreshObjectsList request Failed.\nStatus Code: '+statusCode);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('Invalid content-type.\nExpected application/json but received '+contentType);
			}
			if (error) {
				console.log(error.message);
				res.resume();
				return;
			}

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				try {
				  let parsedData = JSON.parse(rawData);
				  io.emit('getFreshObjectsList', rawData);
				} catch (e) {
				  console.log(e.message);
				}
			});
		}).on('error', (e) => {
		  console.log('Got error: '+e.message);
		});
    });

    socket.on('saveSketch', function(data){
        var file = fs.openSync('lol.png', 'w');
        var buff = new Buffer(data.data, 'base64');
        fs.write(file, buff, 0, buff.length, 0, function(err, data){
            console.log('File saved.');
        });
        console.log('Save : '+data.data);
    });

	socket.on('disconnect', function() {
		console.log(token+' has disconnected.');
	});
});

serv.listen(port, function(){
    console.log('Listening on '+port+'.');
});

// Toutes les X secondes, on envoie aux clients "qui modifie le dessin à ce temps T"
