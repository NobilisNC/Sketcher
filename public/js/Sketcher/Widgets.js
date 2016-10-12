/*
/	Abstract Widget
/	 Parent class for every widget
*/
Sketcher.AbstractWidget = function Widget(parent) {
	this.parent = parent || null;
	this.children = [];
	this.node = null;

	this.setParent = function(child) {
		if(child.hasOwnProperty('node')) {
			this.parent = child;
		} else {
			return false;
		}
	}

	this.appendChild = function(child) {
		this.node.appendChild(child.hasOwnProperty('node') ? child.node : child);
		if(child.hasOwnProperty('node')) {
			child.setParent(this);
		}
		this.children.push(child);

		return child;
	}

	this.empty = function() {
		while (this.node.firstChild) {
			this.node.removeChild(this.node.firstChild);
		}
		this.children = [];
	}
};

/***** Primitive widgets *****/
/*
/	Window widget
/	 A draggable window that contains other Widgets
*/
Sketcher.Window = function Window(title, parent, x = 0, y = 0) {
	Sketcher.AbstractWidget.call(this, parent);

	this.titleText = title;
	this.dragged = false;
	this.stuck = {x:false, y:false};

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_window');
	this.node.style.top = y+'px';
	this.node.style.left = x+'px';

	this.title = document.createElement('h1');
	this.title.setAttribute('class', 'sk_window_title');
	this.title.innerHTML = this.titleText;

	this._onMouseUp = function(e) {
		if(this.dragged) {
			this.dragged = false;
			this.node.removeAttribute('data-x');
			this.node.removeAttribute('data-y');

			document.body.removeEventListener('mousemove', this.onMouseMove);
		}
	}

	this._onMouseDown = function(e) {
		e.preventDefault();
		e.stopPropagation();

		if(e.target.tagName == 'H1') {
			this.dragged = true;
			this.node.setAttribute('data-x', e.offsetX);
			this.node.setAttribute('data-y', e.offsetY);

			document.body.addEventListener('mousemove', this.onMouseMove);
		}
	}

	this._onMouseMove = function(e) {
		if(this.dragged) {
			e.preventDefault();
			e.stopPropagation();

			var x = e.clientX - this.node.getAttribute('data-x');
			var y = e.clientY - this.node.getAttribute('data-y');

			var unstickDist = Sketcher.settings.unstickDistance;
			var stickDist = Sketcher.settings.stickDistance;
			var maxX = Sketcher.node.offsetWidth - this.node.offsetWidth;
			var maxY = Sketcher.node.offsetHeight - this.node.offsetHeight;

			if(!this.stuck.x) {
				this.node.style.left = x + 'px';
			}
			if(!this.stuck.y) {
				this.node.style.top = y + 'px';
			}

			if(
					(x < 0 || x > maxX)											// Limit to workspace boundaries
				||	!this.stuck.x && (x < stickDist ||	x > maxY - stickDist)	// Stick it if it's close
				||	this.stuck.x && (x < unstickDist ||	x > maxY - unstickDist)	// Keep it stuck if still close
			) {
				if(Sketcher.settings.stickingWindows) {
					this.stuck.x = true;
				}
				this.node.style.left = (x < maxX / 2 ? 0 : maxX)+'px';
			} else {
				this.stuck.x = false;
			}

			if(																	// Same as above for y coordinate
					(y < 0 || y > maxY)
				||	!this.stuck.y && (y < stickDist || y > maxY - stickDist)
				||	this.stuck.y && (y < unstickDist || y > maxY - unstickDist)
			) {
				if(Sketcher.settings.stickingWindows) {
					this.stuck.y = true;
				}
				this.node.style.top = (y < maxY / 2 ? 0 : maxY)+'px';
			} else if(Sketcher.settings.stickingWindows) {
				this.stuck.y = false;
			}
		}
	}

	this.addFoldButton = function() {
		this.foldBtn = document.createElement('a');
		this.foldBtn.innerHTML = '<i class="fa fa-minus-square-o"></i>';
		this.foldBtn.setAttribute('data-action', 'fold');
		this.title.appendChild(this.foldBtn);

		this.foldBtn.addEventListener(
			'click',
			(function(e) {
				if(this.node.getAttribute('data-folded') == 'true') {
					this.node.setAttribute('data-folded', 'false');
					this.node.querySelector('a[data-action="fold"] i').setAttribute('class', 'fa fa-minus-square-o');
				} else {
					this.node.setAttribute('data-folded', 'true');
					this.node.querySelector('a[data-action="fold"] i').setAttribute('class', 'fa fa-plus-square-o');
				}
			}).bind(this)
		);
	}

	this.onMouseUp = this._onMouseUp.bind(this);
	this.onMouseDown = this._onMouseDown.bind(this);
	this.onMouseMove = this._onMouseMove.bind(this);

	this.title.addEventListener('mousedown', this.onMouseDown, true);
	document.body.addEventListener('mouseup', this.onMouseUp, true);

	this.addFoldButton();

	this.node.appendChild(this.title);
	this.parent.appendChild(this);
}

/*
/	Toolbox widget
/	 An invisible block that contains other widgets
*/
Sketcher.Toolbox = function Toolbox(parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_toolbox');

	this.parent = parent;
	this.parent.appendChild(this);
}

/*
/	Button widget
/	 A button that triggers an action.
/	Can be filled with an icon or a text (if no icon is specified).
*/
Sketcher.Button = function Button(title, action, parent, icon, bgColor, focus) {
	Sketcher.AbstractWidget.call(this, parent);
	this.title = title;
	this.action = action;
	this.icon = icon || '';
	this.bgColor = bgColor || '';
	this.focus = focus || false;
	this.node = document.createElement('a');
	this.node.setAttribute('class', 'sk_button');
	this.node.setAttribute('title', title);

	this.update = function() {
		this.node.className += (this.focus ? ' active' : '');
	}

	if(this.bgColor != '') {
		this.node.style.backgroundColor = this.bgColor;
	}

	this.node.innerHTML = (this.icon == '' ? this.title : '<i class="fa fa-'+this.icon+'"></i>');
	this.node.addEventListener('click', this.action);
	this.update();
}

/*
/
*/
Sketcher.ColorButton = function ColorButton(name, color, parent) {
	Sketcher.Button.call(this, ' ', (function(e) {
		Sketcher.Core.selectColor(this.color);
		Sketcher.UI.updatePalette();
	}).bind(this), parent, '', color.getHex());
	this.color = color;
	this.node.className += ' sk_colorbutton';
}

Sketcher.Slider = function Slider(labelText, onInput, parent) {
	Sketcher.AbstractWidget.call(this, parent);
	this.labelText = labelText || 'Slider';
	this.onInput = onInput || null;

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_slider_container');

	var label = document.createElement('label');
	label.innerHTML = labelText;
	label.setAttribute('for', 'sk_slider_'+labelText);
	this.node.appendChild(label);

	this.slider = document.createElement('input');
	this.slider.setAttribute('type', 'range');
	this.slider.setAttribute('class', 'sk_slider');
	this.slider.setAttribute('id', 'sk_slider_'+labelText);
	this.slider.setAttribute('min', '0');
	this.slider.setAttribute('max', '100');
	this.slider.setAttribute('value', '100');
	this.slider.addEventListener('input', this.onInput.bind(this));
	this.node.appendChild(this.slider);

	this.update = function() {
		this.slider.value = Sketcher.Core.getSelectedLayer().opacity*100;
	}
}


/***** Complex widgets *****/

/*
/	Layer list
/	 A window that permits layers control
*/
Sketcher.LayerList = function(parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.node = document.createElement('ul');
	this.node.setAttribute('id', 'sk_layers_list');
	this.parent.appendChild(this);

	this._update = function(force = false) {
		if(force || this.children.length != Sketcher.Core.getLayers().length) {
			this.empty();

			Sketcher.Core.getLayers().forEach((function(layer) {
				layer.createMenuItem(this);
			}).bind(this));
		} else {
			Array.prototype.forEach.call(
				this.children,
				function(item) {
					item.update();
				}
			);
		}
	}

	this.update = this._update.bind(this);
}

/*
/	Layer list item
/	 A link to select a layer, make it invisible, delete it, raise it up or drop it down.
*/
Sketcher.LayerItem = function(layer, parent) {
	Sketcher.AbstractWidget.call(this, parent);

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
Sketcher.Palette = function(parent, x, y) {

	function PaletteSingleton(parent, x, y) {
		Sketcher.Window.call(this, 'Palette', parent, x, y);

		this.buttons = new Sketcher.Toolbox(this);
		this.colors = [];

		this._update = function() {
			this.buttons.children.forEach(function(b) {
				if(Sketcher.Core.getSelectedColor() == b.color) {
					b.focus = true;
				} else {
					b.focus = false;
				}
				b.update();
			});
		}

		this._addBasicColors = function() {
			Object.keys(Sketcher.Colors).forEach((function(colorName) {
				this.buttons.appendChild(
					new Sketcher.ColorButton(
						colorName,
						Sketcher.Colors[colorName],
						this.buttons,
						null,
						null,
						(Sketcher.Core.color === Sketcher.Colors[colorName] ? true : false)
					)
				);
			}).bind(this));
		}

		this._addBasicColors();

		return {
			update: this._update.bind(this),
			addBasicColors: this._addBasicColors.bind(this)
		};
	}

	var instance = instance || new PaletteSingleton(parent, x, y);

	return instance;
}
