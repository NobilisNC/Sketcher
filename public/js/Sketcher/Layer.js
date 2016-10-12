/*
/	Layer
/	 Basically a <canvas> handle
/	 Also manages its own item in the layers list
*/
var Layer = function(name, zIndex, width, height, frame) {
	this.id = Math.round(Math.random()*1000000)%1000000;
	this.name = name;
	this.zIndex = zIndex;
	this.node = document.createElement('canvas');
	this.visible = true;
	this.focus = false;
	this.width = width;
	this.height = height;
	this.opacity = 1;

	//Beta
	this.object = [];

	this.createMenuItem = function(container) {
		this.menuItem = new Sketcher.LayerItem(this, container);
		container.appendChild(this.menuItem);
	}

	this.update = function() {
		this.node.style.display = this.visible ? 'block' : 'none';
		this.node.style.zIndex = this.zIndex;

		if(this.menuItem != undefined) {
			this.menuItem.update();
		}
	}

	this.toggleVisibility = function() {
		this.visible = this.visible ? false : true;
		this.update();
	}

	this.setVisibility = function(visibility) {
		this.visible = visibility;
		this.update();
	}

	this.isVisible = function() {
		return this.visible;
	}

	this.getContext = function() {
		return this.node.getContext('2d');
	}

	this.select = function() { this.focus = true; }
	this.blur = function() { this.focus = false; }

	this.node.width = this.width;
	this.node.height = this.height;
	this.node.setAttribute('id', 'sk_layer_'+this.id);
	frame.appendChild(this.node);

	this.update();
};
