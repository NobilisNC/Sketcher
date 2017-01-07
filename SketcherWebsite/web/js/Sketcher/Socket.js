Sketcher.Socket = function(host, port) {
	this.host = host || 'localhost';
	this.port = port || 10053;
	this.loginState = false;
	this.localID = window.localStorage.getItem('user_id');

	this.socket = io('http://'+this.host+':'+this.port+'/');

	this.socket.on('reconnect_error', (function() {
		this.loginState = false;
	}).bind(this));

	this.socket.on('whoAreYou', (function() {
		console.log('whoAmI ?');
		this.login();
	}).bind(this));

	this.socket.on('hello', (function() {
		console.log('Token is valid');
		this.getFreshObjectsList();
		this.loginState = true;
	}).bind(this));

	this.socket.on('getFreshObjectsList', function(objects) {
		Sketcher.data = objects;
	});
}

Sketcher.Socket.prototype.login = function() {
	console.log('Loging in.');
	this.loginState = null;
	this.socket.emit('login', JSON.stringify({
		'token': Sketcher.token
	}));
}

Sketcher.Socket.prototype.getFreshObjectsList = function() {
	console.log('Sending objects list request.');
	this.socket.emit('getFreshObjectsList');
}

Sketcher.Socket.prototype.addObject = function(name, object) {
	console.log('object added');
	console.log(object);
	this.socket.emit('addObject', {"name": name, "object": object});
}
