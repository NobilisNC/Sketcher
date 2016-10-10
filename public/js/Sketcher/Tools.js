Sketcher.ToolsAbstract = ( function() {

	/*
	*	Abstract Tools
	*/
	function _Tool( c, lw) {
		this.color = c;
		this.line_width = lw;
		this._stroke = true;
	}

	_Tool.prototype.setColor = function (c) {
		this.color = c;
	}

	_Tool.prototype.setLineWidth = function (lw) {
		this.line_width = lw;
	}

	_Tool.prototype.stroke = function (stroke) {
		if (typeof stroke === 'boolean')
			this._stroke = stroke;

		return this._stroke;

	}

	//AbstractFunctions
	_Tool.prototype.onMouseDown;
	_Tool.prototype.onMouseMove;
	_Tool.prototype.onMouseUp;


	_Tool.prototype.config_context = function (ctx) {
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.line_width;
	};


	/* Class Line extend _Tool
	*
	*
	*
	*/
	function Line(c, lw) {
		_Tool.call(this, c, lw)
		this.p1;
		this.p2;
	}

	Line.prototype = Object.create(_Tool.prototype);
	Line.prototype.constructor = Line;

	Line.prototype.draw = function (ctx) {
			//Conf du tracé
			// ...

			ctx.beginPath();
			ctx.moveTo(this.p1.x, this.p1.y);
			ctx.lineTo(this.p2.x,this.p2.y);
			ctx.closePath();
			ctx.stroke();
	}

	Line.prototype.onMouseDown = function (e) {

		this.p1 = {x : e.offsetX, y : e.offsetY };


	}

	Line.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

	}

	Line.prototype.onMouseUp = function (e, ctx) {
		this.p2 = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"Line","data":' + JSON.stringify(this) + '}';
	}


	/* Class Rect extends _Tool
		*
		*
		*
		*/
	function Rect( c, lw, cf ) {
		_Tool.call(this, c, lw);
		this._fill_color =  cf;
		this._fill = false;
	}

	Rect.prototype = Object.create(_Tool.prototype);
	Rect.prototype.constructor = Rect;

	Rect.prototype.setFillColor = function(cf) {
		this._fill_color = cf;
	}

	Rect.prototype.fill = function (fill) {
		if (typeof fill === 'boolean')
			this._fill = fill;

		return this._fill;
	}

	Rect.prototype.draw = function (ctx) {

		ctx.fillStyle = this.cf;
		if(this._fill)
			ctx.fillRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);
		if (this._stroke)
			ctx.strokeRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);

	}

	Rect.prototype.onMouseDown = function (e, ctx) {
		this.p1 = {x : e.offsetX, y : e.offsetY };
	}

	Rect.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);
	}

	Rect.prototype.onMouseUp = function (e, ctx) {
		this.p2 = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"Rect","data":' + JSON.stringify(this) + '}';
	}

	/* Class Pencil extends _Tool
	*
	*
	*
	*/
	function Pencil( c, lw, cf ) {
		_Tool.call(this, c, lw);
		this.p0;
		this.points = [];
		}

		Pencil.prototype = Object.create(_Tool.prototype);
		Pencil.prototype.constructor = Pencil;

		Pencil.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.p0.x, this.p0.y);
		for (var point of this.points) {
				ctx.lineTo(point.x, point.y);
		}
		ctx.stroke();
		ctx.closePath();

	}

	Pencil.prototype.onMouseDown = function (e, ctx) {
		this.p0 =  {x : e.offsetX, y : e.offsetY };
		this.points = [];
	}

	Pencil.prototype.onMouseMove = function (e, ctx) {
		this.points.push ( {x : e.offsetX, y : e.offsetY } );
		this.config_context(ctx);
		this.draw(ctx);
	}

	Pencil.prototype.onMouseUp = function (e, ctx) {
		this.points.push ( {x : e.offsetX, y : e.offsetY } );
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"Pencil","data":' + JSON.stringify(this) + '}';
	}

	/* Class Circle extends _Tool
	*
	*
	*
	*/
	function Circle( c, lw, cf ) {
		_Tool.call(this, c, lw);
		this._fill_color =  cf;
		this._fill = false;
	}

	Circle.prototype = Object.create(_Tool.prototype);
	Circle.prototype.constructor = Circle;

	Circle.prototype.setFillColor = function(cf) {
		this._fill_color = cf;
	}

	Circle.prototype.fill = function (fill) {

		console.log(fill)
		console.log(typeof fill);
		if (typeof fill === 'boolean')
			this._fill = fill;

		return this._fill;
	}

	Circle.prototype.draw = function (ctx) {

		ctx.fillStyle = this.cf;
		ctx.beginPath();
		ctx.arc(this.p1.x,this.p1.y,Math.sqrt( Math.pow(this.p2.x-this.p1.x, 2) + Math.pow(this.p2.y-this.p1.y,2) ),0, 2*Math.PI);
		if (this._fill)
			ctx.fill();
		if (this._stroke)
			ctx.stroke();

	}

	Circle.prototype.onMouseDown = function (e, ctx) {
		this.p1 = {x : e.offsetX, y : e.offsetY };


	}

	Circle.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);
	}

	Circle.prototype.onMouseUp = function (e, ctx) {
		this.p2 = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"Circle","data":' + JSON.stringify(this) + '}';
	}


	/* Class Paint Bucket extends _Tool
	*
	*
	*
	*/
	function PaintBucket( c, lw, width, height) {
		_Tool.call(this, c, lw);
		this.width = width;
		this.height = height;
	}

    PaintBucket.prototype = Object.create(_Tool.prototype);
	PaintBucket.prototype.constructor = PaintBucket;


	PaintBucket.prototype.draw = function (ctx) {
		var img = ctx.getImageData(0,0,this.width, this.height);
		var pos =  (this.p.y * this.width + this.p.x) * 4; 
		var targetColor = {r : img.data[pos], g : img.data[pos +1 ], b : img.data[pos +2],a: img.data[pos +3]};
		console.log(targetColor);
		
		//var P = [];
		//P.push 



		

		

	

	}

	PaintBucket.prototype.onMouseDown = function (e, ctx) {
		
	}

	PaintBucket.prototype.onMouseMove = function (e, ctx) {

	}

	PaintBucket.prototype.onMouseUp = function (e, ctx) {
		this.p = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"PaintBucket","data":' + JSON.stringify(this) + '}';
	}


	/* Function factory 
	* Allow to parse JSON to _Tool
	*/
	function factory(json_str) {

		rawObject = JSON.parse(json_str, ctx);

		if (rawObject.type === "Line")
			c = Line;
		else if (rawObject.type === "Rect")
			c = Rect;
		else if (rawObject.type === "Pencil")
			c = Pencil;
		else if (rawObject.type === "Circle")
			c = Circle;

		obj = cast(rawObject.data, c)
		obj.draw(ctx);
	};

	function cast(rawObj, constructor)
	{
		var obj = new constructor();
		for(var i in rawObj)
			obj[i] = rawObj[i];
		return obj;
	}



	return {
		line : Line,
		rectangle : Rect,
		pencil : Pencil,
		circle : Circle,
		paint_bucket : PaintBucket,

		fromJSON : factory
	}

}());


Sketcher.Tools = (function() {

	var tools;
	var current;


	function initialization(default_color, default_line_width, default_fill_color, default_width, default_height) {
	tools = {
					 "line" : new Sketcher.ToolsAbstract.line(default_color, default_line_width),
					 "rectangle" : new Sketcher.ToolsAbstract.rectangle(default_color, default_line_width, default_fill_color),
					 "pencil" : new Sketcher.ToolsAbstract.pencil(default_color, default_line_width),
					 "circle" : new Sketcher.ToolsAbstract.circle(default_color, default_line_width, default_fill_color),
					 "paint_bucket" : new Sketcher.ToolsAbstract.paint_bucket(default_color, default_line_width, default_width, default_height)
		}

		current = "paint_bucket";

	}


  function getCurrentTool() {
		return tools[current];
	}


	function setCurrentTool(name) {
		console.log(name);
		if ( name in tools) {
				current = name;
		} else {
			console.log(name+' is not a tool');
		}


	}

	function fromJSON(json, ctx) {
		Sketcher.ToolsAbstract.fromJSON(json, ctx);
	}

	

	return {
		init : initialization,
		getTool : getCurrentTool,
		setTool : setCurrentTool,
		drawFromJSON : fromJSON
	}

}());

//A mettre dans Color
function hex2Rgb(hex) {
hex = hex.replace(/[^0-9A-F]/gi, '');
return {r : (bigint = parseInt(hex, 16)) >> 16 & 255, g: bigint >> 8 & 255,b : bigint & 255};
}


//console.log(hex2Rgb("#FF00FF"));
