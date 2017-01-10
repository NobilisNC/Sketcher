/*
/	UI module
/	 This module controls Widgets and user interaction
*/
Sketcher.UI = (function(document, window) {

	// Constructor
	var UISingleton = function(document, window) {
		Sketcher.widgets.AbstractWidget.call(this, Sketcher.Core.frame);
		this.node = Sketcher.createElement('sketcher_ui', Sketcher.node);

		// Create UI components containers
		this.layerControl = new Sketcher.widgets.LayerControl(this, window.innerWidth-271, 45);
		this.toolControl = new Sketcher.widgets.ToolControl(this, 10, 215);
		this.palette = new Sketcher.widgets.Palette(this, 10, 45);

		this.update = function() {
			let scrollCompensate = (function() {	// Dirty hack
			    var inner = document.createElement('p');
			    inner.style.width = "100%";
			    inner.style.height = "200px";

			    var outer = document.createElement('div');
			    outer.style.position = "absolute";
			    outer.style.top = "0px";
			    outer.style.left = "0px";
			    outer.style.visibility = "hidden";
			    outer.style.width = "200px";
			    outer.style.height = "150px";
			    outer.style.overflow = "hidden";
			    outer.appendChild(inner);

			    document.body.appendChild(outer);
			    var w1 = inner.offsetWidth;
			    outer.style.overflow = 'scroll';
			    var w2 = inner.offsetWidth;
			    if (w1 == w2) w2 = outer.clientWidth;

			    document.body.removeChild(outer);

			    return (w1 - w2);
			})();

			this.node.width = window.innerWidth-scrollCompensate;
			this.node.height = window.innerHeight-(Sketcher.Core.width > window.innerHeight ? scrollCompensate : 0);
			Sketcher.node.style.width = this.node.width+'px';
			Sketcher.node.style.height = this.node.height+'px';

			this.layerControl.update(true);
			this.palette.update();
		}

		this.update();
		this.palette.update();
		this.layerControl.update();

		window.addEventListener('resize', (function(e) { this.update(); }).bind(this));

		return {
			addColor: this.palette.addColor,
			deleteColor: this.palette.deleteColor,
			updatePalette: this.palette.update,
			updateLayers: this.layerControl.update,
			updateOpacitySlider: this.layerControl.layerButtons.widgets.opacitySlider.update.bind(this.layerControl.opacitySlider)
		};
	}

	var instance = instance || new UISingleton(document, window);

	return instance;
})(document, window);
