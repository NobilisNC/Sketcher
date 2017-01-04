document.addEventListener('DOMContentLoaded', function(e) {
	var inputs = document.querySelectorAll('div.tagInput');
	inputs.forEach(function(input) {
		input.prependChild = function(node) {
		    if(this.firstChild)
				this.insertBefore(node, this.firstChild);
		    else
				this.appendChild(node);
		};
		var field = input.querySelector('input.tagInputField');
		var searchToken = false;
		var fieldValue = field.value;

		var tooltip = document.createElement('span');
		tooltip.className = 'tooltip tooltip-left';
		input.appendChild(tooltip);

		var searchForToken = function() {
			if(fieldValue != field.value && field.value != '') {
				var x = new XMLHttpRequest();
				x.open('GET', '/tag/search/'+field.value, true);
				x.onreadystatechange = function() {
					if(x.readyState == XMLHttpRequest.DONE && x.status === 200) {
						var tags = JSON.parse(x.responseText);

						if(tags.length > 0) {
							var s = '<ul class="tags">';

							tags.forEach(function(tag) {
								s += '<li>'+tag.name+'</li>';
							});

							s += '</ul>';

							tooltip.innerHTML = s;
							tooltip.style.opacity = 1;
						} else {
							tooltip.style.opacity = 0;
						}
					}
				};
				x.send();
				fieldValue = field.value;
			}
			searchToken = true;
		}

		field.addEventListener('keyup', function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
			} else {
				if(!searchToken) {
					searchForToken();
				} else {
					window.clearTimeout(searchToken);
					searchToken = window.setTimeout(function() { searchForToken(); searchToken = false; }, 500);
				}
			}
		});

		field.addEventListener('blur', function(e) {
			tooltip.style.opacity = 0;
		});

		var values = input.querySelectorAll('input.tagInputValue');
		values.forEach(function(val) {
			var fontSize = window.getComputedStyle(val, null).getPropertyValue('font-size');
			var width = val.value.length*10;
			var label = document.createElement('span');
			label.className = 'label label-primary';
			label.innerHTML = val.value;
			var deleteButton = document.createElement('a');
			deleteButton.href = '#';
			deleteButton.className = 'button close';
			deleteButton.innerHTML = '<i class="fa fa-close"></i>';
			deleteButton.setAttribute('data-id', val.getAttribute('id'));
			deleteButton.addEventListener('mousedown', function(e) {
				e.preventDefault();
				var id = e.srcElement.parentElement.getAttribute('data-id');
				if(id) {
					input.removeChild(document.getElementById(id));
					input.removeChild(this.parentNode);
				}
			}, true);
			label.appendChild(deleteButton);
			input.prependChild(label);
		});
		var last = values[values.length-1];
		var width = input.offsetWidth-10-(last.offsetLeft+last.offsetWidth);
		if(width < 30)
			field.style.width = '100%';
		else
			field.style.width = width+'px';
	});
});
