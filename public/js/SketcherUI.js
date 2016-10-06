var SketcherUI = (function(document, window){
	this.frame = document.querySelector('div#sketcher_ui');

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
	this.layers.setAttribute('id', 'sk_layers');
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
		document.body.querySelector('#sk_container').style.width = window.innerWidth+'px'
		document.body.querySelector('#sk_container').style.height = window.innerHeight+'px';
	}

	function updatePalette() {
		this.palette.innerHTML = '';
		while (this.palette.firstChild) {
			this.palette.removeChild(this.palette.firstChild);
		}

		for(var color in Color) {
			this.palette.innerHTML += '<a class="sk_color" style="background-color:' + Color[color] + ';" alt="' + color + '" href="#"></a>';
		}

		Array.prototype.forEach.call(
			this.palette.querySelectorAll('.sk_color'),
			function(color) {
				color.addEventListener('click', function(e) {
					S.selectColor(this.getAttribute('alt'));
				});
			}
		);
	}

	function updateLayers() {
		while (this.layersList.firstChild) {
			this.layersList.removeChild(this.layersList.firstChild);
		}

		S.getLayers().forEach(function(layer) {
			var li = document.createElement('li');
			li.setAttribute('data-id', layer.id);
			li.setAttribute('data-name', layer.name);
			if(layer.id == S.getSelectedLayer())
				li.setAttribute('class', 'active');

			// Create a container for layer commands
			var div = document.createElement('div');
			div.setAttribute('class', 'sk_layer_commands');

			// Create buttons for layer commands
			var aSel = document.createElement('a');
			aSel.setAttribute('data-action', 'selectLayer');
			aSel.setAttribute('class', 'sk_layer_link');
			aSel.innerHTML = layer.name[0].toUpperCase() + layer.name.substr(1);
			li.appendChild(aSel);

			var thumb = document.createElement('div');
			thumb.setAttribute('data-id', layer.id);
			thumb.setAttribute('class', 'sk_layer_thumbnail');
			var thumbImg = document.createElement('img');
			thumbImg.src = layer.thumbnail == undefined ? '' : layer.thumbnail;
			thumb.appendChild(thumbImg);
			aSel.appendChild(thumb);

			var aVis = document.createElement('a');
			aVis.setAttribute('data-action', 'toggleLayerVisibility');
			aVis.setAttribute('class', 'sk_check');
			aVis.innerHTML = '<i class="fa fa-eye' + (layer.isVisible() ? '' : '-slash') + '"></i>';
			div.appendChild(aVis);

			var aRai = document.createElement('a');
			aRai.setAttribute('data-action', 'raiseLayer');
			aRai.setAttribute('class', 'sk_check');
			aRai.innerHTML = '<i class="fa fa-arrow-up"></i>';
			div.appendChild(aRai);

			var aDel = document.createElement('a');
			aDel.setAttribute('data-action', 'deleteLayer');
			aDel.setAttribute('class', 'sk_check');
			aDel.innerHTML = '<i class="fa fa-trash"></i>';
			div.appendChild(aDel);

			var aDem = document.createElement('a');
			aDem.setAttribute('data-action', 'demoteLayer');
			aDem.setAttribute('class', 'sk_check');
			aDem.innerHTML = '<i class="fa fa-arrow-down"></i>';
			div.appendChild(aDem);

			li.appendChild(div);

			this.layersList.appendChild(li);
		});

		Array.prototype.forEach.call(
			this.layersList.querySelectorAll('a[data-action="selectLayer"], a[data-action="toggleLayerVisibility"], a[data-action="deleteLayer"], a[data-action="raiseLayer"], a[data-action="demoteLayer"]'),
			function(btn){
				if(btn.parentNode.tagName == "LI") {
					var id = btn.parentNode.getAttribute("data-id");
				} else {
					var id = btn.parentNode.parentNode.getAttribute("data-id");
				}
				var action = btn.getAttribute("data-action");
				btn.addEventListener('click', function(e) {
					S[action](id);
					updateLayers();
				});
			}
		);

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

	function addWindow() {
		var win = document.createElement('div');
		win.setAttribute('class', 'sk_window');

		var title = document.createElement('h1');
		title.setAttribute('class', 'sk_window_title');



		return win;
	}

	function window_onMouseUp(e) {
		var elm;
		Array.prototype.forEach.call(
			document.querySelectorAll('.sk_window_title'),
			function(elm) {
				var win = elm.parentNode;
				if(win.getAttribute('data-dragged') == '1') {
					win.removeAttribute('data-dragged');
					win.removeAttribute('data-x');
					win.removeAttribute('data-y');
					document.body.removeEventListener('mousemove', window_onMouseMove);
				}
			}
		);
	}

	function window_onMouseDown(e) {
		if(e.target.getAttribute('class') == 'sk_window_title') {
			e.preventDefault();
			e.stopPropagation();

			var win = e.srcElement.parentNode;
			win.setAttribute('data-dragged', '1');
			win.setAttribute('data-x', e.offsetX);
			win.setAttribute('data-y', e.offsetY);

			document.body.addEventListener('mousemove', window_onMouseMove);
		}
	}

	function window_onMouseMove(e) {
		var win = document.querySelector('div.sk_window[data-dragged="1"]');
		if(win != null) {
			e.preventDefault();
			e.stopPropagation();

			var x = e.clientX - win.getAttribute('data-x');
			var y = e.clientY - win.getAttribute('data-y');

			if(x >= 0 && x + win.offsetWidth <= document.getElementById('sk_container').offsetWidth) {
				win.style.left = x + 'px';
			} else {
				if(x < 0) {
					win.style.left = '0px';
				} else {
					win.style.left = (document.getElementById('sk_container').offsetWidth - win.offsetWidth) + 'px';
				}
			}

			if(y >= 0 && y + win.offsetHeight <= document.getElementById('sk_container').offsetHeight) {
				win.style.top = y + 'px';
			} else {
				if(y < 0) {
					win.style.top = '0px';
				} else {
					win.style.top = (document.getElementById('sk_container').offsetHeight - win.offsetHeight) + 'px';
				}
			}
		}
	}

	// Add native components to containers
	addButton('square', function(e){ console.log('select square'); }, this.buttons, 'square');
	addButton('addLayer', function(e){ S.addLayerPrompt(); updateLayers(); }, this.layersButtons, 'plus');
	updateFrame();
	updatePalette();
	updateLayers();

	document.body.addEventListener('mousedown', window_onMouseDown, true);
	document.body.addEventListener('mouseup', window_onMouseUp, true);
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

	window.addEventListener('resize', function(e) { updateFrame(); });

	return {
		addButton: addNormalButton,
		updateLayers: updateLayers
	};
})(document, window);
