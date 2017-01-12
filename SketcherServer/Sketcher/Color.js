function pad(n, w) {
	w = w || 2;
	return (w <= n.length ? n : '0'.repeat(w-n.length)+n);
}

Sketcher.Color = function(r, g, b, a) {
	this.r = parseInt(r);
	this.g = parseInt(g);
	this.b = parseInt(b);
	this.a = parseInt(a);
}

Sketcher.Color.prototype.getHex = function(alpha = false) {
	return '#'
		+pad(this.r.toString(16))
		+pad(this.g.toString(16))
		+pad(this.b.toString(16))
		+(alpha ? pad((this.a*255).toString(16)) : '');
}

Sketcher.Color.prototype.getRGBA = function() {
	return 'rgba('+this.r+', '+this.g+', '+this.b+', '+this.a+')';
}

Sketcher.Color.prototype.getRGBa = function() {
	return 'rgba('+this.r+', '+this.g+', '+this.b+', '+this.a/255+')';
}

Sketcher.Color.prototype.getAlpha = function() {
	return this.a/255;
}


Sketcher.ColorFromString = function(raw) {
	if(raw == null) {
		return null;
	}

	var r, g, b, a;
	if(raw.match(/#([0-9a-f]{6}|[\da-f]{8})/i)) { // #RRGGBB[AA]
		r = parseInt(raw.slice(1,3), 16);
		g = parseInt(raw.slice(3,5), 16);
		b = parseInt(raw.slice(5,7), 16);
		a = raw.length == 10 ? 255/parseInt(raw.slice(7,9), 16) : 255;
	} else if(raw.match(/rgba?\(\d{1,3}, ?\d{1,3}, ?\d{1,3}(, ?\d(\.\d+)?\))?/i)) { // rgb[a](RRR, GGG, BBB, A)
		raw = raw.slice(raw.indexOf('(')+1);
		raw = raw.slice(0, raw.length-1);
		raw = raw.split(',');

		r = parseInt(raw[0]);
		g = parseInt(raw[1]);
		b = parseInt(raw[2]);
		a = raw[3] ? (parseInt(raw[3]) == 0 ? parseFloat(raw[3])*255 : parseInt(raw[3])) : 255;
	} else {
		console.error('Invalid parameters.');
		return null;
	}

	Sketcher.Color.call(this, r, g, b, a);
};

Sketcher.ColorFromString.prototype = Object.create(Sketcher.Color.prototype);
Sketcher.ColorFromString.constructor = Sketcher.ColorFromString;

Sketcher.Colors = {
	white: new Sketcher.ColorFromString('#ffffff'),
	black: new Sketcher.ColorFromString('#000000'),
	red: new Sketcher.ColorFromString('#ff0000'),
	green: new Sketcher.ColorFromString('#00ff00'),
	blue: new Sketcher.ColorFromString('#0000ff'),
};

Sketcher.color = {
	foreground: Sketcher.Colors.black,
	background: Sketcher.Colors.white,
};

if(window.localStorage.getItem('foreground')) {
	Sketcher.color.foreground = new Sketcher.ColorFromString(window.localStorage.getItem('foreground'));
}
if(window.localStorage.getItem('background')) {
	Sketcher.color.background = new Sketcher.ColorFromString(window.localStorage.getItem('background'));
}
