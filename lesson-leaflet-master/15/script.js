import {Map, TileLayer, GeoJSON} from 'leaflet';
import {VectorTile, VectorTileLayer} from '@mapbox/vector-tile';
import Pbf from 'pbf';

window.load = () => {
    const map = new Map('map');

    const amapLayer = new TileLayer(
        'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
        {
            subdomains: '1234'
        }
    );

    amapLayer.addTo(map);

    const CustomLayer = L.GridLayer.extend({
        createTile:  function(coords) {
            // create a <canvas> element for drawing
            const tile = L.DomUtil.create('canvas', 'leaflet-tile');
    
            // setup tile width and height according to the options
            const size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
    
            // get a canvas context and draw something on it using coords.x, coords.y and coords.z
            const ctx = tile.getContext('2d');
    
            fetch("tiles/" + coords.z + "/" + coords.x + "/" + coords.y + ".pbf")
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    const vt = new VectorTile(new Pbf(buffer));
                    if (vt.layers["building2"]) {
                        for (let i = 0; i < vt.layers["building2"].length; i++) {
                            const feature = vt.layers["building2"].feature(i);
                            console.log(feature.loadGeometry());
                            new GeoJSON(feature.toGeoJSON(coords.x, coords.y, coords.z), {
                               
                            }).addTo(map);
                        }
                    }
                }).catch(function(error) { 
                    //log
                });;
    
            // return the tile so it can be rendered on screen
            return tile;
        }
    });

    const customLayer = new CustomLayer();
    customLayer.addTo(map);

    map.setView([30.874256, 120.133856], 17);

    
}
