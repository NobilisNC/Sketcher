/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window) {

	// Constructor
	var UISingleton = function(document, window) {
		Sketcher.widgets.AbstractWidget.call(this, Sketcher.Core.frame);
		this.node = Sketcher.createElement('sketcher_ui', Sketcher.node);

		// Create UI components containers
		this.layerControl = new Sketcher.widgets.LayerControl(this, window.innerWidth-261, 10);
		this.toolControl = new Sketcher.widgets.ToolControl(this, 10, 185);
		this.palette = new Sketcher.widgets.Palette(this, 10, 10);

		this.update = function() {
			this.node.width = window.innerWidth;
			this.node.height = window.innerHeight;
			Sketcher.node.style.width = window.innerWidth+'px';
			Sketcher.node.style.height = window.innerHeight+'px';

			this.layerControl.update();
			this.palette.update();
		}

		this.update();
		this.palette.update();
		this.layerControl.update();

		window.addEventListener('resize', (function(e) { this.update(); }).bind(this));

		return {
			addColor: this.palette.addColor,
			deleteColor: this.palette.deleteColor,
			updatePalette: this.palette.update,
			updateLayers: this.layerControl.update,
			// updateOpacitySlider: this.layerControl.opacitySlider.update.bind(this.layerControl.opacitySlider)
		};
	}

	var instance = instance || new UISingleton(document, window);

	return instance;
})(document, window);
