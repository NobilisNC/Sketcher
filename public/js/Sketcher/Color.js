/*
/	A color ...
*/
Sketcher.Color = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;

	this.getHex = function(){
		return '#'+this.r.toString(16)+this.g.toString(16)+this.b.toString(16)+(this.a*255).toString(16);
	}

	this.getRGBA = function() {
		return 'rgba('+this.r+', '+this.g+', '+this.b+', '+this.a+')';
	}
};

Sketcher.ColorFromString = function(raw) {
	if(raw.match(/#([0-9a-f]{6}|[\da-f]{8})/i)) { // #RRGGBB[AA]
		var r = parseInt(raw.slice(1,3), 16);
		var g = parseInt(raw.slice(3,5), 16);
		var b = parseInt(raw.slice(5,7), 16);
		var a = raw.length == 10 ? parseInt(raw.slice(7,9), 16) : 1;
	} else if(raw.match(/rgba?\(\d{1,3}, ?\d{1,3}, ?\d{1,3}(, ?\d(\.\d+)?\))?/i)) { // rgb[a](RRR, GGG, BBB, A)
		raw = raw.slice(raw.indexOf('(')+1);
		raw = raw.slice(0, raw.length-1);
		raw = raw.split(', ');

		var r = parseInt(raw[0]);
		var g = parseInt(raw[1]);
		var b = parseInt(raw[2]);
		var a = raw.length == 4 ? parseFloat(raw[3]) : 1;
	} else {
		console.error('Invalid parameters.');
		return null;
	}

	Sketcher.Color.call(this, r, g, b, a);
};

Sketcher.Colors = {
	white: Sketcher.ColorFromString('#ffffff'),
	black: Sketcher.ColorFromString('#000000'),
	red: Sketcher.ColorFromString('#ff0000'),
	green: Sketcher.ColorFromString('#00ff00'),
	blue: Sketcher.ColorFromString('#0000ff'),
	orange: Sketcher.ColorFromString('#ffb603'),
	lightblue: Sketcher.ColorFromString('#a6f7ff'),
	lightgreen: Sketcher.ColorFromString('#7abf30'),
	pink: Sketcher.ColorFromString('#f70e93'),
	purple: Sketcher.ColorFromString('#ae22f6')
};
