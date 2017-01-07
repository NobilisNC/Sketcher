"use strict";
var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var serv = http.Server(answerRequest);
var io = require('socket.io')(serv);
var Canvas = require('canvas');
var Image = Canvas.Image;
var Font = Canvas.Font;

require('Sketcher.js')();
eval(fs.readFileSync('node_modules/Sketcher/Tools.js')+'');

var port = 10053;
var verb = 2; // Can be 0: errors, 1: warnings, 2: info

var user = null;
var users = [ 3372 ]; // This is proper a database

function answerRequest(request, response) {
	response.setHeader('Location', '/');
	response.end('success');
}

io.on('connection', function(socket){
	let token = null;
	let width = null, height = null;
	let layers = [];

	console.log('Client has connected.');

	io.emit('whoAreYou');

	socket.on('login', function(data) {
		data = JSON.parse(data);

		http.get('http://localhost:8000/api/'+data.token, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			let error;
			if(statusCode !== 200) {
				error = new Error('Request Failed.\nStatus Code: '+statusCode);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('Invalid content-type.\nExpected application/json but received '+contentType);
			}
			if(error) {
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
		data.object = JSON.parse(data.object);

		//!\ Get proper layer to add object
		layers[0].objects.push(data.object);

		let canvas = new Canvas(width, height);
		let ctx = canvas.getContext('2d');

		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, width, height);

		layers.forEach(function(layer) {
			layer.objects.forEach(function(object) {
				Sketcher.Tools.drawFromJSON(JSON.stringify(object), ctx);
			});
		});
		let postData = querystring.stringify({
			"layers": JSON.stringify(layers),
			"image": canvas.toDataURL().substr(22)
		});

		console.log(ctx.font);

		if(	//!\ Need better sanitizing !
			Object.keys(data.object).length != 2 ||
			typeof data.object.type != 'string' ||
			typeof data.object.data != 'object'
		) {
			socket.emit('error');
			return;
		}

		http.request({
			hostname: 'localhost',
			port: 8000,
			path: '/api/'+token,
			method: 'POST',
			headers: {
			    'Content-Type': 'application/x-www-form-urlencoded',
			    'Content-Length': Buffer.byteLength(postData)
			}
		}, (res) => {
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
						console.log("Sketch updated");
						console.log(parsedData);
					} else {
						console.log("An error occured.");
					}
				} catch (e) {
					console.log(e.message);
				}
			});
		}).on('error', (e) => {
		  console.log('Got error: '+e.message);
	  }).write(postData);
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
				  console.log(parsedData);
				  width = parsedData.width;
				  height = parsedData.height;
				  layers = parsedData.layers;
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
