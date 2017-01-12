/*
/	Abstract Widget
/	 Parent class for every widget
*/
Sketcher.widgets.AbstractWidget = function Widget(parent) {
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

	this.appendChild = function(child, callback) {
		callback = typeof callback == 'undefined' ? function() { } : callback;
		this.node.appendChild(child.hasOwnProperty('node') ? child.node : child);
		if(child.hasOwnProperty('node')) {
			child.setParent(this);
		}
		this.children.push(child);

		callback.bind(child)();

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
Sketcher.widgets.Window = function Window(title, parent, x, y) {
	x = typeof x == 'undefined' ? 0 : x;
	y = typeof y == 'undefined' ? 0 : y;
	Sketcher.widgets.AbstractWidget.call(this, parent);

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

			var x = e.clientX - Sketcher.node.offsetLeft - this.node.getAttribute('data-x');
			var y = e.clientY - Sketcher.node.offsetTop - this.node.getAttribute('data-y');

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
				||	!this.stuck.x && (x < stickDist ||	x > maxX - stickDist)	// Stick it if it's close
				||	this.stuck.x && (x < unstickDist ||	x > maxX - unstickDist)	// Keep it stuck if still close
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

Sketcher.widgets.Window.prototype.update = function () {
	if(this.parent && this.node.offsetLeft > this.parent.node.width){
		this.node.style.left = this.parent.node.width - this.node.offsetWidth - 10 + 'px';
	}
};

/*
/	Toolbox widget
/	 An invisible block that contains other widgets
*/
Sketcher.widgets.Toolbox = function Toolbox(parent) {
	Sketcher.widgets.AbstractWidget.call(this, parent);

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_toolbox');

	this.parent = parent;
	this.parent.appendChild(this);

	this.widgets = {};

	this.addWidget = function(name, widget) {
		this.widgets[name] = widget;
		this.appendChild(widget);
	}
}

/*
/	Button widget
/	 A button that triggers an action.
/	Can be filled with an icon or a text (if no icon is specified).
*/
Sketcher.widgets.Button = function Button(title, action, parent, icon, bgColor, focus) {
	Sketcher.widgets.AbstractWidget.call(this, parent);

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

	this.setActive = function() {
		this.setInactive();
		this.node.className += ' active';
	}

	this.setInactive = function() {
		this.node.className = this.node.className.replace(/(^| )active/, '');
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
Sketcher.widgets.ColorButton = function ColorButton(name, color, parent, action) {
	Sketcher.widgets.Button.call(
		this,
		' ',
		(action || (function(e) {
			Sketcher.Core.selectColor(this.color);
			Sketcher.UI.updatePalette();
		}).bind(this)),
		parent,
		'',
		color.getRGBA()
	);
	this.name = name;
	this.color = color;
	this.node.className += ' sk_colorbutton';
	this.node.addEventListener('contextmenu', (function(e) {
		e.preventDefault();
		e.stopPropagation();
		Sketcher.UI.deleteColor(this.color);
	}).bind(this));

	this.update = function() {
		this.bgColor = this.color.getRGBA();
		this.node.style.backgroundColor = this.bgColor;
	}
}

Sketcher.widgets.Slider = function Slider(labelText, onInput, parent, icon) {
	Sketcher.widgets.AbstractWidget.call(this, parent);
	this.labelText = labelText || 'Slider';
	this.onInput = onInput || null;

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_slider_container');

	var label = document.createElement('label');
	label.innerHTML = (icon ? '<i class="fa fa-'+icon+'"></i>' : labelText);
	label.setAttribute('for', 'sk_slider_'+labelText);
	this.node.appendChild(label);

	this.slider = document.createElement('input');
	this.slider.setAttribute('type', 'range');
	this.slider.setAttribute('class', 'sk_slider');
	this.slider.setAttribute('id', 'sk_slider_'+labelText);
	this.slider.setAttribute('min', '0');
	this.slider.setAttribute('max', '100');
	this.slider.setAttribute('value', '100');
	this.slider.addEventListener('change', this.onInput.bind(this));
	this.node.appendChild(this.slider);

	this.update = function() {
		this.slider.value = Sketcher.Core.getSelectedLayer().opacity*100;
	}
}


/***** Complex widgets *****/

Sketcher.widgets.ColorPicker = function(name, color, parent) {
	Sketcher.widgets.AbstractWidget.call(this, parent);
	this.name = name;
	this.color = color;

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_color_picker_container sk_color_picker_container_'+this.name.toLowerCase());

	this.field = document.createElement('input');
	this.field.setAttribute('class', 'sk_color_picker');
	this.field.addEventListener('blur', function(e) {
		Sketcher.UI.addColor(new Sketcher.ColorFromString(e.target.value));
	});
	this.node.appendChild(this.field);

	this.update = function() {
		this.color = Sketcher.color[this.name.toLowerCase()];
		this.field.style.backgroundColor = this.color.getHex();
		this.field.style.color = this.color.getHex();
		this.field.style.opacity = this.color.getAlpha();
		this.field.value = this.color.getRGBA();
	}

	this.parent.appendChild(this);
}

Sketcher.widgets.ColorSelection = function(parent) {
	Sketcher.widgets.Toolbox.call(this, parent);
	this.listenedEvents = ['toMemory', 'external', 'init', 'changeZValue', 'alphaBackground', 'webColorState', 'changeXYValue', 'changeInputValue', 'changeOpacityValue'];
	this.node.className += ' sk_color_selection';
	this.switchButton = this.appendChild(
		new Sketcher.widgets.Button(
			'Switch colors',
			function(e) {
				var tmp = Sketcher.color.foreground;
				Sketcher.color.foreground = Sketcher.color.background;
				Sketcher.color.background = tmp;
				Sketcher.UI.updatePalette();

				window.localStorage.setItem("foreground", Sketcher.color.foreground.getRGBA());
				window.localStorage.setItem("background", Sketcher.color.background.getRGBA());
			},
			this,
			'reply'
		)
	);
	this.switchButton.node.className += ' sk_color_switch';

	this.foreground = new Sketcher.widgets.ColorPicker(
		'Foreground',
		Sketcher.color.foreground,
		this
	);

	this.background = new Sketcher.widgets.ColorPicker(
		'Background',
		Sketcher.color.background,
		this
	);

	this.update = function() {
		this.foreground.update();
		this.background.update();
	}

	this.jscolor = jsColorPicker('input.sk_color_picker', {
		initStyle: 'display: none',
		multipleInstances: true,
		size: 3,
		actionCallback: (function(e, action) {
			if(
					this.listenedEvents.indexOf(action) > -1
				&&	this.jscolor.hasOwnProperty('current')
			) {
				var rgba = this.jscolor.current.color.colors.rgb;
				rgba.a = this.jscolor.current.color.colors.alpha;

				var color = new Sketcher.Color(rgba.r*255, rgba.g*255, rgba.b*255, rgba.a*255);
				if(action == 'toMemory') {
					Sketcher.UI.addColor(color);
				} else {
					if(this.jscolor[0] === this.jscolor.current) {
						this.foreground.color = color;
						Sketcher.color.foreground = color;
						window.localStorage.setItem("foreground", Sketcher.color.foreground.getRGBA());
					} else {
						this.background.color = color;
						Sketcher.color.background = color;
						window.localStorage.setItem("background", Sketcher.color.background.getRGBA());
					}
				}
				this.update();
			}
		}).bind(this),
		init: (function(elm, colors) {
			this.update();
		}).bind(this)
	});
}

Sketcher.widgets.Palette = function(parent, x, y) {

	function PaletteSingleton(parent, x, y) {
		Sketcher.widgets.Window.call(this, 'Palette', parent, x, y);

		this.buttons = new Sketcher.widgets.Toolbox(this);
		this.buttons.node.className += ' sk_colorbox';
		this.colors = [];

		var c = window.localStorage.getItem('palette');
		if(c != null) {
			JSON.parse(c).forEach((function(c) {
				this.colors.push(new Sketcher.ColorFromString(c));
			}).bind(this));
		}

		this.selectedColors = new Sketcher.widgets.ColorSelection(this);

		this._updateLocalStorage = function() {
			var colors = [];
			this.colors.forEach(function(c) {
				colors.push(c.getRGBA());
			});
			window.localStorage.setItem('palette', JSON.stringify(colors));
		}

		this._update = function() {
			Sketcher.widgets.Window.prototype.update.call(this);
			this.selectedColors.update();

			this.buttons.empty();
			this._addBasicColors();
			this.colors.forEach((function(color) {
				this.buttons.appendChild(
					new Sketcher.widgets.ColorButton(
						color.getHex(),
						color,
						this.buttons
					)
				);
			}).bind(this));
			this._updateLocalStorage();
		}

		this._colorExists = function(color) {
			var exists = false;
			Object.keys(Sketcher.Colors).forEach(function(c) {
				if(Sketcher.Colors[c].getRGBA() === color.getRGBA()) {
					exists = true;
				}
			});
			this.colors.forEach(function(c) {
				if(c.getRGBA() === color.getRGBA()) {
					exists = true;
				}
			});

			return exists;
		}

		this._addColor = function(color) {
			if(!this._colorExists(color)) {
				this.colors.push(color);
				this._update();

				return true;
			}

			return false;
		}

		this._deleteColor = function(color) {
			this.colors.splice(this.colors.indexOf(color), 1);
			this._update();
		}

		this._addBasicColors = function() {
			Object.keys(Sketcher.Colors).forEach((function(colorName) {
				this.buttons.appendChild(
					new Sketcher.widgets.ColorButton(
						colorName,
						Sketcher.Colors[colorName],
						this.buttons
					)
				);
			}).bind(this));
		}

		this._addBasicColors();

		return {
			update: this._update.bind(this),
			addBasicColors: this._addBasicColors.bind(this),
			addColor: this._addColor.bind(this),
			deleteColor: this._deleteColor.bind(this)
		};
	}

	var instance = instance || new PaletteSingleton(parent, x, y);

	return instance;
}
