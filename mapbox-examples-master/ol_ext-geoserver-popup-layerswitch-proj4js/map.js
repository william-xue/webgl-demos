var baseLayers = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: true,
    layers: [
        // new ol.layer.Tile({
        //     title: "Watercolor",
        //     baseLayer: true,
        //     source: new ol.source.Stamen({ layer: 'watercolor' })
        // visible: false
        // }),
        // new ol.layer.Tile({
        //     title: "Toner",
        //     baseLayer: true,
        //     visible: false,
        //     source: new ol.source.Stamen({ layer: 'toner' })
        // }),
        new ol.layer.Tile({
            title: "OSM",
            baseLayer: true,
            source: new ol.source.OSM(),
            visible: false,
        })
    ]
});

proj4.defs("EPSG:3021", "+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs");
// ol.proj.proj4.register(proj4);
var projection = new ol.proj.Projection({
    code: 'EPSG:3021',
    extent: [1130260.43, 6107427.52, 1832752.08, 7687339.06],
    units: 'm',
    axisOrientation: 'neu',
    global: false
});
// addProjection
ol.proj.addProjection(projection);
ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:3021",
    function (coordinate) {
        return proj4("EPSG:4326", "EPSG:3021", coordinate);
    },
    function (coordinate) {
        return proj4("EPSG:3021", "EPSG:4326", coordinate);
    }
);

// test coors transform
var coor1 = ol.proj.transform([118.8260199966696, 32.03620907291769], 'EPSG:4326', 'EPSG:3021');
console.log('coor1:', coor1);

let currentLayer = ''
var bounds = [1321234.7302553086, 6170460.332079064, 1348719.7336814068, 6186951.334134722];
// addlayersName,polygon first,line secound,point last.
var layersName = [
    {
        title: 'p3021:Stadsdelar',
        name: 'p3021:Stadsdelar',
        visible: true,
    }, {
        title: 'p3021:vagar_alla',
        name: 'p3021:vagar_alla',
        visible: true,
    }, {
        title: 'p3021:befolk',
        name: 'p3021:befolk',
        visible: false
    }];

var layers = []
layersName.forEach(item => {
    const { title,name, visible } = item
    layers.push(new ol.layer.Tile({
        title,
        name,
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/p3021/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": name,
                "exceptions": 'application/vnd.ogc.se_inimage',
                tilesOrigin: 1365818.204816392 + "," + 6202358.053453183
            },
        }),
        visible: visible,
    }));
})
var wmsdemo1 = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8081/geoserver/p3021/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            "LAYERS": 'p3021:p3021_group',
            "exceptions": 'application/vnd.ogc.se_inimage',
            tilesOrigin: 1365818.204816392 + "," + 6202358.053453183
        },
        projection
    })
});

// The Map
var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        projection,
    }),
    layers: [baseLayers, ...layers],
    interactions: ol.interaction.defaults({ altShiftDragRotate: false, pinchRotate: false }),
    controls: ol.control.defaults().extend([new ol.control.ZoomSlider(),new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
    })]),
});

map.getView().fit(bounds, map.getSize());

// events
map.on('singleclick', function (evt) {
    if(currentLayer === '') return;
    var view = map.getView();
    var viewResolution = view.getResolution();
    let layer = layers.find(l=>l.get('name') === currentLayer);
    if(!layer || !layer.getVisible()) return;
    var source = layer.getSource();
    var url = source.getFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        { 'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50 });
    if (url) {
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                document.getElementById('nodelist').innerHTML = html;
            });
    }
});

// Add control inside the map
var ctrl = new ol.control.LayerSwitcher({
    // collapsed: false,
    // mouseover: true
});
map.addControl(ctrl);
ctrl.on('toggle', function (e) {
    console.log('Collapse layerswitcher', e.collapsed);
});

// Add a layer switcher outside the map
var switcher = new ol.control.LayerSwitcher({
    target: $(".layerSwitcher").get(0),
    // displayInLayerSwitcher: function (l) { return false; },
    show_progress: true,
    extent: true,
    trash: true,
    oninfo: function (l) { 
        console.log(l.get("title")); 
        currentLayer = l.get("name")
    }
});
// Add a new button to the list 
switcher.on('drawlist', function (e) {
    var layer = e.layer;
    $('<div>').text('?')// addClass('layerInfo')
        .click(function () {
            alert(layer.get('title'));
        })
        .appendTo($('> .ol-layerswitcher-buttons', e.li));
});
// Add a button to show/hide the layers
var button = $('<div class="toggleVisibility" title="show/hide">')
    .text("Show/hide all")
    .click(function () {
        var a = map.getLayers().getArray();
        var b = !a[0].getVisible();
        if (b) button.removeClass("show");
        else button.addClass("show");
        for (var i = 0; i < a.length; i++) {
            a[i].setVisible(b);
        }
    });
switcher.setHeader($('<div>').append(button).get(0))

map.addControl(switcher);
// Insert mapbox layer in layer switcher
function displayInLayerSwitcher(b) {
    // mapbox.set('displayInLayerSwitcher', b);
}

// Get options values
if ($("#opb").prop("checked")) $('body').addClass('hideOpacity');
if ($("#percent").prop("checked")) $('body').addClass('showPercent');
if ($("#dils").prop("checked")) displayInLayerSwitcher(true);

////////////////////////////////////////////////////////////////////////////

// Select  interaction
var select = new ol.interaction.Select({
    hitTolerance: 5,
    multi: true,
    condition: ol.events.condition.singleClick
});
map.addInteraction(select);

// Select control
var popup = new ol.Overlay.PopupFeature({
    popupClass: 'default anim',
    select: select,
    canFix: true,
    /** /
    template: function(f) {
      return {
        title: function(f) { return f.get('nom')+' ('+f.get('id')+')' },
        attributes: { 
          region: { title: 'Région' }, 
          arrond: 'arrond', 
          cantons: 'cantons', 
          communes: 'communes', 
          pop: 'pop' 
        }
      }
    },
    /**/
    template: {
        title:
            // 'nom',   // only display the name
            function (f) {
                return f.get('nom') + ' (' + f.get('id') + ')';
            },
        attributes: // [ 'region', 'arrond', 'cantons', 'communes', 'pop' ]
        {
            'region': { title: 'Région' },
            'arrond': { title: 'Arrondissement' },
            'cantons': { title: 'Cantons' },
            'communes': { title: 'Communes' },
            // with prefix and suffix
            'pop': {
                title: 'Population',  // attribute's title
                before: '',           // something to add before
                format: ol.Overlay.PopupFeature.localString(),  // format as local string
                after: ' hab.'        // something to add after
            },
            // calculated attribute
            'pop2': {
                title: 'Population (kHab.)',  // attribute's title
                format: function (val, f) {
                    return Math.round(parseInt(f.get('pop')) / 100).toLocaleString() + ' kHab.'
                }
            }
            /* Using localString with a date * /
            'date': { 
              title: 'Date', 
              format: ol.Overlay.PopupFeature.localString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
            }
            /**/
        }
    }
});
// map.addOverlay(popup);


 //  Vector layer
var vector = new ol.layer.Vector( { source: new ol.source.Vector() })
map.addLayer(vector)
////////
// Main control bar
var mainbar = new ol.control.Bar();
map.addControl(mainbar);

// Edit control bar 
var editbar = new ol.control.Bar({
  toggleOne: true,	// one control active at the same time
  group:false			// group controls together
});
mainbar.addControl(editbar);
// left top-left bottom top-right 
mainbar.setPosition('bottom-left')

// Add selection tool:
//  1- a toggle control with a select interaction
//  2- an option bar to delete / get information on the selected feature
var sbar = new ol.control.Bar();
sbar.addControl (new ol.control.Button({
  html: '<i class="fa fa-times"></i>',
  title: "Delete",
  handleClick: function() {
    var features = selectCtrl.getInteraction().getFeatures();
    if (!features.getLength()) info("Select an object first...");
    else info(features.getLength()+" object(s) deleted.");
    for (var i=0, f; f=features.item(i); i++) {
      vector.getSource().removeFeature(f);
    }
    selectCtrl.getInteraction().getFeatures().clear();
  }
}));
sbar.addControl (new ol.control.Button({
  html: '<i class="fa fa-info"></i>',
  title: "Show informations",
  handleClick: function() {
    switch (selectCtrl.getInteraction().getFeatures().getLength()){
      case 0: info("Select an object first...");
        break;
      case 1:
        var f = selectCtrl.getInteraction().getFeatures().item(0);
        info("Selection is a "+f.getGeometry().getType());
        break;
      default:
        info(selectCtrl.getInteraction().getFeatures().getLength()+ " objects seleted.");
        break;
    }
  }
}));

var selectCtrl = new ol.control.Toggle({
  html: '<i class="fa fa-hand-pointer-o"></i>',
  title: "Select",
  interaction: new ol.interaction.Select ({ hitTolerance: 2 }),
  bar: sbar,
  autoActivate:true,
  active:true
});

editbar.addControl ( selectCtrl);

// Add editing tools
var pedit = new ol.control.Toggle({
  html: '<i class="fa fa-map-marker" ></i>',
  title: 'Point',
  interaction: new ol.interaction.Draw({
    type: 'Point',
    source: vector.getSource()
  })
});
editbar.addControl ( pedit );

var ledit = new ol.control.Toggle({
  html: '<i class="fa fa-share-alt" ></i>',
  title: 'LineString',
  interaction: new ol.interaction.Draw({
    type: 'LineString',
    source: vector.getSource(),
    // Count inserted points
    geometryFunction: function(coordinates, geometry) {
        if (geometry) geometry.setCoordinates(coordinates);
      else geometry = new ol.geom.LineString(coordinates);
      this.nbpts = geometry.getCoordinates().length;
      return geometry;
    }
  }),
  // Options bar associated with the control
  bar: new ol.control.Bar({
    controls:[ 
      new ol.control.TextButton({
        html: 'undo',
        title: "Delete last point",
        handleClick: function() {
          if (ledit.getInteraction().nbpts>1) ledit.getInteraction().removeLastPoint();
        }
      }),
      new ol.control.TextButton({
        html: 'Finish',
        title: "finish",
        handleClick: function() {
          // Prevent null objects on finishDrawing
          if (ledit.getInteraction().nbpts>2) ledit.getInteraction().finishDrawing();
        }
      })
    ]
  }) 
});

editbar.addControl ( ledit );

var fedit = new ol.control.Toggle({
  html: '<i class="fa fa-bookmark-o fa-rotate-270" ></i>',
    title: 'Polygon',
    interaction: new ol.interaction.Draw({
      type: 'Polygon',
      source: vector.getSource(),
      // Count inserted points
      geometryFunction: function(coordinates, geometry) {
        this.nbpts = coordinates[0].length;
        if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
        else geometry = new ol.geom.Polygon(coordinates);
        return geometry;
      }
    }),
    // Options bar ssociated with the control
    bar: new ol.control.Bar({
      controls:[ new ol.control.TextButton({
        html: 'undo',//'<i class="fa fa-mail-reply"></i>',
        title: "undo last point",
        handleClick: function() {
          if (fedit.getInteraction().nbpts>1) fedit.getInteraction().removeLastPoint();
        }
      }),
      new ol.control.TextButton({
        html: 'finish',
        title: "finish",
        handleClick: function() {
          // Prevent null objects on finishDrawing
          if (fedit.getInteraction().nbpts>3) fedit.getInteraction().finishDrawing();
        }
      })
    ]
  }) 
});
editbar.addControl ( fedit );

// Add a simple push button to save features
var save = new ol.control.Button({
  html: '<i class="fa fa-download"></i>',
  title: "Save",
  handleClick: function(e) {
    var json= new ol.format.GeoJSON().writeFeatures(vector.getSource().getFeatures());
    info(json);
  }
});
mainbar.addControl ( save );

function info(i){
    $("#info").html(i||"");
  }