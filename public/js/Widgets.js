var AbstractWidget = function(parent) {
	this.parent = parent || null;
	this.node = null;
};

var Window = function(title, parent) {
	AbstractWidget.call(this, parent);

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

			console.log(x, y);

			if(x >= 0 && x + this.node.offsetWidth <= document.getElementById('sk_container').offsetWidth) {
				this.node.style.left = x + 'px';
			} else {
				if(x < 0) {
					this.node.style.left = '0px';
				} else {
					this.node.style.left = (document.getElementById('sk_container').offsetWidth - this.node.offsetWidth) + 'px';
				}
			}

			if(y >= 0 && y + this.node.offsetHeight <= document.getElementById('sk_container').offsetHeight) {
				this.node.style.top = y + 'px';
			} else {
				if(y < 0) {
					this.node.style.top = '0px';
				} else {
					this.node.style.top = (document.getElementById('sk_container').offsetHeight - this.node.offsetHeight) + 'px';
				}
			}
		}
	}

	this.onMouseUp = this._onMouseUp.bind(this);
	this.onMouseDown = this._onMouseDown.bind(this);
	this.onMouseMove = this._onMouseMove.bind(this);

	this.title.addEventListener('mousedown', this.onMouseDown, true);
	document.body.addEventListener('mouseup', this.onMouseUp, true);
}
