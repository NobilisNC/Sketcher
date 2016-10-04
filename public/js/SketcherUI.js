var SketcherUI = (function(document, window){
    var frame = document.querySelector('div#sketcher');

    // Create UI components containers
    var buttons = document.createElement('div');
    var palette = document.createElement('div');
    var layers = document.createElement('div');
    var layersButtons = document.createElement('div');
    var layersList = document.createElement('ul');

    buttons.addEventListener("mousedown", function(e) { e.preventDefault(); e.stopPropagation(); });
    palette.addEventListener("mousedown", function(e) { e.preventDefault(); e.stopPropagation(); });
    layers.addEventListener("mousedown", function(e) { e.preventDefault(); e.stopPropagation(); });

    buttons.setAttribute("id", "sketcher_buttons");
    palette.setAttribute("id", "sketcher_palette");
    layers.setAttribute("id", "sketcher_layers");
    layersButtons.setAttribute("id", "sketcher_layers_buttons");
    layersList.setAttribute("id", "sketcher_layers_list");

    document.body.insertBefore(buttons, frame);
    document.body.insertBefore(palette, frame);
    layers.appendChild(layersList);
    layers.appendChild(layersButtons);
    document.body.insertBefore(layers, frame);

    function updatePalette() {
        palette.innerHTML = "";

        for(var color in Color) {
            palette.innerHTML += '<a class="sketcher_color" style="background-color:'+Color[color]+';" alt="'+color+'" href="#"></a>';
        }

        palette.querySelectorAll(".sketcher_color").forEach(function(color, i) {
            color.addEventListener("click", function(e) {
                Sketcher.selectColor(this.getAttribute("alt"));
            });
        });
    }

    function updateLayers() {
        layersList.innerHTML = "";
        Sketcher.getLayers().forEach(function(layer, i) {
            var elm = '<li><a ';
            elm += layer.name == Sketcher.getSelectedLayer() ? 'class="active" ' : '';
            elm += 'id="sketcher_layer_'+layer.name+'" href="#">';
            elm += layer.name.charAt(0).toUpperCase()+layer.name.slice(1);
            elm += '</a>';
            elm += '<input type="checkbox" id="sketcher_layer_'+layer.name+'_visible" class="sketcher_check"';
            elm += (layer.isVisible() ? " checked" : "")+'>';
            elm += '</li>';

            layersList.innerHTML += elm;
        });

        layersList.querySelectorAll("a").forEach(function(link, i){
            link.addEventListener("click", function(e) {
                Sketcher.selectLayer(link.innerHTML.toLowerCase());
                updateLayers();
            });
        });

        layersList.querySelectorAll("input").forEach(function(check, i){
            check.addEventListener("change", function(e) {
                Sketcher.setLayerVisibility(e.srcElement.previousSibling.innerHTML.toLowerCase(), e.srcElement.checked);
            });
        });
    }

    function addButton(name, func, container, icon = "") {
        if(icon == "") {
            container.innerHTML += '<a class="sketcher_button" id="sketcher_button_'+name+'" href="#">'+name+'</a>';
        } else {
            container.innerHTML += '<a class="sketcher_button" id="sketcher_button_'+name+'" href="#"><i alt="'+name+'" class="fa fa-'+icon+'"></a>';
        }

        var b = container.querySelector('#sketcher_button_'+name);
        b.addEventListener("click", func);
    }

    function addNormalButton(name, func, icon = "") {
        addButton(name, func, buttons, icon);
    }

    // Add native components to containers
    addButton('square', function(e){ console.log('select square'); }, buttons, "square");
    addButton('addLayer', function(e){ Sketcher.addLayerPrompt(); updateLayers(); }, layersButtons, "plus");
    updatePalette();
    updateLayers();
    
    return {
        addButton: addNormalButton,
        updateLayers: updateLayers
    };
})(document, window);