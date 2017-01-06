/*
/	Core singleton
/	Main module that controls the drawing frame
*/
Sketcher.Core = (function(document, window) {

	// Constructor
	function CoreSingleton() {
		this.frame = Sketcher.createElement('sketcher_layers', Sketcher.node);
		this.layers = [];
		this.selectedLayer;
		this.clicked = false;
		this.width = Sketcher.data.width;
		this.height = Sketcher.data.height;
		this.lineWidth = 1;
		this.socket = Sketcher.settings.offline ? null : new Sketcher.Socket('localhost');

		if(this.socket)
			this.socket.login();

		setTimeout((function(socket) {
			return function() {
				socket.getFreshObjectsList();
			}
		}) (this.socket), 5000);

		//Tools
		Sketcher.Tools.init(this.width, this.height);
		this.tool = Sketcher.Tools.getTool();

		/***** EVENTS *****/
		this._onMouseUp = function(e) {
			this.clear(this.layers[0].getContext());

			if(this.clicked) {
				var ctx = this.selectedLayer.getContext();
				var obj = this.tool.onMouseUp(e, ctx);
				if(obj != null) {
					this.selectedLayer.objects.push(obj);
					this.selectedLayer.clear();
					this.selectedLayer.draw();
					this.selectedLayer.menuItem.updateThumbnail();
				}
			}

			if(!e.shiftKey) {
				// this.frame.removeEventListener("mousemove", this.onMouseMove);
				this.clicked = false;
			}
		};

		this._onMouseDown = function(e) {
			if(e.button == 0 && !this.clicked) {
				this.clicked = true;
				this.tool.onMouseDown(e, this.selectedLayer.getContext());
				// this.frame.addEventListener("mousemove", this.onMouseMove);
			}else if(e.button == 2 && this.clicked) {
				e.preventDefault();
				e.stopPropagation();
				this.clicked = false;
			}
		}

		this._onMouseMove = function(e) {
			if(
					e.offsetX <= 0
				||	e.offsetY <= 0
				||  e.offsetX >= this.width
				||	e.offsetY >= this.height
				||	e.buttons == 0
			) {
				this.clicked = false;
				this._onMouseUp(e);
			} else {
				var ctx = this.layers[0].getContext();
				this.clear(ctx);
				this.tool.onMouseMove(e, ctx);
			}
		}

		/***** PRIVATE *****/
		this.clear = function(ctx) {
			ctx.clearRect(0, 0, this.width, this.height);
		}

		this.getLayerOnLevel = function(n) {
			var ret = null;

			this.layers.forEach(function(layer) {
				if(layer.zIndex == n) {
					ret = layer;
				}
			});

			return ret;
		}

		this.addLayer = function(name, zIndex = 0) {
			var i = this.layers.push(
				new Sketcher.widgets.Layer(
					name,
					zIndex == 0 ? this.countLayers() : zIndex,
					this.width,
					this.height,
					this.frame
				)
			);
			this.selectLayer(this.layers[i-1].id);
		}

		/***** PUBLIC *****/

		this.countLayers = function() {
			var c = 0;

			this.layers.forEach(function() {
				c++;
			});

			return c;
		}

		this.addLayerPrompt = function() {
			var name = prompt("Please enter layer name", "Foreground");
			if(name === null) {
				return false;
			} else {
				name = name.toLowerCase();
				this.addLayer(name);

				return true;
			}
		}

		this.getLayer = function(id) {
			var ret = null;

			this.layers.forEach(function(layer) {
				if(layer.id == id) {
					ret = layer;
				}
			});

			return ret;
		}

		this.getLayers = function() {
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

		/***** SLOTS *****/
		this.selectLayer = function(id) {
			var layer = this.getLayer(id);
			if(layer != null) {
				// Blur each layer
				this.layers.forEach(function(l) {
					l.blur();
					l.update();
				});

				// Select the new one
				this.selectedLayer = layer;
				layer.select();
				if(Sketcher.UI) {
					Sketcher.UI.updateOpacitySlider();
				}
				return true;
			} else {
				console.error('No layer with id "'+id+'".');
				return false;
			}
		}

		this.deleteLayer = function(id) {
			var layer = this.getLayer(id);
			if(layer != null) {
				layer.node.remove(); // Destruct DOM node

				// Searching for first layer after the one just removed
				var index = -1;
				this.layers.forEach(function(layer, i) {
					if(layer.id == id) {
						index = i;
					}
				});

				// Decrement z-index of the layers above the one just removed
				this.layers.slice(index).forEach(function(layer) {
					layer.zIndex--;
					layer.update();
				});

				// Forget the removed layer
				delete this.layers[index];
				Sketcher.UI.updateLayers(true);

				return true;
			} else {
				console.error('No layer with id "' + id + '".');

				return false;
			}
		}

		this.setLayerOpacity = function(opacity) {
			Sketcher.Core.getSelectedLayer().setOpacity(opacity);
		}

		this.setLayerVisibility = function(id, visibility) {
			this.getLayer(id).setVisibility(visibility);
		}

		this.toggleLayerVisibility = function(id) {
			this.getLayer(id).toggleVisibility();
		}

		this.raiseLayer = function(id) {
			var layer = this.getLayer(id);
			var prev = this.getLayerOnLevel(layer.zIndex+1);

			if(prev == null || prev.name == "trackpad") {
			   return false;
			} else {
				layer.zIndex++;
				layer.update();

				prev.zIndex--;
				prev.update();
				Sketcher.UI.updateLayers(true);
			}
		}

		this.dropLayer = function(id) {
			var layer = this.getLayer(id);
			var next = this.getLayerOnLevel(layer.zIndex-1);

			if(next == null || next.name == "trackpad") {
			   return false;
			} else {
				layer.zIndex--;
				layer.update();

				next.zIndex++;
				next.update();
				Sketcher.UI.updateLayers(true);
			}
		}

		this.selectColor = function(color) {
			Sketcher.color.foreground = color;
			window.localStorage.setItem("foreground", Sketcher.color.foreground.getRGBA());
		}

		// Initialize singleton
		this.frame.style.width = this.width+"px";
		this.frame.style.height = this.height+"px";

		// Add the needed trackpad layer and a first drawing layer
		this.addLayer("trackpad", 98);
		this.addLayer("background");

		// Bind "this" to events
		this.onMouseUp = this._onMouseUp.bind(this);
		this.onMouseDown = this._onMouseDown.bind(this);
		this.onMouseMove = this._onMouseMove.bind(this);

		// Make the frame listen to those events
		this.frame.addEventListener("contextmenu", function(e) { e.preventDefault(); });
		this.frame.addEventListener("mouseup", this.onMouseUp);
		this.frame.addEventListener("mousedown", this.onMouseDown);
		this.frame.addEventListener("mousemove", this.onMouseMove);

		// Return public methods
		return {
			addLayer: this.addLayerPrompt.bind(this),
			getLayer: this.getLayer.bind(this),
			getLayers: this.getLayers.bind(this),
			selectLayer: this.selectLayer.bind(this),
			getSelectedLayer: (function() { return this.selectedLayer; }).bind(this),
			getLayerOnLevel: this.getLayerOnLevel.bind(this),
			countLayers: this.countLayers.bind(this),
			deleteLayer: this.deleteLayer.bind(this),
			raiseLayer: this.raiseLayer.bind(this),
			dropLayer: this.dropLayer.bind(this),
			setLayerOpacity: this.setLayerOpacity.bind(this),
			setLayerVisibility: this.setLayerVisibility.bind(this),
			toggleLayerVisibility: this.toggleLayerVisibility.bind(this),
			selectColor: this.selectColor.bind(this),
			getSelectedColor: (function() { return this.color; }).bind(this),
			getWidth: (function() { return this.width; }).bind(this),
			getHeight: (function() { return this.height; }).bind(this),
			setTool: (function(tool) { Sketcher.Tools.setTool(tool); this.tool = Sketcher.Tools.getTool(); }).bind(this),
			lineWidth: this.lineWidth
		};
	}

	// Let's assume this is a singleton
	var instance = (instance || new CoreSingleton());

	return instance;
})(document, window);
