Sketcher.Socket = function(host, port) {
	this.host = host || 'localhost';
	this.port = port || 10053;
	this.loginState = 'disconnected';
	this.localID = window.localStorage.getItem('user_id');

	this.socket = io('http://'+this.host+':'+this.port+'/');

	this.socket.on('login', function(response) {
		this.loginState = (response == 'error' ? 'dis' : '')+'connected';
	});

	this.socket.on('hello', function(id) {
		console.log('Received id #'+id);
		if(!login()) {
			window.localStorage.setItem('user_id', id);
		}
	});

	this.socket.on('getFreshObjectsList', function(objects) {
		console.log('Received fresh objects '+objects);
	});

	function _login() {
		if(this.localID != null) {
			this.socket.emit('login', this.localID);
			this.state = 'waitForLogin';
			return true;
		} else {
			return false;
		}
	}

	var login = _login.bind(this);
}

Sketcher.Socket.prototype.getFreshObjectsList = function() {
	console.log('Sending objects list request.');
	this.socket.emit('getFreshObjectsList');
}

Sketcher.Socket.prototype.addObject = function() {
	console.log('object added');
	this.socket.emit('addObject', JSON.stringify({'leaule': 'prout'}));
}
