/*
/	A draggable window with layer control panel
/	 See last definiton
*/


/*
/	Layer list
/	 A window that permits layers control
*/
Sketcher.widgets.LayerList = function(parent) {
	Sketcher.widgets.AbstractWidget.call(this, parent);

	this.node = document.createElement('ul');
	this.node.setAttribute('id', 'sk_layers_list');
	this.parent.appendChild(this);
}

/*
/	Layer list item
/	 A link to select a layer, make it invisible, delete it, raise it up or drop it down.
*/
Sketcher.widgets.LayerItem = function(layer, parent) {
	Sketcher.widgets.AbstractWidget.call(this, parent);

	this.layer = layer;
	this.thumbnailData = '';

	this.node = document.createElement('li');
	this.node.setAttribute('data-id', this.layer.id);
	this.node.setAttribute('data-name', this.layer.name);

	// Create a container for layer commands
	this.commands = document.createElement('div');
	this.commands.setAttribute('class', 'sk_layer_commands');

	// Create buttons for layer commands
	this.btnSelect = document.createElement('a');
	this.btnSelect.setAttribute('data-action', 'selectLayer');
	this.btnSelect.setAttribute('class', 'sk_layer_link');
	this.btnSelect.innerHTML = this.layer.name[0].toUpperCase() + this.layer.name.substr(1);
	this.node.appendChild(this.btnSelect);

	this.thumbnail = document.createElement('div');
	this.thumbnail.setAttribute('data-id', this.id);
	this.thumbnail.setAttribute('class', 'sk_layer_thumbnail');
	this.thumbnailImg = document.createElement('img');
	this.thumbnailImg.src = (this.thumbnailData == undefined ? '' : this.thumbnailData);
	this.thumbnail.appendChild(this.thumbnailImg);
	this.btnSelect.appendChild(this.thumbnail);

	this.btnVisibility = document.createElement('a');
	this.btnVisibility.setAttribute('data-action', 'toggleLayerVisibility');
	this.btnVisibility.setAttribute('class', 'sk_check');
	this.commands.appendChild(this.btnVisibility);

	this.btnRaise = document.createElement('a');
	this.btnRaise.setAttribute('data-action', 'raiseLayer');
	this.btnRaise.setAttribute('class', 'sk_check');
	this.btnRaise.innerHTML = '<i class="fa fa-arrow-up"></i>';
	this.commands.appendChild(this.btnRaise);

	this.btnDelete = document.createElement('a');
	this.btnDelete.setAttribute('data-action', 'deleteLayer');
	this.btnDelete.setAttribute('class', 'sk_check');
	this.btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
	this.commands.appendChild(this.btnDelete);

	this.btnDrop = document.createElement('a');
	this.btnDrop.setAttribute('data-action', 'dropLayer');
	this.btnDrop.setAttribute('class', 'sk_check');
	this.btnDrop.innerHTML = '<i class="fa fa-arrow-down"></i>';
	this.commands.appendChild(this.btnDrop);

	this.node.appendChild(this.commands);

	Array.prototype.forEach.call(
		this.node.querySelectorAll('a[data-action="selectLayer"], a[data-action="toggleLayerVisibility"], a[data-action="deleteLayer"], a[data-action="raiseLayer"], a[data-action="dropLayer"]'),
		(function(btn){
			if(btn.parentNode.tagName == "LI") {
				var id = btn.parentNode.getAttribute("data-id");
			} else {
				var id = btn.parentNode.parentNode.getAttribute("data-id");
			}
			var action = btn.getAttribute("data-action");
			btn.addEventListener('click', (function(e) {
				Sketcher.Core[action](id);
				this.update();
			}).bind(this));
		}).bind(this)
	);

	this._updateThumbnail = function() {
		var ctx = this.layer.getContext();
		var before = new Image();
		var scale = 200/this.width;

		before.src = this.layer.node.toDataURL("image/png");
		before.onload = (function(e) {
			var cvs = document.createElement('canvas');
			var ctx = cvs.getContext('2d');

			cvs.width = 200;
			cvs.height = this.layer.height*scale;
			ctx.scale(scale, scale);
			ctx.drawImage(before, 0, 0);
			this.thumbnailData = this.layer.node.toDataURL("image/png");
			cvs.remove();

			this.thumbnailImg.src = this.thumbnailData;
		}).bind(this);
	}

	this._update = function() {
		this.node.setAttribute('class', (this.layer.focus ? 'active' : '' ));
		this.btnVisibility.innerHTML = '<i class="fa fa-eye' + (this.layer.isVisible() ? '' : '-slash') + '"></i>';
		this._updateThumbnail();
	}

	this._update();

	this.update = this._update.bind(this);
	this.updateThumbnail = this._updateThumbnail.bind(this);

}

// The so called window
Sketcher.widgets.LayerControl = function(parent, x = 0, y = 0) {
	Sketcher.widgets.Window.call(this, 'Layers', parent, x, y);

	this.layerList = new Sketcher.widgets.LayerList(this);
	this.layerButtons = new Sketcher.widgets.Toolbox(this);
	this.layerButtons.addWidget(
		'addLayer',
		new Sketcher.widgets.Button(
			'addLayer',
			(function(e) {
				Sketcher.Core.addLayer();
				this.update();
			}).bind(this),
			this,
			'plus'
		)
	);
	this.layerButtons.addWidget(
		'opacitySlider',
		new Sketcher.widgets.Slider(
			'Opacity',
			(function(e) {
				Sketcher.Core.setLayerOpacity(e.target.value);
			}).bind(this),
			this,
			'low-vision'
		)
	);

	this._update = function(force = false) {
		Sketcher.widgets.Window.prototype.update.call(this);
		if(force || this.layerList.children.length != Sketcher.Core.getLayers().length) {
			this.layerList.empty();

			Sketcher.Core.getLayers().forEach((function(layer) {
				layer.createMenuItem(this);
			}).bind(this.layerList));
		} else {
			Array.prototype.forEach.call(
				this.layerList.children,
				function(item) {
					item.update();
				}
			);
		}
	}

	this.update = this._update.bind(this);
};
