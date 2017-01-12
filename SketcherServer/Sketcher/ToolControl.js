/*
/	A draggable window with tool options panel
*/
Sketcher.widgets.ToolOptions = function(parent, tool) {
	Sketcher.widgets.Toolbox.call(this, parent);

	this.fields = {};

	Object.keys(tool.options).forEach((function(option){
		let label = document.createElement('label');
		label.innerHTML = option[0].toUpperCase()+option.substr(1);
		let input = document.createElement('input');
		let error = false;
		if(['thickness', 'size'].indexOf(option) > -1) {
			input.type = 'number';
			input.value = tool.options[option];
			input.min = tool.options[option];
			input.step = 0.1;

			input.addEventListener('keyup', (function(e) {
				tool.options[option] = (e.target || e.srcElement).value;
			}).bind(this));
		} else if(['fill', 'stroke'].indexOf(option) > -1) {
			input.type = 'checkbox';
			input.checked = tool.options[option];

			input.addEventListener('mousedown', (function(e) {
				tool.options[option] = !(e.target || e.srcElement).checked;
			}).bind(this));
		} else if(option == 'text') {
			input.type = 'text';
			input.value = 'Text';

			input.addEventListener('keyup', (function(e) {
				tool.options[option] = e.srcElement.value;
			}).bind(this));
		} else
			error = true;

		if(!error)
			this.fields[option] = {
				'input': input,
				'label': label
			}
	}).bind(this));

	Object.keys(this.fields).forEach((function(field){
		let wrapper = document.createElement('div');
		wrapper.className = 'sk_tool_option';
		wrapper.appendChild(this.fields[field].label);
		wrapper.appendChild(this.fields[field].input);

		this.appendChild(wrapper);
	}).bind(this));

	this.update = function() {
		this.node.style.display = (tool == Sketcher.Tools.getTool() ? 'block' : 'none');
	}

	this.update();
}

/*
/	Window with tool options panel and tools menu
*/
Sketcher.widgets.ToolControl = function(parent, x = 0, y = 0) {
	Sketcher.widgets.Window.call(this, 'Tools', parent, x, y);

	this.toolsOptions = {};
	this.toolButtons = new Sketcher.widgets.Toolbox(this);
	Object.keys(Sketcher.Tools.toolsList).forEach((function(toolName){
		let tool = Sketcher.Tools.toolsList[toolName];
		let button = new Sketcher.widgets.Button(
			toolName,
			(function(e) {
				Sketcher.Core.setTool(toolName);

				this.update();
				// this.setTool(tool[0]);
			}).bind(this),
			this,
			Sketcher.Tools.toolsList[toolName].icon
		)
		if(tool == Sketcher.Tools.getTool())
			button.node.className += ' active';

		this.toolButtons.addWidget(toolName, button);

		// Create options panel
		this.toolsOptions[toolName] = new Sketcher.widgets.ToolOptions(
			this,
			tool
		);

	}).bind(this));

	this._update = function() {
		Sketcher.widgets.Window.prototype.update.call(this);
		let currentToolName = Sketcher.Tools.getTool().constructor.name.substring(1);

		Object.keys(Sketcher.Tools.toolsList).forEach((function(toolName) {
			this.toolButtons.widgets[toolName][(toolName == currentToolName ? 'setActive' : 'setInactive')]();
			this.toolsOptions[toolName].update();
		}).bind(this));
	}

	this.update = this._update.bind(this);
};
