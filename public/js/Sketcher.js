var Sketcher = (function(document, window){
    var frame = document.querySelector("div#sketcher");
    var canvas = [];
    var layers = [];
    var selectedLayer = "background";
    var clicked = false;
    var pos = {x:0, y:0};
    var width = 500;
    var height = 500;
    
    function onMouseUp(e) {
        clicked = false;
        frame.removeEventListener("mousemove", onMouseMove);

        clear(getContext("trackpad"));

        var ctx = getContext(selectedLayer);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.closePath();
        ctx.stroke();
    }

    function onMouseDown(e) {
        if(e.buttons == 1 && e.button == 0 && !clicked) {
            clicked = true;
            pos = {x:e.offsetX, y:e.offsetY};
            frame.addEventListener("mousemove", onMouseMove);
        }
    }

    function onMouseMove(e) {
        if(e.offsetX < 0 || e.offsetY < 0 ||  e.offsetX > width || e.offsetY > height) {
            onMouseUp(null);
        } else {
            var ctx = getContext("trackpad");
            clear(ctx);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function clear(ctx) {
        ctx.clearRect(0, 0, width, height);
    }

    function addLayer(name, zIndex = 0) {
        frame.innerHTML = '<canvas id="'+name+'"></canvas>'+frame.innerHTML;
        layers[name] = document.querySelector('canvas#'+name).getContext("2d");
        layers[name].canvas.width = width;
        layers[name].canvas.height = height;
        layers[name].canvas.style.zIndex = zIndex;
    }

    function getContext(name) {
        return document.querySelector("#"+name).getContext("2d");
    }

    frame.style.width = width+"px";
    frame.style.height = height+"px";

    frame.addEventListener("mouseup", onMouseUp);
    frame.addEventListener("mousedown", onMouseDown);

    addLayer("trackpad", 100);
    addLayer(selectedLayer);

    return {

    };
})(document, window);