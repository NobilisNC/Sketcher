var Tools = ( function() {

    /* Abstract Class _Tool
     *
     *
     *
     */
    function _Tool(lay, c, lw) {
      this.layer = lay;
      this.color = c;
      this.linewidth = lw;
    }

    _Tool.prototype.setColor = function (c) {
      this.color = c;
    }

    _Tool.prototype.setLineWidth = function (lw) {
      this.linewidth = lw;
    }

    _Tool.prototype.test = function (arg) {
      console.log(this.color);
    }

    //AbstractFunctions
    _Tool.prototype.onMouseDown;
    _Tool.prototype.onMouseMove;
    _Tool.prototype.onMouseUp;

    function private() {
      console.log("private");
    }

    /* Class Line extend _Tool
     *
     *
     *
     */
     function Line(lay, c, lw) {
       _Tool.call(this, lay,c, lw)
       this.p1;
       this.p2;
     }

     Line.prototype = Object.create(_Tool.prototype);
     Line.prototype.constructor = Line;

     Line.prototype.draw = function (ctx, p1, p2) {
        //Conf du tracé
        // ...
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x,p1.y);
        ctx.endPath();
        ctx.stroke();
     }

     Line.prototype.onMouseDown = function (e) {
       this.p1 = {e.clientX, e.clientY };

     }

     Line.prototype.onMouseMove = function (e) {
       

     }

     Line.prototype.onMouseUp = function (e) {

     }

     /* Class Rect extends _Tool
      *
      *
      *
      */
    function Rect(lay, c, cf, lw ) {
      _Tool.call(this,lay,c, lw);
      this.fill_color =  cf;
    }

    Rect.prototype = Object.create(_Tool.prototype);
    Rect.prototype.constructor = Rect;

    Rect.prototype.setFillColor = function(cf) {
      this.fill_color = cf;
    }

    Rect.prototype.draw = function (ctx, p1, p2) {
      //Reglage tracé
      //...
      ctx.fillRect(p1.x, p1.y, p2.x, p2.y, fill_color); //Remplissage
      ctx.drawRect(p1.x, p1.y, p2.x, p2.y,color); // Bordure
    }

    Rect.prototype.onMouseDown = function (e) {

    }

    Rect.prototype.onMouseMove = function (e) {

    }

    Rect.prototype.onMouseUp = function (e) {

    }



    return {
      Line : Line,
      Rectangle : Rect

    }

}());


var a = new Tools.Rectangle("a", "b", "c");
console.log("Instance of Tool >" + a instanceof Tools.Tool );
a.test();
a.setColor("aaa");
a.test();
