Sketcher.Socket = function(host, port) {
	this.host = host || 'localhost';
	this.port = port || 10053;
	this.loginState = 'disconnected';
	this.localID = window.localStorage.getItem('user_id');

	this.socket = io('http://'+this.host+':'+this.port+'/');

	this.socket.on('hello', function() {
		console.log('Token is valid.');
	});

	this.socket.on('getFreshObjectsList', function(objects) {
		Sketcher.data = objects;
		console.log('Received fresh objects '+objects);
	});
}

Sketcher.Socket.prototype.login = function() {
	console.log('Loging in.');
	this.socket.emit('login', JSON.stringify({
		'token': Sketcher.token
	}));
}

Sketcher.Socket.prototype.getFreshObjectsList = function() {
	console.log('Sending objects list request.');
	this.socket.emit('getFreshObjectsList');
}

Sketcher.Socket.prototype.addObject = function() {
	console.log('object added');
	this.socket.emit('addObject', JSON.stringify({'leaule': 'prout'}));
}
