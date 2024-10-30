
window.load = () => {
    const map = new L.Map('map');

    const amapLayer = new L.TileLayer(
        'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
        {
            subdomains: '1234'
        }
    );

    amapLayer.addTo(map);

    // const qgisLayer = new L.TileLayer(
    //     'images/{z}/{x}/{y}.png'
    // );

    // qgisLayer.addTo(map);

    map.setView([30.874256, 120.133856], 17);

    L.vectorGrid.protobuf("tiles/{z}/{x}/{y}.pbf", {
        vectorTileLayerStyles: {
            // A plain set of L.Path options.
            building2: {
                weight: 0,
                fillColor: '#5d749d',
                fillOpacity: 1,
                fill: true
            },
            water2: {
                weight: 0,
                fillColor: '#7ea5b4',
                fillOpacity: 1,
                fill: true
            },
            green2: {
                weight: 0,
                fillColor: '#d1bdbe',
                fillOpacity: 1,
                fill: true
            },
            road2: {
                weight: 2,
                color: '#1a3564',
                fillColor: '#1a3564',
                fillOpacity: 1,
                fill: true
            },
            poi: {
                radius: 0.1,
                weight: 0,
                fillColor: '#000',
                fillOpacity: 0,
            }
        }
    }).addTo(map);
}
