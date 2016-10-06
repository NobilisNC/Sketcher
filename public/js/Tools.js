var _Tools = ( function() {

    /* Abstract Class _Tool
     *
     *
     *
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
    }


    return {
      line : Line,
      rectangle : Rect,
      pencil : Pencil,
      circle : Circle
    }

}());


var Tools = (function(t) {

  var tools;
  var current;


  function initalization(default_color, default_line_width, default_fill_color) {
    tools = {
                "line" : new t.line(default_color, default_line_width),
                "rectangle" : new t.rectangle(default_color, default_line_width, default_fill_color),
                "pencil" : new t.pencil(default_color, default_line_width),
                "circle" : new t.circle(default_color, default_line_width, default_fill_color)
            }


    current = "rectangle";
  }

  function getCurrentTool() {
       return tools[current];
  }


  function setCurrentTool(name) {
    if ( name in tools) {
        current = name;
    } else {
      console.log(name+' is not a tool');
    }


  }

  return {
    init : initalization,
    getTool : getCurrentTool,
    setTool : setCurrentTool
  }

}(_Tools));

Tools.init("#000000", 1, "#000000");
