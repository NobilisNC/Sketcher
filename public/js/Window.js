class Window {
	constructor(titleText, parent) {
		this.node = document.createElement('div');
		this.node.setAttribute('class', 'sk_window');

		this.title = document.createElement('h1');
		this.title.setAttribute('class', 'sk_window_title');
		this.title.innerHTML = titleText;
		this.node.appendChild(this.title);

		this.toolbox = document.createElement('div');
		this.toolbox.setAttribute('class', 'sk_toolbox');
		this.node.appendChild(this.toolbox);

		parent.appendChild(this.node);

		this.onMouseUp = this._onMouseUp.bind(this);
		this.onMouseDown = this._onMouseDown.bind(this);
		this.onMouseMove = this._onMouseMove.bind(this);

		this.addFoldButton();
		this.addListeners();
	}

	_onMouseUp(e) {
		var elm;
		Array.prototype.forEach.call(
			document.querySelectorAll('.sk_window_title'),
			(function(elm) {
				var win = elm.parentNode;
				if(win.getAttribute('data-dragged') == '1') {
					win.removeAttribute('data-dragged');
					win.removeAttribute('data-x');
					win.removeAttribute('data-y');
					document.body.removeEventListener('mousemove', this.onMouseMove);
				}
			}).bind(this)
		);
	}

	_onMouseDown(e) {
		if(e.target.getAttribute('class') == 'sk_window_title') {
			e.preventDefault();
			e.stopPropagation();

			var win = e.srcElement.parentNode;
			win.setAttribute('data-dragged', '1');
			win.setAttribute('data-x', e.offsetX);
			win.setAttribute('data-y', e.offsetY);

			document.body.addEventListener('mousemove', this.onMouseMove);
		}
	}

	_onMouseMove(e) {
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

	addFoldButton() {
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

	addListeners() {
		document.body.addEventListener('mousedown', this.onMouseDown, true);
		document.body.addEventListener('mouseup', this.onMouseUp, true);
	}
}
