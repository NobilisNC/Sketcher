var fs = require('fs');
var http = require('http')
var serv = http.Server(answerRequest);
var io = require('socket.io')(serv);

var port = 10053;
var verb = 2; // Can be 0: errors, 1: warnings, 2: info

var user = null;
var users = [ 3372 ]; // This is proper a database

function login(id) {
	user = id;
	if(users.indexOf(id) == -1) {
		users.push(user);
	}
}

function answerRequest(request, response) {
	var raw_cookies = request.headers.cookie.split(';');
	var cookies = {}
	raw_cookies.forEach(function(c, i) {
		c = c.split('=');
		cookies[c[0]] = c[1] || true;
	});
	if(cookies.hasOwnProperty('sketcher_token')) {
		verb == 2 && console.log('User #'+user+' presents token #'+cookies.sketcher_token);
		// Ask DB if token and user id exist
			// else > error
		response.setHeader('Location', '/');
		response.end('success');
	} else {
		response.end('error');
	}
}

io.on('connection', function(socket){
	var tmpID = parseInt(Math.random()*100000);
	user = tmpID;
	setTimeout(function() {
		console.log('timeout');
		io.emit('hello', tmpID);	// Welcome new client
		login(tmpID)				// Set tmp user ID
	}, 3000);

	verb == 2 && console.log('User with temporary id #'+tmpID+' just connected.');

	socket.on('addObject', function(data){
		// Store given object in an array
		// Save this array to DB from time to time
		// Broadcast addObject to all clients with commiting client ID included
        console.log('addObject : '+data);
    });
	socket.on('getFreshObjectsList', function(){
		// Returns a fresh version of this sketch objects
        console.log('[+] getFreshObjectsList request received.');

		console.log(http.get({
			host: 'localhost',
			port: 8000,
			path: '/8'		//!\ Hardcode
		}, function(response) {
			var body = '';
			response.on('data', function(data) {
				body += data;
			});
			response.on('end', function() {
				console.log(body);
			});
		}));

		io.emit('getFreshObjectsList', "caca");
    });

	socket.on('login', function(id) {
		id = parseInt(id);
		verb == 2 && console.log('[i] Trying to login with local id #'+id);
		if(users.indexOf(parseInt(id)) > -1) {
			verb == 2 && console.log('[i] #'+id+' is a valid id. User logged in.');
			if(users.indexOf(tmpID) > -1) {	// DEV___ This is pure shit, need pretty DB check instead
				users.splice(users.indexOf(tmpID), 1);
			}
			login(id);
			io.emit('login', 'success');
		} else {
			// Redirect client	to dashboard if logged in the website
			//					to homepage if not
			verb == 2 && console.log('Invalid id #'+id+'.');
			io.emit('login', 'error');
		}
	});

	// Not for now.
    socket.on('saveSketch', function(data){
        var file = fs.openSync('lol.png', 'w');
        var buff = new Buffer(data.data, 'base64');
        fs.write(file, buff, 0, buff.length, 0, function(err, data){
            console.log('File saved.');
        });
        console.log('Save : '+data.data);
    });

	socket.on('disconnect', function() {
		console.log('User #'+user+' disconnected.');
	});
});

serv.listen(port, function(){
    console.log('Listening on '+port+'.');
});

// Toutes les X secondes, on envoie aux clients "qui modifie le dessin à ce temps T"
