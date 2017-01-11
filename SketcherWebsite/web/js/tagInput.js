var tagInput = function(settings = {}) {
	this.idPattern = settings.idPattern || 'sketch_tags___name___name';
	this.searchForElement = function() {
		var node = document.querySelector('.tagInput');

		if(node == null) {
			node = document.createElement('div');
			node.className = 'tagInput';
		}

		return node;
	};

	this.entity = settings.entity || 'tag';
	this.prototypeId = settings.prototypeId || 'sketch_tags';
	this.allowNew = settings.allowNew || false;
	this.dynamicUpdate = settings.dynamicUpdate || false;
	this.extraData = settings.extraData || '';

	this.node = settings.elm || this.searchForElement();
	this.node.className += ' tagInput';

	this.id = this.node.id || parseInt(Math.random()*1000000);
	this.node.id = this.id;

	// Create tags wrapper
	this.tagWrapper = document.createElement('div');
	this.tagWrapper.className = 'tagInputValueWrapper';
	this.node.insertBefore(this.tagWrapper, this.node.firstChild);
	this.inputsWrapper = document.createElement('div');
	this.inputsWrapper.className = 'tagInputValueWrapper';
	this.node.appendChild(this.inputsWrapper);

	// Get input or create it if it doesn't exist
	this.field = this.node.querySelector('input.tagInputField');
	if(this.field == null) {
		this.field = document.createElement('input');
		this.field.className = 'tagInputField';
		this.node.appendChild(this.field);
	}

	// Create tag selection tooltip
	this.tooltip = document.createElement('span');
	this.tooltip.className = 'tooltip tooltip-left';
	this.tooltipTagsList = document.createElement('ul');
	this.tooltipTagsList.className = 'tags';
	this.tooltip.appendChild(this.tooltipTagsList);

	this.node.appendChild(this.tooltip);

	this.tags = [];
	this.nTags = 0;	// Bloody javascript counting algorithm

	// Remove a tag
	//	id		Tag id
	this.remove = function(id) {
		delete this.tags[id];
		this.nTags -= 1;
	}

	// Append or edit a tag
	//	id		Tag id
	//	name	Tag name
	this.set = function(id, name, update = true) {
		if(this.tags[id] == undefined) {
			if(this.dynamicUpdate && update) {
				var x = new XMLHttpRequest();
				x.open('GET', '/'+this.entity+'/add/'+name+this.extraData, true);
				x.onreadystatechange = (function(that) {
					return function() {
						if(x.readyState == XMLHttpRequest.DONE && (x.status === 200 || x.status === 403 || x.status === 404)) {
							try {
								var res = JSON.parse(x.responseText);
								if(res.status == 'success') {
									k$.growl({	// Kickstart alert
										text: res.msg,
										delay: 2000,
										type: 'alert-green'
									});
								} else {
									k$.growl({	// Kickstart alert
										text: res.msg,
										delay: 10000,
										type: 'alert-red'
									});
									return;
								}
							} catch(e) {
								console.error('Received invalid response.', x.responseText);
								return;
							}
						}
					}
				}) (this);
				x.send();
			}

			this.nTags += 1;
			this.tags[id] = {
				'name': name,
				'label': document.createElement('span')
			};
			// Set style and content
			this.tags[id].label.className = 'label label-primary';
			this.tags[id].label.innerHTML = this.tags[id].name;

			// Create a remove button
			var deleteButton = document.createElement('a');
			deleteButton.href = '#';
			deleteButton.className = 'button close';
			deleteButton.innerHTML = '<i class="fa fa-close"></i>';
			deleteButton.setAttribute('data-id', this.nTags);
			deleteButton.addEventListener('mousedown', (function(e) {
				e.preventDefault();
				var id = (e.target || e.srcElement).parentElement.getAttribute('data-id');
				if(id) {
					id = id.replace(/[^\d]+/g, '');
					let input = document.getElementById(this.idPattern.replace('__name__', id));
					let parent = (e.target || e.srcElement).parentElement.parentElement.parentElement;
					let label = this.node.querySelector('a[data-id="'+id+'"]').parentNode;
					if(this.dynamicUpdate) {
						var x = new XMLHttpRequest();
						x.open('GET', '/'+this.entity+'/remove/'+decodeURIComponent(input.value)+this.extraData);
						x.onreadystatechange = (function() {
							if(x.readyState == XMLHttpRequest.DONE && (x.status === 200 || x.status === 403 || x.status === 404)) {
								try {
									var res = JSON.parse(x.responseText);
									if(res.status == 'success') {
										input.parentNode.removeChild(input);
										label.parentNode.removeChild(label);
										k$.growl({	// Kickstart alert
											text: res.msg,
											delay: 2000,
											type: 'alert-green'
										});
									} else {
										k$.growl({	// Kickstart alert
											text: res.msg,
											delay: 2000,
											type: 'alert-red'
										});
									}
								} catch(e) {
									console.log(e);
								}
							}
						}).bind(this);
						x.send();
					} else {
						input.parentNode.removeChild(input);
						label.parentNode.removeChild(label);
					}
				}
			}).bind(this), true);

			// Create input
			var input = document.getElementById(this.idPattern.replace(/__name__/g, this.nTags));
			if(input == null) {
				// var inputText = document.getElementById(this.prototypeId).dataset.prototype;
				input = document.createElement('input');
				input.id = this.idPattern.replace(/__name__/g, this.nTags);
				input.name = 'sketch['+this.entity+'s]['+this.nTags+'][name]';
				input.type = 'text';
				input.className += ' tagInputValue';
				input.setAttribute('value', name);

				this.inputsWrapper.appendChild(input);
			}

			this.tags[id].label.appendChild(deleteButton);
			this.tagWrapper.appendChild(this.tags[id].label);
		}
	}

	// Refresh tags
	this.refresh = function(update = false) {
		this.node.querySelectorAll('input.tagInputValue').forEach(function(input) {
			this.set(input.getAttribute('id').replace(/[^\d]+/g, ''), input.value, update);
		}, this);
	}

	this.searchForTokens = function() {
		if(this.field.value.length > 1 && this.lastValue != this.field.value && this.field.value.length > 0) {
			var x = new XMLHttpRequest();
			x.open('GET', '/'+this.entity+'/search/'+this.field.value, true);
			x.onreadystatechange = (function(that) {
				return function() {
					if(x.readyState == XMLHttpRequest.DONE && (x.status === 200 || x.status === 403 || x.status === 404)) {
						var tags = JSON.parse(x.responseText);

						that.tooltipTagsList.innerHTML = '';
						if(tags.length > 0) {
							var first = true;
							tags.forEach(function(tag) {
								var li = document.createElement('li');
								li.innerHTML = tag.name;
								li.dataset.id = tag.id;
								if(first) {
									li.className = 'active';
									first = false;
								}
								that.tooltipTagsList.appendChild(li);
							});

							that.tooltip.style.opacity = 1;
						} else {
							that.tooltip.style.opacity = 0;
						}
					}
				}
			}) (this);
			x.send();
			this.lastValue = this.field.value;
		} else {
			this.tooltip.style.opacity = 0;
		}
	}

	this.refresh(false);

	//////
	// Events
	this.field.addEventListener('keydown', (function(that) {
		return function(e) {
			if(e.keyCode == 13 && that.field.value.length > 0) {
				e.preventDefault();
				if(that.tooltip.style.opacity > 0) {	// Tooltip is shown
					var tag = that.tooltipTagsList.querySelector('li.active');
					if(tag == null)
						console.error('An error occured.');
					else {
						that.set(tag.dataset.id, tag.innerHTML);
						that.field.value = '';
					}
				} else {
					if(that.allowNew) {
						that.set(that.tags.length, that.field.value);
					}
					that.field.value = '';
				}
			}
		}
	}) (this));
	this.field.addEventListener('keyup', (function(that) {
		return function(e) {
			// console.log('Key code : '+e.keyCode);
			if((e.keyCode == 40 || e.keyCode == 38) && that.tooltip.style.opacity > 0) {
				var active = that.tooltipTagsList.querySelector('li.active');
				var next = (e.keyCode == 40
					? active.nextSibling || that.tooltipTagsList.firstChild
					: active.previousSibling || that.tooltipTagsList.lastChild);
				active.className = active.className.replace(/(^| )active($| )/, '\1');
				next.className += ' active';
			} else {
				that.searchForTokens();
			}
		}
	}) (this), false);

	this.field.addEventListener('blur', (function(that) {
		return function(e) {
			that.tooltip.style.opacity = 0;
		}
	}) (this), false);

	return {
		'node': this.node,
		'tagWrapper': this.tagWrapper,
		'tooltip': this.tooltip,
		'tags': this.tags,
		'nTags': this.nTags,
		'remove': this.remove,
		'refresh': this.refresh,
		'createTagFromInput': this.createTagFromInput,
		'searchForTokens': this.searchForTokens,
		'set': this.set,
	};
}
