var idPattern = 'sketch_tags___name___name';
var tagInput = function(elm = null) {
	this.searchForElement = function() {
		var node = document.querySelector('.tagInput');

		if(node == null) {
			node = document.createElement('div');
			node.className = 'tagInput';
		}

		return node;
	};

	this.node = elm || this.searchForElement();

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
		this.field = this.node.createElement('input');
		this.field.className = 'tagInputField';
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
	this.set = function(id, name) {
		if(this.tags[id] == undefined) {
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
			deleteButton.setAttribute('data-id', id);
			deleteButton.addEventListener('mousedown', function(e) {
				e.preventDefault();
				var id = e.srcElement.parentElement.getAttribute('data-id').replace(/[^\d]+/g, '');
				if(id) {
					var parent = this.parentElement.parentElement;
					var input = document.getElementById(idPattern.replace('__name__', id));
					input.parentNode.removeChild(input);
					var label = document.querySelector('a[data-id="'+id+'"]').parentNode;
					label.parentNode.removeChild(label);
				}
			}, true);

			// Create input
			var input = document.getElementById(idPattern.replace('__name__', this.nTags));
			if(input == null) {
				var inputText = document.getElementById('sketch_tags').dataset.prototype;
				this.inputsWrapper.innerHTML += inputText.replace(/.*(<input[^\/]+\/>).*/,'$1').replace(/__name__/g, this.nTags);
				input = document.getElementById(idPattern.replace(/__name__/g, this.nTags));
				input.type = 'text';
				input.className += ' tagInputValue';
				input.value = name;
			}

			this.tags[id].label.appendChild(deleteButton);
			this.tagWrapper.appendChild(this.tags[id].label);
		}
	}

	// Refresh tags
	this.refresh = function() {
		document.querySelectorAll('input.tagInputValue').forEach(function(input) {
			this.set(input.getAttribute('id').replace(/[^\d]+/g, ''), input.value);
		}, this);
	}

	this.searchForTokens = function() {
		if(this.lastValue != this.field.value && this.field.value.length > 0) {
			var x = new XMLHttpRequest();
			x.open('GET', '/tag/search/'+this.field.value, true);
			x.onreadystatechange = (function(that) {
				return function() {
					if(x.readyState == XMLHttpRequest.DONE && x.status === 200) {
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

	this.refresh();

	//////
	// Events
	this.field.addEventListener('keydown', (function(that) {
		return function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				if(that.tooltip.style.opacity > 0) {	// Tooltip is shown
					var tag = that.tooltipTagsList.querySelector('li.active');
					if(tag == null)
						console.err('An error occured.');
					else {
						that.set(tag.dataset.id, tag.innerHTML);
						that.field.value = '';
					}
				} else {
					that.set(that.tags.length, that.field.value);
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

var tags = new tagInput();
