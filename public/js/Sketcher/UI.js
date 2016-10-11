/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window){
	this.frame = Sketcher.createElement('sketcher_ui');

	// Create UI components containers
	this.buttons = new Sketcher.Window('Tools', this.frame, 10, 10);
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
				null,
				tool[2]
			).node
		);
	}).bind(this));
	this.palette = new Sketcher.Palette(this.frame, 10, 85);
	this.layer = new Sketcher.Window('Layers', this.frame, Sketcher.Core.getWidth()-260, 10);
	this.layerList = new Sketcher.LayerList(this.layer);
	this.layerButtons = new Sketcher.Toolbox(this.layer);
	this.layerButtons.appendChild(
		new Sketcher.Button(
			'addLayer',
			function(e) {
				Sketcher.Core.addLayer();
				updateLayers();
			},
			null,
			'plus'
		).node
	);

	function updateFrame() {
		this.frame.width = window.innerWidth;
		this.frame.height = window.innerHeight;
		Sketcher.node.style.width = window.innerWidth+'px'
		Sketcher.node.style.height = window.innerHeight+'px';
	}

	function _updateLayers() {
		this.layerList.empty();


		Sketcher.Core.getLayers().forEach(function(layer) {
			layer.createMenuItem(this.layerList);
		});

	}

	this.updateLayers = _updateLayers.bind(this);

	updateFrame();
	this.palette.update();
	updateLayers();

	window.addEventListener('resize', function(e) { updateFrame(); });

	return {
		updatePalette: this.palette.update,
		updateLayers: updateLayers
	};
})(document, window);
