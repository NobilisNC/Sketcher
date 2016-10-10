/*
/	Abstract Widget
/	 Parent class for every widget
*/
Sketcher.AbstractWidget = function Widget(parent) {
	this.parent = parent || null;
	this.node = null;

	this.setParent = function(node) {
		if(typeof node == 'object') {
			this.parent = node;
			return true;
		}
		else {
			return false;
		}
	}

	this.appendChild = function(node) {
		if((
			typeof Node === 'object'
			?	node instanceof Node
			:	node
				&& typeof node === 'object'
				&& typeof node.nodeType === 'number'
				&& typeof node.nodeName === 'string'
		)) {
			this.node.appendChild(node);
		} else {
			return false;
		}
	}

	this.empty = function() {
		while (this.node.firstChild) {
			this.node.removeChild(this.node.firstChild);
		}
	}
};

/*
/	Window widget
/	 A draggable window that contains other Widgets
*/
Sketcher.Window = function(title, parent, x = 0, y = 0) {
	Sketcher.AbstractWidget.call(this, parent);

	this.titleText = title;
	this.dragged = false;

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

			if(x >= 0 && x + this.node.offsetWidth <= Sketcher.node.offsetWidth) {
				this.node.style.left = x + 'px';
			} else {
				if(x < 0) {
					this.node.style.left = '0px';
				} else {
					this.node.style.left = (Sketcher.node.offsetWidth - this.node.offsetWidth) + 'px';
				}
			}

			if(y >= 0 && y + this.node.offsetHeight <= Sketcher.node.offsetHeight) {
				this.node.style.top = y + 'px';
			} else {
				if(y < 0) {
					this.node.style.top = '0px';
				} else {
					this.node.style.top = (Sketcher.node.offsetHeight - this.node.offsetHeight) + 'px';
				}
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

	this.appendChild(this.title);
	this.parent.appendChild(this.node);
}

Sketcher.Toolbox = function(parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_toolbox');

	this.parent = parent;
	this.parent.appendChild(this.node);
}

Sketcher.LayerItem = function(layer, parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.layer = layer;
	this.thumbnailData = '';

	this.node = document.createElement('li');
	this.node.setAttribute('data-id', this.layer.id);
	this.node.setAttribute('data-name', this.layer.name);

	if(this.layer.focus)
		this.node.setAttribute('class', 'active');

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
	this.thumbnailImg.src = this.thumbnailData == undefined ? '' : this.thumbnailData;
	this.thumbnail.appendChild(this.thumbnailImg);
	this.btnSelect.appendChild(this.thumbnail);

	this.btnVisibility = document.createElement('a');
	this.btnVisibility.setAttribute('data-action', 'toggleLayerVisibility');
	this.btnVisibility.setAttribute('class', 'sk_check');
	this.btnVisibility.innerHTML = '<i class="fa fa-eye' + (this.layer.isVisible() ? '' : '-slash') + '"></i>';
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

	this.btnDemote = document.createElement('a');
	this.btnDemote.setAttribute('data-action', 'demoteLayer');
	this.btnDemote.setAttribute('class', 'sk_check');
	this.btnDemote.innerHTML = '<i class="fa fa-arrow-down"></i>';
	this.commands.appendChild(this.btnDemote);

	this.node.appendChild(this.commands);

	Array.prototype.forEach.call(
		this.node.querySelectorAll('a[data-action="selectLayer"], a[data-action="toggleLayerVisibility"], a[data-action="deleteLayer"], a[data-action="raiseLayer"], a[data-action="demoteLayer"]'),
		function(btn){
			if(btn.parentNode.tagName == "LI") {
				var id = btn.parentNode.getAttribute("data-id");
			} else {
				var id = btn.parentNode.parentNode.getAttribute("data-id");
			}
			var action = btn.getAttribute("data-action");
			btn.addEventListener('click', function(e) {
				Sketcher.Core[action](id);
				Sketcher.UI.updateLayers();
			});
		}
	);

	this.updateThumbnail = function() {
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
}

Sketcher.LayerList = function(parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.node = document.createElement('ul');
	this.node.setAttribute('id', 'sk_layers_list');
	this.parent.appendChild(this.node);
}

/*
/	Button widget
/	 A button that triggers an action.
/	Can be filled with an icon or a text (if no icon is specified).
*/
Sketcher.Button = function(title, action, parent, icon) {
	Sketcher.AbstractWidget.call(this, parent);
	this.title = title;
	this.action = action;
	this.icon = icon || '';
	this.node = document.createElement('a');
	this.node.setAttribute('class', 'sk_button');
	this.node.innerHTML = this.icon == '' ? this.title : '<i class="fa fa-'+this.icon+'"></i>';
	this.node.addEventListener('click', this.action);

	if(parent && typeof parent == 'object' && parent.hasOwnProperty('appendChild')) {
		this.parent = parent;
		this.parent.appendChild(this.node);
	}
}

Sketcher.Palette = function(parent) {

	function PaletteSingleton(parent) {
		Sketcher.Window.call(this, 'Palette', parent);

		this.buttons = new Sketcher.Toolbox(this);
		this.colors = [];
		console.log(new Sketcher.ColorFromString("rgba(255, 100, 0, 1)"));
		console.log(new Sketcher.ColorFromString("rgba(255, 100, 0, .9)"));
		console.log(new Sketcher.ColorFromString("rgba(255, 100, 0, 0.9)"));
		console.log(new Sketcher.ColorFromString("rgb(0, 100, 255)"));
	}

	var instance = instance || new PaletteSingleton(parent);

	return instance;
}
