class Layer {
    constructor(name, zIndex, width, height, frame) {

        this.name = name;
        frame.innerHTML = '<canvas id="'+this.name+'"></canvas>'+frame.innerHTML;
        this.node = frame.querySelector('#'+this.name);
        this.visible = true;
        this.zIndex = zIndex;
        this.width = width;
        this.height = height;
        this.node.width = this.width;
        this.node.height = this.height;
    }

    updateVisibility() {
        document.querySelector('#'+this.name).style.display = this.visible ? "block" : "none";
    }

    toggleVisibility() {
        this.visible = this.visible ? false : true;
    }

    setVisibility(visibility) {
        this.visible = visibility;
        this.updateVisibility();
    }

    isVisible() {
        return this.visible;
    }
}

var Color = {
    white: "#fff",
    black: "#000",
    red: "#f00",
    green: "#0f0",
    blue: "#00f",
    orange: "#ffb603",
    lightblue: "#a6f7ff"
};

var Sketcher = (function(document, window){
    var frame = document.querySelector("div#sketcher");
    // var socket = io("http://localhost:3000/");
    var layers = {};
    var selectedLayer = "background";
    var clicked = false;
    var pos = {x:0, y:0};
    var width = window.innerWidth;
    var height = window.innerHeight;
    var color = Color.red;
    
    function onMouseUp(e) {
        frame.removeEventListener("mousemove", onMouseMove);

        clear(getContext("trackpad"));

        if(clicked) {
            var ctx = getContext(selectedLayer);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.stroke();
        }

        clicked = false;
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
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function getContext(name) {
        return document.querySelector("canvas#"+name).getContext("2d");
    }

    function countLayers() {
        var ret = 0;

        for(var i in layers) {
            ret++;
        }

        return ret;
    }

    function addLayer(name, zIndex = 0) {
        layers[name] = new Layer(name, zIndex == 0 ? countLayers : zIndex, width, height, frame);
    }

    function addLayerPrompt() {
        var name = prompt("Please enter layer name", "Foreground");
        if(name === null) {
            return false;
        } else {
            name = name.toLowerCase();
            addLayer(name);
            selectedLayer = name;

            return true;
        }
    }

    function getSelectedLayer() {
        return selectedLayer;
    }

    function selectLayer(name) {
        if(name in layers) {
            selectedLayer = name;
            return true;
        } else {
            console.log('No layer named "'+name+'".');
            console.log(layers);
            return false;
        }
    }

    function setLayerVisibility(name, visibility) {
        layers[name].setVisibility(visibility);
    }

    function selectColor(colorName) {
        if(colorName in Color) {
            color = Color[colorName]
            return true;
        } else {
            console.error(colorName+" is not a color.");
            return false;
        }
    }

    function clear(ctx) {
        ctx.clearRect(0, 0, width, height);
    }

    function getLayers() {
        var ret = [];

        for(var name in layers) {
            if(name != "trackpad")
                ret.push(layers[name]);
        }

        return ret;
    }

    frame.style.width = width+"px";
    frame.style.height = height+"px";

    frame.addEventListener("mouseup", onMouseUp);
    frame.addEventListener("mousedown", onMouseDown);

    addLayer("trackpad", 100);
    addLayer(selectedLayer);

    return {
        getContext: getContext,
        addLayer: addLayer,
        addLayerPrompt: addLayerPrompt,
        getSelectedLayer: getSelectedLayer,
        selectLayer: selectLayer,
        setLayerVisibility: setLayerVisibility,
        selectColor: selectColor,
        clear: clear,
        getLayers: getLayers
    };
})(document, window);