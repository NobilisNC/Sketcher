/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window){
	this.frame = Sketcher.createElement('sketcher_ui');

	// Create UI components containers
	this.buttons = document.createElement('div');
	this.palette = document.createElement('div');
	this.layers = document.createElement('div');
	this.layersButtons = document.createElement('div');
	this.layersList = document.createElement('ul');

	this.buttons.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });
	this.palette.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });
	this.layers.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });

	this.buttons.setAttribute('id', 'sk_buttons');
	this.palette.setAttribute('id', 'sk_palette');
	this.layers.setAttribute('id', 'sk_layers_widget');
	this.layersButtons.setAttribute('id', 'sk_layers_buttons');
	this.layersList.setAttribute('id', 'sk_layers_list');

	this.frame.appendChild(this.buttons);
	this.frame.appendChild(this.palette);

	this.layers.appendChild(this.layersList);
	this.layers.appendChild(this.layersButtons);
	this.frame.appendChild(this.layers);

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

		for(var color in Sketcher.Color) {
			this.palette.innerHTML += '<a class="sk_color" style="background-color:' + Sketcher.Color[color] + ';" alt="' + color + '" href="#"></a>';
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
		while (this.layersList.firstChild) {
			this.layersList.removeChild(this.layersList.firstChild);
		}

		Sketcher.Core.getLayers().forEach(function(layer) {
			layer.createMenuItem(this.layersList);
		});

	}

	function addButton(name, func, container, icon = '') {
		if(icon == '') {
			container.innerHTML += '<a class="sk_button" id="sk_button_' + name + '" href="#">' + name + '</a>';
		} else {
			container.innerHTML += '<a class="sk_button" id="sk_button_' + name + '" href="#"><i alt="' + name + '" class="fa fa-' + icon + '"></a>';
		}

		var b = container.querySelector('#sk_button_' + name);
		b.addEventListener('click', func);
	}

	function addNormalButton(name, func, icon = '') {
		addButton(name, func, buttons, icon);
	}

	this.updateLayers = _updateLayers.bind(this);

	// Add native components to containers
	addButton('square', function(e){ console.log('select square'); }, this.buttons, 'square');
	addButton('addLayer', function(e){ Sketcher.Core.addLayer(); updateLayers(); }, this.layersButtons, 'plus');

	updateFrame();
	updatePalette();
	updateLayers();

	Array.prototype.forEach.call(
		this.frame.querySelectorAll('.sk_window_title'),
		function(win) {
			var foldBtn = document.createElement('a');
			foldBtn.innerHTML = '<i class="fa fa-minus-square-o"></i>';
			foldBtn.setAttribute('data-action', 'fold');
			win.appendChild(foldBtn);

			foldBtn.addEventListener('click', function(e) {
				var win = foldBtn.parentNode.parentNode;
				if(win.getAttribute('data-folded') == 'true') {
					win.setAttribute('data-folded', 'false');
					win.querySelector('a[data-action="fold"] i').setAttribute('class', 'fa fa-minus-square-o');
				} else {
					win.setAttribute('data-folded', 'true');
					win.querySelector('a[data-action="fold"] i').setAttribute('class', 'fa fa-plus-square-o');
				}
			});
		}
	);

	var a = new Sketcher.Window('Lol', this.frame);

	window.addEventListener('resize', function(e) { updateFrame(); });

	return {
		addButton: addNormalButton,
		updateLayers: updateLayers
	};
})(document, window);
