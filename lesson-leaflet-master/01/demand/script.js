import { Map, TileLayer } from 'leaflet';

window.load = () => {
    // Write Javascript code!
    const map = new Map('map');

    const layer = new TileLayer(
        'http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
        {
            subdomains: '1234'
        }
    );

    layer.addTo(map);

    map.setView([39.909186, 116.397411], 10);

};