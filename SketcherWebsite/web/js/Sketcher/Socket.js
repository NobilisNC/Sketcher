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
		console.log('[+] Received whoAreYou request');
		if(this.loginState === false)
			this.login();
		else
			this.socket.emit('iAm', Sketcher.token);
	}).bind(this));

	this.socket.on('hello', (function() {
		console.log('[+] Token is valid');
		this.getFreshObjectsList();
		this.loginState = true;
	}).bind(this));

	this.socket.on('getFreshObjectsList', function(objects) {
		Sketcher.data = objects;
		console.log('[+] got fresh objects');
	});

	this.socket.on('error', function(objects) {
		console.error('[!] An error occurred');
	});
}

Sketcher.Socket.prototype.login = function() {
	console.log('[+] Loging in');
	this.loginState = null;
	this.socket.emit('login', JSON.stringify({
		'token': Sketcher.token
	}));
}

Sketcher.Socket.prototype.getFreshObjectsList = function() {
	console.log('[+] Sending fresh objects request');
	this.socket.emit('getFreshObjectsList');
}

Sketcher.Socket.prototype.addLayer = function(layerName, opacity = 1) {
	console.log('[+] Layer added');
	this.socket.emit('addLayer', {"layerName": layerName, "opacity": opacity});
}

Sketcher.Socket.prototype.setLayerOpacity = function(layerName, opacity = 100) {
	console.log('[+] Layer opacity set');
	this.socket.emit('setLayerOpacity', {"layerName": layerName, "opacity": opacity});
}

Sketcher.Socket.prototype.addObject = function(layerName, object) {
	console.log('[+] Object added');
	this.socket.emit('addObject', {"layerName": layerName, "object": object});
}
