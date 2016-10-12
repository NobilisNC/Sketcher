/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window) {

	// Constructor
	var UISingleton = function(document, window) {
		Sketcher.AbstractWidget.call(this, Sketcher.Core.frame);
		this.node = Sketcher.createElement('sketcher_ui');

		// Create UI components containers
		this.buttons = new Sketcher.Window('Tools', this, 10, 85);
		this.toolButtons = new Sketcher.Toolbox(this.buttons);
		[	//!\ DEV This hardcoded array looks like shit. Let's generalize it.
			['Rectangle', 'rectangle', 'square'],
			['Circle', 'circle', 'circle'],
			['Pencil', 'pencil', 'pencil'],
			['Line', 'line', 'minus'],
			['Bucket', 'paint_bucket', 'adjust'],
		].forEach((function(tool){
			this.toolButtons.appendChild(
				new Sketcher.Button(
					tool[0],
					function(e) {
						Sketcher.Core.setTool(tool[1]);
					},
					this,
					tool[2]
				)
			);
		}).bind(this));
		this.palette = new Sketcher.Palette(this, 10, 10);
		this.layer = new Sketcher.Window('Layers', this, Sketcher.Core.getWidth()-261, 10);
		this.layerList = new Sketcher.LayerList(this.layer);
		this.layerButtons = new Sketcher.Toolbox(this.layer);
		this.layerButtons.appendChild(
			new Sketcher.Button(
				'addLayer',
				(function(e) {
					Sketcher.Core.addLayer();
					this.layerList.update();
				}).bind(this),
				this,
				'plus'
			)
		);
		this.opacitySlider = this.layerButtons.appendChild(
			new Sketcher.Slider(
				'Opacity',
				(function(e) {
					Sketcher.Core.setLayerOpacity(e.target.value);
				}).bind(this),
				this,
				'low-vision'
			)
		);

		function updateFrame() {
			this.node.width = window.innerWidth;
			this.node.height = window.innerHeight;
			Sketcher.node.style.width = window.innerWidth+'px'
			Sketcher.node.style.height = window.innerHeight+'px';
		}

		updateFrame();
		this.palette.update();
		this.layerList.update();

		window.addEventListener('resize', function(e) { updateFrame(); });

		return {
			updatePalette: this.palette.update,
			updateLayers: this.layerList.update,
			updateOpacitySlider: this.opacitySlider.update.bind(this.opacitySlider)
		};
	}

	var instance = instance || new UISingleton(document, window);

	return instance;
})(document, window);
