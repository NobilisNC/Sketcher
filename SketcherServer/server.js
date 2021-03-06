"use strict";
var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var serv = http.Server(answerRequest);
var io = require('socket.io')(serv);
var Canvas = require('canvas');
var Image = Canvas.Image;
var Font = Canvas.Font;

require('./Sketcher.js')();
eval(fs.readFileSync('Sketcher/Tools.js')+'');

var apiHost = 'localhost';
var apiPort = 8000;
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
	var layers = [];

	console.log('Client has connected.');

	function getLayer(layerName) {
		let ret;
		layers.forEach(function(layer) {
			if(layerName == layer.name) {
				ret = layer;
			}
		});

		return ret;
	}

	function updateObjects() {
		let canvas = new Canvas(width, height);
		let ctx = canvas.getContext('2d');

		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, width, height);

		layers.forEach(function(layer) {
			layer.objects.forEach(function(object) {
				let opacity = (layer.opacity != undefined ? layer.opacity/100 : 1);
				let strokeColor = object.data.stroke_color;
				let fillColor = object.data.fill_color;

				if(strokeColor)
					object.data.stroke_color = object.data.stroke_color.replace(/[\d\.]+\)/, opacity+')');
				if(fillColor)
					object.data.fill_color = object.data.fill_color.replace(/[\d\.]+\)$/, opacity+')');
				Sketcher.Tools.drawFromJSON(JSON.stringify(object), ctx);

				object.data.stroke_color = strokeColor;
				object.data.fill_color = fillColor;
			});
		});

		let postData = querystring.stringify({
			"layers": JSON.stringify(layers),
			"image": canvas.toDataURL().substr(22)
		});

		http.request({
			hostname: apiHost,
			port: apiPort,
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
				error = new Error('[!] '+token+' - Add object request FAILED.\tStatus Code: '+statusCode);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('[!] '+token+' - Invalid content-type.\tExpected application/json but received '+contentType);
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
						console.log('[+] '+token+' - Sketch updated');
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
	}

	// Returns a fresh version of this sketch objects
	function getFreshObjectsList(token) {
		if(!token) {
			return;
		}

		console.log('[+] '+token+' - getFreshObjectsList request received.');

		http.get('http://'+apiHost+':'+apiPort+'/api/'+token+'/refresh', (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
			error = new Error('[!] '+token+' - getFreshObjectsList request FAILED.\tStatus Code: '+statusCode);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('[!] '+token+' - Invalid content-type.\tExpected application/json but received '+contentType);
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
					console.log('[+] '+token+' - Sent back fresh objects');
					width = parsedData.width;
					height = parsedData.height;
					layers = parsedData.layers;

					io.sockets.emit('getFreshObjectsList', rawData);
				} catch (e) {
					console.log(e.message);
				}
			});
		}).on('error', (e) => {
			console.log('Got error: '+e.message);
		});
	}

	io.emit('whoAreYou');

	socket.on('iAm', function(data) {
		token = data;
		getFreshObjectsList(token);
	});

	socket.on('login', function(data) {
		data = JSON.parse(data);

		http.get('http://'+apiHost+':'+apiPort+'/api/'+data.token, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers['content-type'];

			let error;
			if(statusCode !== 200) {
				console.log('[!] '+token+' - Authentication FAILED.\tStatus Code: '+statusCode);
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
					} else {
						io.emit('error');
						console.log('[!] '+data.token+' - Authentication failed. IP '+socket.handshake.address.address);
					}
				} catch (e) {
					console.log(e.message);
				}
			});
		}).on('error', (e) => {
		  console.log('Got error: '+e.message);
		});
	});

	socket.on('addLayer', function(data) {
		let layer = getLayer(data.layerName);

		if(layer != undefined) {
			console.error('Layer already exists');
			return;
		}

		layers.push({
			name: data.layerName,
			objects: []
		});

		updateObjects();
	});

	socket.on('setLayerOpacity', function(data) {
		let layer = getLayer(data.layerName);

		if(layer == undefined) {
			console.error('Layer not found');
			return;
		}
		layer.opacity = data.opacity;

		updateObjects();
	});

	socket.on('addObject', function(data){
		data.object = JSON.parse(data.object);

		//!\ Get proper layer to add object
		let layer = getLayer(data.layerName);
		if(	layer == undefined ||
			Object.keys(data.object).length != 2 ||
			typeof data.object.type != 'string' ||
			typeof data.object.data != 'object'
		) {
			io.emit('error');
			return;
		}

		layer.objects.push(data.object);

		updateObjects();
    });

	socket.on('getFreshObjectsList', getFreshObjectsList.bind(this, token));

	socket.on('disconnect', function() {
		console.log('[ ] '+token+' has disconnected.');
	});
});

serv.listen(port, function(){
    console.log('Listening on '+port+'.');
});

// Toutes les X secondes, on envoie aux clients "qui modifie le dessin à ce temps T"
