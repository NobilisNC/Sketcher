var SketcherUI = (function(document, window){
    var frame = document.querySelector('div#sketcher');

    // Create UI components containers
    var buttons = document.createElement('div');
    var palette = document.createElement('div');
    var layers = document.createElement('div');
    var layersButtons = document.createElement('div');
    var layersList = document.createElement('ul');

    buttons.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });
    palette.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });
    layers.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });

    buttons.setAttribute('id', 'sketcher_buttons');
    palette.setAttribute('id', 'sketcher_palette');
    layers.setAttribute('id', 'sketcher_layers');
    layersButtons.setAttribute('id', 'sketcher_layers_buttons');
    layersList.setAttribute('id', 'sketcher_layers_list');

    document.body.insertBefore(buttons, frame);
    document.body.insertBefore(palette, frame);

    layers.appendChild(layersList);
    layers.appendChild(layersButtons);
    document.body.insertBefore(layers, frame);

    function updatePalette() {
        palette.innerHTML = '';

        for(var color in Color) {
            palette.innerHTML += '<a class="sketcher_color" style="background-color:'+Color[color]+';" alt="'+color+'" href="#"></a>';
        }

        Array.prototype.forEach.call(
            palette.querySelectorAll('.sketcher_color'),
            function(color) {
                color.addEventListener('click', function(e) {
                    Sketcher.selectColor(this.getAttribute('alt'));
                });
            }
        );
    }

    function updateLayers() {
        while (layersList.firstChild) {
            layersList.removeChild(layersList.firstChild);
        }

        Sketcher.getLayers().forEach(function(layer) {
            var li = document.createElement('li');
            li.setAttribute('data-id', layer.id);
            li.setAttribute('data-name', layer.name);
            if(layer.name == Sketcher.getSelectedLayer())
                li.setAttribute('class', 'active');

            // Create a container for layer commands
            var div = document.createElement('div');
            div.setAttribute('class', 'sketcher_layer_commands');

            // Create buttons for layer commands
            var aSel = document.createElement('a');
            aSel.setAttribute('data-action', 'selectLayer');
            aSel.setAttribute('class', 'sketcher_layer_link');
            aSel.innerHTML = layer.name[0].toUpperCase()+layer.name.substr(1);
            li.appendChild(aSel);

            var aVis = document.createElement('a');
            aVis.setAttribute('data-action', 'toggleLayerVisibility');
            aVis.setAttribute('class', 'sketcher_check');
            aVis.innerHTML = '<i class="fa fa-eye'+(layer.isVisible() ? '' : '-slash')+'"></i>';
            div.appendChild(aVis);

            var aDel = document.createElement('a');
            aDel.setAttribute('data-action', 'deleteLayer');
            aDel.setAttribute('class', 'sketcher_check');
            aDel.innerHTML = '<i class="fa fa-trash"></i>';
            div.appendChild(aDel);

            var aRai = document.createElement('a');
            aRai.setAttribute('data-action', 'raiseLayer');
            aRai.setAttribute('class', 'sketcher_check');
            aRai.innerHTML = '<i class="fa fa-arrow-up"></i>';
            div.appendChild(aRai);

            var aDem = document.createElement('a');
            aDem.setAttribute('data-action', 'demoteLayer');
            aDem.setAttribute('class', 'sketcher_check');
            aDem.innerHTML = '<i class="fa fa-arrow-down"></i>';
            div.appendChild(aDem);

            li.appendChild(div);

            layersList.appendChild(li);
        });

        Array.prototype.forEach.call(
            layersList.querySelectorAll('a.sketcher_layer_link[data-action="selectLayer"]'),
            function(link){
                link.addEventListener('click', function(e) {
                    Sketcher.selectLayer(e.srcElement.parentNode.getAttribute("data-id"));
                    updateLayers();
                });
            }
        );

        Array.prototype.forEach.call(
            layersList.querySelectorAll('a[data-action="toggleLayerVisibility"], a[data-action="deleteLayer"], a[data-action="raiseLayer"], a[data-action="demoteLayer"]'),
            function(check, i){
                var id = check.parentNode.parentNode.getAttribute("data-id");
                var action = check.getAttribute("data-action");
                check.addEventListener('click', function(e) {
                    Sketcher[action](id);
                    updateLayers();
                });
            }
        );

    }

    function addButton(name, func, container, icon = '') {
        if(icon == '') {
            container.innerHTML += '<a class="sketcher_button" id="sketcher_button_'+name+'" href="#">'+name+'</a>';
        } else {
            container.innerHTML += '<a class="sketcher_button" id="sketcher_button_'+name+'" href="#"><i alt="'+name+'" class="fa fa-'+icon+'"></a>';
        }

        var b = container.querySelector('#sketcher_button_'+name);
        b.addEventListener('click', func);
    }

    function addNormalButton(name, func, icon = '') {
        addButton(name, func, buttons, icon);
    }

    // Add native components to containers
    addButton('square', function(e){ console.log('select square'); }, buttons, 'square');
    addButton('addLayer', function(e){ Sketcher.addLayerPrompt(); updateLayers(); }, layersButtons, 'plus');
    updatePalette();
    updateLayers();
    
    return {
        addButton: addNormalButton,
        updateLayers: updateLayers
    };
})(document, window);