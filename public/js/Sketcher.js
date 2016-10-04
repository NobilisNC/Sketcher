class Layer {
	constructor(name, zIndex, width, height, frame) {
		this.id = Math.round(Math.random()*1000000)%1000000;
		this.name = name;
		this.zIndex = zIndex;
		this.node = document.createElement('canvas');
		this.node.setAttribute('id', 'sk_layer_'+this.id);
		frame.appendChild(this.node);
		this.visible = true;
		this.width = width;
		this.height = height;
		this.node.width = this.width;
		this.node.height = this.height;
		this.opacity = 1;

		this.update();
	}

	update() {
		this.node.style.display = this.visible ? 'block' : 'none';
		this.node.style.zIndex = this.zIndex;
	}

	toggleVisibility() {
		this.visible = this.visible ? false : true;
		this.update();
	}

	setVisibility(visibility) {
		this.visible = visibility;
		this.update();
	}

	isVisible() {
		return this.visible;
	}
}

var Color = {
	white: "#fff",
	black: "#000",
	red: "#f00",
	green: "#0f0",
	blue: "#00f",
	orange: "#ffb603",
	lightblue: "#a6f7ff",
	lightgreen: "#7abf30",
	pink: "#f70e93",
	purple: "#ae22f6"
};



var Sketcher = function() {
	this.frame = document.querySelector("div#sketcher");
	this.layers = [];
	this.selectedLayer;
	this.clicked = false;
	this.pos = {x:0, y:0};
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.color = Color.red;

	this.frame.style.width = this.width+"px";
	this.frame.style.height = this.height+"px";

	this.frame.addEventListener("mouseup", this.onMouseUp.bind(this));
	this.frame.addEventListener("mousedown", this.onMouseDown.bind(this));

	this.addLayer("trackpad", 100);
	this.addLayer("background");
}

Sketcher.prototype.onMouseUp = function(e) {
	this.frame.removeEventListener("mousemove", this.onMouseMove);

	this.clear(this.getContext(this.layers[0].id));

	if(this.clicked) {
		var ctx = this.getContext(this.selectedLayer);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.closePath();
		ctx.stroke();
	}

	this.clicked = false;
};

Sketcher.prototype.onMouseDown = function(e) {
	if(e.buttons == 1 && e.button == 0 && !this.clicked) {
		this.clicked = true;
		this.pos = {x:e.offsetX, y:e.offsetY};
		frame.addEventListener("mousemove", this.onMouseMove.bind(this));
	}
}

Sketcher.prototype.onMouseMove = function(e) {
	if(e.offsetX < 0 || e.offsetY < 0 ||  e.offsetX > this.width || e.offsetY > this.height || !this.clicked) {
		this.onMouseUp(null);
	} else {
		var ctx = this.getContext(this.layers[0].id);
		this.clear(ctx);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.closePath();
		ctx.stroke();
	}
}

Sketcher.prototype.clear = function(ctx) {
	ctx.clearRect(0, 0, this.width, this.height);
}

Sketcher.prototype.getLayer = function(id) {
	var ret = null;

	this.layers.forEach(function(layer) {
		if(layer.id == id) {
			ret = layer;
		}
	});

	return ret;
}

Sketcher.prototype.getLayerOnLevel = function(n) {
	var ret = null;

	this.layers.forEach(function(layer) {
		if(layer.zIndex == n) {
			ret = layer;
		}
	});

	return ret;
}

Sketcher.prototype.countLayers = function() {
	var c = 0;

	this.layers.forEach(function() {
		c++;
	});

	return c;
}

Sketcher.prototype.getLayers = function() {
	if(this.countLayers() == 1) {
		return [];
	}

	var ret = [];

	var lvl = 1;
	var layer;
	while(ret.length < this.countLayers()-1) {
		layer = this.getLayerOnLevel(lvl++);
		if(layer != null)
			ret.push(layer);
	}

	return ret.reverse();
}

Sketcher.prototype.getContext = function(id) {
	return this.getLayer(id).node.getContext("2d");
}

Sketcher.prototype.addLayer = function(name, zIndex = 0) {
	var i = this.layers.push(
		new Layer(
			name,
			zIndex == 0 ? this.countLayers() : zIndex,
			this.width,
			this.height,
			this.frame
		)
	);
	this.selectedLayer = this.layers[i-1].id;
}

Sketcher.prototype.addLayerPrompt = function() {
	var name = prompt("Please enter layer name", "Foreground");
	if(name === null) {
		return false;
	} else {
		name = name.toLowerCase();
		this.addLayer(name);

		return true;
	}
}

Sketcher.prototype.getSelectedLayer = function() {
	return this.selectedLayer;
}

Sketcher.prototype.selectLayer = function(id) {
	var layer = this.getLayer(id);
	if(layer != null) {
		this.selectedLayer = layer.id;
		return true;
	} else {
		console.error('No layer with id "'+id+'".');
		return false;
	}
}

Sketcher.prototype.deleteLayer = function(id) {
	var layer = this.getLayer(id);
	if(layer != null) {
		layer.node.remove();
		var index = -1;
		this.layers.forEach(function(layer, i) {
			if(layer.id == id) {
				index = i;
			}
		});

		this.layers.slice(index).forEach(function(layer) {
			layer.zIndex--;
			layer.update();
		});
		delete this.layers[index];
		return true;
	} else {
		console.error('No layer named "'+name+'".');
		return false;
	}
}

Sketcher.prototype.setLayerVisibility = function(id, visibility) {
	this.getLayer(id).setVisibility(visibility);
}

Sketcher.prototype.toggleLayerVisibility = function(id) {
	this.getLayer(id).toggleVisibility();
}

Sketcher.prototype.raiseLayer = function(id) {
	var layer = this.getLayer(id);
	var prev = this.getLayerOnLevel(layer.zIndex+1);

	if(prev == null || prev.name == "trackpad") {
	   return false;
	} else {
		layer.zIndex++;
		layer.update();

		prev.zIndex--;
		prev.update();
	}
}

Sketcher.prototype.demoteLayer = function(id) {
	var layer = this.getLayer(id);
	var next = this.getLayerOnLevel(layer.zIndex-1);

	if(next == null || next.name == "trackpad") {
	   return false;
	} else {
		layer.zIndex--;
		layer.update();

		next.zIndex++;
		next.update();
	}
}

Sketcher.prototype.selectColor = function(colorName) {
	if(colorName in Color) {
		this.color = Color[colorName]
		return true;
	} else {
		console.error(colorName+" is not a color.");
		return false;
	}
}

Sketcher.prototype.getSelectedColor = function() {
	return this.color;
}

var S = new Sketcher();
