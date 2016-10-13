/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window) {

	// Constructor
	var UISingleton = function(document, window) {
		Sketcher.widgets.AbstractWidget.call(this, Sketcher.Core.frame);
		this.node = Sketcher.createElement('sketcher_ui');

		// Create UI components containers
		this.layerControl = new Sketcher.widgets.LayerControl(this, Sketcher.Core.getWidth()-261, 10);
		this.palette = new Sketcher.widgets.Palette(this, 10, 10);
		this.tools = new Sketcher.widgets.Window('Tools', this, 10, 155);
		this.toolButtons = new Sketcher.widgets.Toolbox(this.tools);
		[	//!\ DEV This hardcoded array looks like shit. Let's generalize it.
			['Rectangle', 'rectangle', 'square'],
			['Circle', 'circle', 'circle'],
			['Pencil', 'pencil', 'pencil'],
			['Line', 'line', 'minus'],
			['Bucket', 'paint_bucket', 'adjust'],
		].forEach((function(tool){
			this.toolButtons.appendChild(
				new Sketcher.widgets.Button(
					tool[0],
					function(e) {
						Sketcher.Core.setTool(tool[1]);
					},
					this,
					tool[2]
				)
			);
		}).bind(this));

		this.update = function() {
			this.node.width = window.innerWidth;
			this.node.height = window.innerHeight;
			Sketcher.node.style.width = window.innerWidth+'px'
			Sketcher.node.style.height = window.innerHeight+'px';
		}

		this.update();
		this.palette.update();
		// this.layerList.update();
		this.layerControl.update();

		window.addEventListener('resize', (function(e) { this.update(); }).bind(this));

		return {
			updatePalette: this.palette.update,
			updateLayers: this.layerControl.update,
			updateOpacitySlider: this.layerControl.opacitySlider.update.bind(this.layerControl.opacitySlider)
		};
	}

	var instance = instance || new UISingleton(document, window);

	return instance;
})(document, window);
