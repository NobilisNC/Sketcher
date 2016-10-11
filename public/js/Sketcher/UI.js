/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window){
	this.frame = Sketcher.createElement('sketcher_ui');

	// Create UI components containers
	this.buttons = new Sketcher.Window('Tools', this.frame);
	this.toolButtons = new Sketcher.Toolbox(this.buttons);
	this.toolButtons.appendChild(
		new Sketcher.Button(
			'Square',
			function(e) {
				Sketcher.Core.setTool('rectangle');
			},
			null,
			'square'
		).node
	);
	this.toolButtons.appendChild(
		new Sketcher.Button(
			'Circle',
			function(e) {
				Sketcher.Core.setTool('circle');
			},
			null,
			'circle'
		).node
	);
	this.toolButtons.appendChild(
		new Sketcher.Button(
			'Pencil',
			function(e) {
				Sketcher.Core.setTool('pencil');
			},
			null,
			'pencil'
		).node
	);
	this.toolButtons.appendChild(
		new Sketcher.Button(
			'Line',
			function(e) {
				Sketcher.Core.setTool('line');
			},
			null,
			'minus'
		).node
	);
	this.caca = new Sketcher.Palette(this.frame);
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
	this.caca.update();
	updateLayers();

	window.addEventListener('resize', function(e) { updateFrame(); });

	return {
		updatePalette: this.caca.update,
		updateLayers: updateLayers
	};
})(document, window);
