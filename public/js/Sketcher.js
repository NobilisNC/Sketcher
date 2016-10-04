class Layer {
    constructor(name, zIndex, width, height, frame) {
        this.id = Math.round(Math.random()*1000000)%1000000;
        this.name = name;
        this.zIndex = zIndex;
        this.node = document.createElement('canvas');
        this.node.setAttribute('id', 'sketcher_layer_'+this.id);
        frame.appendChild(this.node);
        this.visible = true;
        this.width = width;
        this.height = height;
        this.node.width = this.width;
        this.node.height = this.height;
        this.opacity = 1;

        this.update();
    }

    update() {
        this.node.style.display = this.visible ? 'block' : 'none';
        this.node.style.zIndex = this.zIndex;
        console.log('updated', this.zIndex);
    }

    toggleVisibility() {
        this.visible = this.visible ? false : true;
        this.update();
    }

    setVisibility(visibility) {
        this.visible = visibility;
        this.update();
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
    lightblue: "#a6f7ff",
    lightgreen: "#7abf30",
    pink: "#f70e93",
    purple: "#ae22f6"
};

var Sketcher = (function(document, window){
    var frame = document.querySelector("div#sketcher");
    // var socket = io("http://localhost:3000/");
    var layers = [];
    var selectedLayer;
    var clicked = false;
    var pos = {x:0, y:0};
    var width = window.innerWidth;
    var height = window.innerHeight;
    var color = Color.red;
    
    function onMouseUp(e) {
        frame.removeEventListener("mousemove", onMouseMove);

        clear(getContext(layers[0].id));

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
            var ctx = getContext(layers[0].id);
            clear(ctx);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function getLayer(id) {
        var ret = null;

        layers.forEach(function(layer) {
            if(layer.id == id) {
                ret = layer;
            }
        });

        return ret;
    }

    function getLayerOnLevel(n) {
        var ret = null;

        layers.forEach(function(layer) {
            if(layer.zIndex == n) {
                ret = layer;
            }
        });

        return ret;
    }

    function getLayers() {
        var ret = [];

        var lvl = 1;
        var layer;
        while(ret.length < layers.length-1) {
            layer = getLayerOnLevel(lvl++);
            if(layer != null)
                ret.push(layer);
        }

        return ret.reverse();
    }

    function getContext(id) {
        return getLayer(id).node.getContext("2d");
    }

    function addLayer(name, zIndex = 0) {
        layers.push(new Layer(name, zIndex == 0 ? layers.length : zIndex, width, height, frame));
        selectedLayer = layers[layers.length-1].id;
    }

    function addLayerPrompt() {
        var name = prompt("Please enter layer name", "Foreground");
        if(name === null) {
            return false;
        } else {
            name = name.toLowerCase();
            addLayer(name);

            return true;
        }
    }

    function getSelectedLayer() {
        return selectedLayer;
    }

    function selectLayer(id) {
        var layer = getLayer(id);
        if(layer != null) {
            selectedLayer = layer.id;
            return true;
        } else {
            console.error('No layer with id "'+id+'".');
            return false;
        }
    }

    function deleteLayer(id) {
        var layer = getLayer(id);
        if(layer != null) {
            layer.node.remove();
            var index = -1;
            layers.forEach(function(layer, i) {
                if(layer.id == id) {
                    index = i;
                }
            });

            layers.slice(index).forEach(function(layer) {
                layer.zIndex--;
                layer.update();
            });
            delete layers[index];
            return true;
        } else {
            console.error('No layer named "'+name+'".');
            return false;
        }
    }

    function setLayerVisibility(id, visibility) {
        getLayer(id).setVisibility(visibility);
    }

    function toggleLayerVisibility(id) {
        getLayer(id).toggleVisibility();
    }

    function raiseLayer(id) {
        var layer = getLayer(id);
        var prev = getLayerOnLevel(layer.zIndex+1);

        if(prev == null || prev.name == "trackpad") {
           return false; 
        } else {
            layer.zIndex++;
            layer.update();
            
            prev.zIndex--;
            prev.update();
        }
    }

    function demoteLayer(id) {
        var layer = getLayer(id);
        var next = getLayerOnLevel(layer.zIndex-1);

        if(next == null || next.name == "trackpad") {
           return false; 
        } else {
            layer.zIndex--;
            layer.update();
            
            next.zIndex++;
            next.update();
        }
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

    frame.style.width = width+"px";
    frame.style.height = height+"px";

    frame.addEventListener("mouseup", onMouseUp);
    frame.addEventListener("mousedown", onMouseDown);

    addLayer("trackpad", 100);
    addLayer("background");

    return {
        getContext: getContext,
        addLayer: addLayer,
        addLayerPrompt: addLayerPrompt,
        getSelectedLayer: getSelectedLayer,
        selectLayer: selectLayer,
        setLayerVisibility: setLayerVisibility,
        toggleLayerVisibility: toggleLayerVisibility,
        selectColor: selectColor,
        deleteLayer: deleteLayer,
        raiseLayer: raiseLayer,
        demoteLayer: demoteLayer,
        clear: clear,
        getLayers: getLayers
    };
})(document, window);