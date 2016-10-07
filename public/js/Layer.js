class Layer {
	constructor(name, zIndex, width, height, frame) {
		this.id = Math.round(Math.random()*1000000)%1000000;
		this.name = name;
		this.zIndex = zIndex;
		this.node = document.createElement('canvas');
		this.node.setAttribute('id', 'sk_layer_'+this.id);
		frame.appendChild(this.node);
		this.visible = true;
		this.width = width;
		this.height = height;
		this.node.width = this.width;
		this.node.height = this.height;
		this.opacity = 1;

		this.update();
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
}
