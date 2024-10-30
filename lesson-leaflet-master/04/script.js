import { Map, TileLayer, LayerGroup, Control, Marker, Icon, GeoJSON } from 'leaflet';

window.load = () => {
    const map = new Map('map');

    const amapLayer = new TileLayer(
        'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
        {
            subdomains: '1234'
        }
    );

    const tdtVectorLayer = new TileLayer(
        'http://t0.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=11b55a09c9e0df4a1e91741b455b7f28',
        {}
    );

    const tdtLabelLayer = new TileLayer(
        'http://t0.tianditu.gov.cn/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=11b55a09c9e0df4a1e91741b455b7f28',
        {}
    );

    const tdtLayer = new LayerGroup([tdtVectorLayer, tdtLabelLayer]);

    amapLayer.addTo(map);

    map.setView([39.909186, 116.397411], 10);

    const layerControl = new Control.Layers(
        {
            高德: amapLayer,
            天地图: tdtLayer
        },
        {},
        { collapsed: false }
    );
    layerControl.addTo(map);

    const svg = '<svg t="1621166776642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1407" width="200" height="200"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" p-id="1408"></path></svg>';

    const marker = new Marker([39.909186, 116.397411], {
        icon: new Icon({
            iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        })
    });

    marker.addTo(map);

    const data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "NAME": "西北五环"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        116.22196197509766,
                        39.99527080014614
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "NAME": "东五环"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        116.53816223144531,
                        39.9034155951341
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "NAME": "南五环"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        116.40151977539062,
                        39.7631584037253
                    ]
                }
            }
        ]
    };

    const glayer = new GeoJSON(data, {
        pointToLayer: (geoJsonPoint, latlng) => {
            return new Marker(latlng, {
                icon: new Icon({
                    iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svg),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                })
            });
        }
    });

    glayer.addTo(map);
}
