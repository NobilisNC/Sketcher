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
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.color = Color.red;

	this.tool = Tools.getTool();


	this.frame.style.width = this.width+"px";
	this.frame.style.height = this.height+"px";

	this.onMouseUp = this._onMouseUp.bind(this);
	this.onMouseDown = this._onMouseDown.bind(this);
	this.onMouseMove = this._onMouseMove.bind(this);

	this.frame.addEventListener("contextmenu", function(e) { e.preventDefault(); });
	this.frame.addEventListener("mouseup", this.onMouseUp);
	this.frame.addEventListener("mousedown", this.onMouseDown);

	this.addLayer("trackpad", 100);
	this.addLayer("background");
}

Sketcher.prototype._onMouseUp = function(e) {
	this.clear(this.getContext(this.layers[0].id));

	if(this.clicked) {
		var ctx = this.getContext(this.selectedLayer);
		this.tool.onMouseUp(e, ctx);
		this.getLayer(this.selectedLayer).updateThumbnail();
	}

	if(!e.shiftKey) {
		this.frame.removeEventListener("mousemove", this.onMouseMove);
		this.clicked = false;
	}
};

Sketcher.prototype._onMouseDown = function(e) {
	if(e.button == 0 && !this.clicked) {
		this.clicked = true;
		this.tool.onMouseDown(e, this.getContext(this.selectedLayer));
		this.frame.addEventListener("mousemove", this.onMouseMove);
	}else if(e.button == 2 && this.clicked) {
		e.preventDefault();
		e.stopPropagation();
		this.clicked = false;
	}
}

Sketcher.prototype._onMouseMove = function(e) {
	if(e.offsetX < 0 || e.offsetY < 0 ||  e.offsetX > this.width || e.offsetY > this.height || !this.clicked) {
		this.onMouseUp(e);
	} else {
		var ctx = this.getContext(this.layers[0].id);
		this.clear(ctx);
		this.tool.onMouseMove(e, ctx);
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
		console.error('No layer with id "' + id + '".');
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
		this.tool.setColor(Color[colorName]);
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
