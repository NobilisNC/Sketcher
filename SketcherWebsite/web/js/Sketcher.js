/*
/	Sketcher namespace
/	 Contains and load all modules.
/	 This is the only script to be included in the HTML document
/	 you want Sketcher to spawn in.
*/
var Sketcher = Sketcher || (function(document, window, settings = {}) {
	this.settings = {
		stickingWindows: settings.stickingWindows || true,
		stickDistance: settings.stickDistance || 10,
		unstickDistance: settings.unstickDistance || 100
	};
	this.basedir = 'js/Sketcher/';
	this.libs = {
		'Socket': {filename: 'Socket.js'},
		'Color': {filename: 'Color.js'},
		'Tools': {filename: 'Tools.js'},
		'Layer': {filename: 'Layer.js'},
		'Core': {filename: 'Core.js'},
		'Widgets': {filename: 'Widgets.js'},
		'LayerControl': {filename: 'LayerControl.js'},
		'UI': {filename: 'UI.js'},
	};

	/*
	/	Dynamically loads every script specified in this.libs
	*/
	this.load = function(name = null) {
		if(name == null) {
			load(Object.keys(this.libs)[0]);
		} else if(name in this.libs) {
			this.libs[name].node = document.createElement('script');
			this.libs[name].node.src = this.basedir+this.libs[name].filename;
			this.libs[name].node.onload = (function(e) {
				var next = Object.keys(this.libs).indexOf(name)+1;
				if(next < Object.keys(this.libs).length) {
					load(Object.keys(this.libs)[next]);
				}
			}).bind(this);
			document.body.appendChild(this.libs[name].node);
		} else
			return false;
	};

	/*
	/	Create a basic container with specified id
	/	Appends the created element to document.body if no parent is specified.
	*/
	this.createElement = function(id, parent = null) {
		var node = document.querySelector('div#'+id);
		if(node == null) {
			node = document.createElement('div');
			node.setAttribute('id', id);
			(parent == null ? document.body : parent).appendChild(node);
		}

		return node;
	};

	this.node = this.createElement('sketcher');
	load();

	return {
		node: this.node,
		createElement: this.createElement,
		settings: this.settings,
		widgets: {}
	};
})(document, window);
