var baseLayers = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: true,
    layers: [
        new ol.layer.Tile({
            title: "Watercolor",
            baseLayer: true,
            source: new ol.source.Stamen({ layer: 'watercolor' })
        }),
        // new ol.layer.Tile({
        //     title: "Toner",
        //     baseLayer: true,
        //     visible: false,
        //     source: new ol.source.Stamen({ layer: 'toner' })
        // }),
        // new ol.layer.Tile({
        //     title: "OSM",
        //     baseLayer: true,
        //     source: new ol.source.OSM(),
        //     visible: false
        // })
    ]
});
//// A layer with minResolution (hidden on hight zoom level)
// var mapbox = new ol.layer.Tile({
//     title: "Pirate Map",
//     displayInLayerSwitcher: false,
//     minResolution: 1223,
//     source: new ol.source.XYZ({
//         attributions: [
//             '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ',
//             ol.source.OSM.ATTRIBUTION
//         ],
//         url: 'https://{a-d}.tiles.mapbox.com/v3/aj.Sketchy2/{z}/{x}/{y}.png'
//     })
// });
// // An overlay that stay on top
// var labels = new ol.layer.Tile({
//     title: "Labels (on top)",
//     allwaysOnTop: true,			// Stay on top of layer switcher
//     noSwitcherDelete: true,		// Prevent deleting from layer switcher
//     source: new ol.source.Stamen({ layer: 'terrain-labels' })
// });
// WMS with bbox
// var brgm = new ol.layer.Tile({
//     "title": "GEOLOGIE",
//     "extent": [
//         -653182.6969582437,
//         5037463.842847037,
//         1233297.5065495989,
//         6646432.677299531
//     ],
//     "minResolution": 3.527777777777778,
//     "maxResolution": 3527.777777777778,
//     "source": new ol.source.TileWMS({
//         "url": "https://geoservices.brgm.fr/geologie",
//         "projection": "EPSG:3857",
//         "params": {
//             "LAYERS": "GEOLOGIE",
//             "FORMAT": "image/png",
//             "VERSION": "1.3.0"
//         },
//         "attributions": [
//             "<a href='http://www.brgm.fr/'>&copy; Brgm</a>"
//         ]
//     })
// });

// GeoJSON layer
// var vectorSource = new ol.source.Vector({
//     url: 'http://localhost:8081/geoserver/topp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=topp%3Astates&maxFeatures=50&outputFormat=application%2Fjson',
//     format: new ol.format.GeoJSON(),
//     attributions: [ "&copy; <a href='https://www.insee.fr'>INSEE</a>", "&copy; <a href='https://www.data.gouv.fr/fr/datasets/geofla-r/'>IGN</a>" ],
//   });
// var Departements = new ol.layer.Vector({
//     name: 'Departements',
//     source: vectorSource,
//     style: function(f) {
//       return new ol.style.Style({ 
//         image: new ol.style.RegularShape({
//           radius: 5,
//           radius2: 0,
//           points: 4,
//           stroke: new ol.style.Stroke({ color: "#000", width:1 })  
//         }),
//         text: new ol.style.Text ({
//           text: f.get('STATE_NAME').toString(),
//           font: 'bold 11px sans-serif',
//         }),
//         stroke: new ol.style.Stroke({
//           width: 1,
//           color: [255,128,0]
//         }),
//         fill: new ol.style.Fill({
//           color: [255,128,0,.2]
//         })
//       })
//     }
//   })

// ex 1
var vectorSource1 = new ol.source.Vector({
    url:'http://localhost:8081/geoserver/p3021/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=p3021%3AStadsdelar&maxFeatures=50&outputFormat=application%2Fjson',
    // url: 'http://localhost:8081/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3AStadsdelar&maxFeatures=50&outputFormat=application%2Fjson',
    format: new ol.format.GeoJSON(),
  });
var demo1 = new ol.layer.Vector({
    name: 'demo1',
    source: vectorSource1,
    style: function(f) {
      return new ol.style.Style({ 
        image: new ol.style.RegularShape({
          radius: 5,
          radius2: 0,
          points: 4,
          stroke: new ol.style.Stroke({ color: "#000", width:1 })  
        }),
        // text: new ol.style.Text ({
        //   text: f.get('ID').toString(),
        //   font: 'bold 11px sans-serif',
        // }),
        stroke: new ol.style.Stroke({
          width: 1,
          color: [255,128,0]
        }),
        fill: new ol.style.Fill({
          color: [255,128,0,.2]
        })
      })
    }
  })

// The Map
var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        zoom: 11,
        center: [260497, 6249720]
    }),
    // layers: [baseLayers, mapbox, brgm, labels]
    layers: [baseLayers,demo1],
    interactions: ol.interaction.defaults({ altShiftDragRotate:false, pinchRotate:false }),
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
    oninfo: function (l) { alert(l.get("title")); }
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
map.addOverlay(popup);