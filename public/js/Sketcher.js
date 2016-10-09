var Sketcher = Sketcher || (function(document, window) {
	this.basedir = 'js/Sketcher/';
	this.libs = {
		'Tools': {filename: 'Tools.js'},
		'Layer': {filename: 'Layer.js'},
		'Core': {filename: 'Core.js'},
		'Widgets': {filename: 'Widgets.js'},
		'UI': {filename: 'UI.js'},
	};
	this.node = document.querySelector('#sketcher');
	if(this.node == null) {
		this.node = document.createElement('div');
		this.node.setAttribute('id', 'sketcher');
		document.body.appendChild(this.node);
	}

	this.load = function() {
		Object.keys(this.libs).forEach(function(name) {
			this.libs[name].node = document.createElement('script');
			this.libs[name].node.src = this.basedir+this.libs[name].filename;
			document.body.appendChild(this.libs[name].node);
		});
	};

	this.createElement = function(id, parent = null) {
		var node = document.querySelector('div#'+id);
		if(node == null) {
			node = document.createElement('div');
			node.setAttribute('id', id);
		}

		(parent == null ? document.body : parent).appendChild(node);

		return node;
	};

	load();

	return {
		node: this.node,
		load: this.load,
		createElement: this.createElement
	};
})(document, window);
