/*
/	A color ...
*/
Sketcher.Color = function(r, g, b, a) {
	this.r = parseInt(r);
	this.g = parseInt(g);
	this.b = parseInt(b);
	this.a = parseInt(a);

	function pad(n, w) {
		w = w || 2;
		return (w <= n.length ? n : '0'.repeat(w-n.length)+n);
	}

	this.getHex = function(alpha = false) {
		return '#'
			+pad(this.r.toString(16))
			+pad(this.g.toString(16))
			+pad(this.b.toString(16))
			+(alpha ? pad((this.a*255).toString(16)) : '');
	}

	this.getRGBA = function() {
		return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
	}

	this.getRGBa = function() {
		return 'rgba('+this.r+','+this.g+','+this.b+','+this.a/255+')';
	}

	this.getAlpha = function() {
		return this.a/255;
	}

	return {
		r: this.r,
		g: this.g,
		b: this.b,
		a: this.a,
		hex: this.getHex(),
		getHex: this.getHex.bind(this),
		getRGBA: this.getRGBA.bind(this),
		getRGBa: this.getRGBa.bind(this),
		getAlpha: this.getAlpha.bind(this)
	}
};

Sketcher.ColorFromString = function(raw) {
	if(raw == null) {
		return undefined;
	}

	var r, g, b, a;
	if(raw.match(/#([0-9a-f]{6}|[\da-f]{8})/i)) { // #RRGGBB[AA]
		r = parseInt(raw.slice(1,3), 16);
		g = parseInt(raw.slice(3,5), 16);
		b = parseInt(raw.slice(5,7), 16);
		a = raw.length == 10 ? 255/parseInt(raw.slice(7,9), 16) : 255;
	} else if(raw.match(/rgba?\(\d{1,3},\d{1,3},\d{1,3}(,\d(\.\d+)?\))?/i)) { // rgb[a](RRR, GGG, BBB, A)
		raw = raw.slice(raw.indexOf('(')+1);
		raw = raw.slice(0, raw.length-1);
		raw = raw.split(',');

		r = parseInt(raw[0]);
		g = parseInt(raw[1]);
		b = parseInt(raw[2]);
		a = raw[3] ? parseInt(raw[3]) : 255;
	} else {
		console.error('Invalid parameters.');
		return null;
	}

	return Sketcher.Color.call(this, r, g, b, a);
};

Sketcher.Colors = {
	white: new Sketcher.ColorFromString('#ffffff'),
	black: new Sketcher.ColorFromString('#000000'),
	red: new Sketcher.ColorFromString('#ff0000'),
	green: new Sketcher.ColorFromString('#00ff00'),
	blue: new Sketcher.ColorFromString('#0000ff'),
	orange: new Sketcher.ColorFromString('#ffb603'),
	lightblue: new Sketcher.ColorFromString('#a6f7ff'),
	lightgreen: new Sketcher.ColorFromString('#7abf30'),
	pink: new Sketcher.ColorFromString('#f70e93'),
	purple: new Sketcher.ColorFromString('#ae22f6')
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
