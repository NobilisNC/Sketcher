Sketcher.AbstractWidget = function(parent) {
	this.parent = parent || null;
	this.node = null;
};

Sketcher.Window = function(title, parent) {
	Sketcher.AbstractWidget.call(this, parent);

	this.titleText = title;
	this.dragged = false;

	this.node = document.createElement('div');
	this.node.setAttribute('class', 'sk_window');

	this.title = document.createElement('h1');
	this.title.setAttribute('class', 'sk_window_title');
	this.title.innerHTML = this.titleText;

	this.node.appendChild(this.title);

	this.parent.appendChild(this.node);

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

		this.dragged = true;
		this.node.setAttribute('data-x', e.offsetX);
		this.node.setAttribute('data-y', e.offsetY);

		document.body.addEventListener('mousemove', this.onMouseMove);
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
}

Sketcher.Button = function(title, action, icon, parent) {
	AbstractWidget.call(this, parent);

	this.title = title;
	this.action = action;
	this.icon = icon || '';
	this.node = document.createElement('a');
	this.node.setAttribute('class', 'sk_button');
	this.node.innerHTML = this.title;
}
