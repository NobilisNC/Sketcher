class Layer {
	constructor(name, zIndex, width, height, frame) {
		this.id = Math.round(Math.random()*1000000)%1000000;
		this.name = name;
		this.zIndex = zIndex;
		this.node = document.createElement('canvas');
		this.visible = true;
		this.focus = false;
		this.width = width;
		this.height = height;
		this.opacity = 1;

		this.node.width = this.width;
		this.node.height = this.height;
		this.node.setAttribute('id', 'sk_layer_'+this.id);
		frame.appendChild(this.node);

		this.update();
	}

	createMenuItem(container) {
		this.menuItem = document.createElement('li');
		this.menuItem.setAttribute('data-id', this.id);
		this.menuItem.setAttribute('data-name', this.name);
		if(this.focus)
			this.menuItem.setAttribute('class', 'active');

		// Create a container for layer commands
		var div = document.createElement('div');
		div.setAttribute('class', 'sk_layer_commands');

		// Create buttons for layer commands
		var aSel = document.createElement('a');
		aSel.setAttribute('data-action', 'selectLayer');
		aSel.setAttribute('class', 'sk_layer_link');
		aSel.innerHTML = this.name[0].toUpperCase() + this.name.substr(1);
		this.menuItem.appendChild(aSel);

		var thumb = document.createElement('div');
		thumb.setAttribute('data-id', this.id);
		thumb.setAttribute('class', 'sk_layer_thumbnail');
		var thumbImg = document.createElement('img');
		thumbImg.src = this.thumbnail == undefined ? '' : this.thumbnail;
		thumb.appendChild(thumbImg);
		aSel.appendChild(thumb);

		var aVis = document.createElement('a');
		aVis.setAttribute('data-action', 'toggleLayerVisibility');
		aVis.setAttribute('class', 'sk_check');
		aVis.innerHTML = '<i class="fa fa-eye' + (this.isVisible() ? '' : '-slash') + '"></i>';
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

		this.menuItem.appendChild(div);

		container.appendChild(this.menuItem);

		Array.prototype.forEach.call(
			this.menuItem.querySelectorAll('a[data-action="selectLayer"], a[data-action="toggleLayerVisibility"], a[data-action="deleteLayer"], a[data-action="raiseLayer"], a[data-action="demoteLayer"]'),
			function(btn){
				if(btn.parentNode.tagName == "LI") {
					var id = btn.parentNode.getAttribute("data-id");
				} else {
					var id = btn.parentNode.parentNode.getAttribute("data-id");
				}
				var action = btn.getAttribute("data-action");
				btn.addEventListener('click', function(e) {
					S[action](id);
					SketcherUI.updateLayers();
				});
			}
		);
	}

	update() {
		this.node.style.display = this.visible ? 'block' : 'none';
		this.node.style.zIndex = this.zIndex;

		this.updateThumbnail();
	}

	updateThumbnail() {
		var ctx = this.node.getContext('2d');
		var before = new Image();
		var scale = 200/this.width;

		before.src = this.node.toDataURL("image/png");
		before.onload = (function(e) {
			var ctx = this.node.getContext('2d');

			this.node.width = 200;
			this.node.height = this.height*scale;
			ctx.scale(scale, scale);
			ctx.drawImage(before, 0, 0);
			this.thumbnail = this.node.toDataURL("image/png");
			this.node.width = this.width;
			this.node.height = this.height;

			ctx.drawImage(e.target, 0, 0);

			var img = document.querySelector('.sk_layer_thumbnail[data-id="' + this.id + '"]');
			if(img != null) {
				img.querySelector('img').src = this.thumbnail;
			}
		}).bind(this);
	}

	toggleVisibility() {
		this.visible = this.visible ? false : true;
		this.update();
	}

	setVisibility(visibility) {
		this.visible = visibility;
		this.update();
	}

	isVisible() {
		return this.visible;
	}

	getContext() {
		return this.node.getContext('2d');
	}

	select() { this.focus = true; }
	blur() { this.focus = false; }
}
