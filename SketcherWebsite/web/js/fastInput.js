var fastInput = function(settings = {}) {
	this.node = settings.elm || document.querySelector('.fastInput');
	if(this.node == undefined)
		return undefined;

	this.extraData = settings.extraData || "";
	this.collaterals = (settings.updateClass ? document.querySelectorAll(settings.updateClass) : []);

	this._onKeyDown = function(e) {
		if(e.keyCode == 13) {
			e.preventDefault()
			this.val = encodeURIComponent((e.target || e.srcElement).value);
			var x = new XMLHttpRequest();
			x.open('GET', '/title/set'+this.extraData+'/'+this.val);
			x.onreadystatechange = (function() {
				if(x.readyState == XMLHttpRequest.DONE && x.status === 200) {
					try {
						let res = JSON.parse(x.responseText);
						if(res.status == 'success') {
							k$.growl({	// Kickstart alert
								text: res.msg,
								delay: 2000,
								type: 'alert-green'
							});
							if(this.collaterals) {
								Array.prototype.forEach.call(this.collaterals, (function(col) {
									col.innerHTML = decodeURIComponent(this.val);
								}).bind(this));
							}
						} else {
							k$.growl({	// Kickstart alert
								text: res.msg,
								delay: 2000,
								type: 'alert-red'
							});
						}
					} catch(e) {
						k$.growl({	// Kickstart alert
							text: "Received invalid response from server.",
							delay: 2000,
							type: 'alert-red'
						});
					}
				}
			}).bind(this);
			x.send();
		}
	}

	this.node.addEventListener('keydown', this._onKeyDown.bind(this));

	return {
		collaterals: this.collaterals,
		val: this.node.value
	};
}
