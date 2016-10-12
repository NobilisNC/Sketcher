/*
/	A draggable window with layer control panel
*/
Sketcher.widgets.LayerControl = function(parent, x = 0, y = 0) {
	Sketcher.widgets.Window.call(this, 'Layers', parent, x, y);

	this.layerList = new Sketcher.widgets.LayerList(this);
	this.layerButtons = new Sketcher.widgets.Toolbox(this);
	this.layerButtons.appendChild(
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
	this.opacitySlider = this.layerButtons.appendChild(
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
