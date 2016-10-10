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
			'square',
			function(e) {
				Sketcher.Core.setTool('rectangle');
			},
			null,
			'square'
		).node
	);
	this.toolButtons.appendChild(
		new Sketcher.Button(
			'circle',
			function(e) {
				Sketcher.Core.setTool('circle');
			},
			null,
			'circle'
		).node
	);
	this.palette = document.createElement('div');
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

	// this.buttons.setAttribute('id', 'sk_buttons');
	this.palette.setAttribute('id', 'sk_palette');

	// this.frame.appendChild(this.buttons);
	this.frame.appendChild(this.palette);

	function updateFrame() {
		this.frame.width = window.innerWidth;
		this.frame.height = window.innerHeight;
		Sketcher.node.style.width = window.innerWidth+'px'
		Sketcher.node.style.height = window.innerHeight+'px';
	}

	function updatePalette() {
		this.palette.innerHTML = '';
		while (this.palette.firstChild) {
			this.palette.removeChild(this.palette.firstChild);
		}

		for(var color in Sketcher.Colors) {
			this.palette.innerHTML += '<a class="sk_color" style="background-color:' + Sketcher.Colors[color] + ';" alt="' + color + '" href="#"></a>';
		}

		Array.prototype.forEach.call(
			this.palette.querySelectorAll('.sk_color'),
			function(color) {
				color.addEventListener('click', function(e) {
					Sketcher.Core.selectColor(this.getAttribute('alt'));
				});
			}
		);
	}

	function _updateLayers() {
		this.layerList.empty();


		Sketcher.Core.getLayers().forEach(function(layer) {
			layer.createMenuItem(this.layerList);
		});

	}

	// function addButton(name, func, container, icon = '') {
	// 	if(icon == '') {
	// 		container.innerHTML += '<a class="sk_button" id="sk_button_' + name + '" href="#">' + name + '</a>';
	// 	} else {
	// 		container.innerHTML += '<a class="sk_button" id="sk_button_' + name + '" href="#"><i alt="' + name + '" class="fa fa-' + icon + '"></a>';
	// 	}
	//
	// 	var b = container.querySelector('#sk_button_' + name);
	// 	b.addEventListener('click', func);
	// }

	function addNormalButton(name, func, icon = '') {
		addButton(name, func, buttons, icon);
	}

	this.updateLayers = _updateLayers.bind(this);

	// Add native components to containers
	// addButton('circle', function(e){ Sketcher.Tools.setTool('circle'); console.log('circle'); }, this.buttons, 'circle');
	// addButton('square', function(e){ Sketcher.Tools.setTool('rectangle'); console.log('square'); }, this.buttons, 'square');

	updateFrame();
	updatePalette();
	updateLayers();

	window.addEventListener('resize', function(e) { updateFrame(); });

	return {
		addButton: addNormalButton,
		updateLayers: updateLayers
	};
})(document, window);
