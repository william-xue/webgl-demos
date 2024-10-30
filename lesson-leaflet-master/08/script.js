import { Map } from 'leaflet';

window.load = () => {
    //创建高德Map
    const amap = new AMap.Map('amap', {
        fadeOnZoom: false,
        navigationMode: 'classic',
        optimizePanAnimation: false,
        animateEnable: false,
        dragEnable: false,
        zoomEnable: false,
        resizeEnable: true,
        doubleClickZoom: false,
        keyboardEnable: false,
        scrollWheel: false,
        expandZoomRange: true,
        zooms: [1, 20],
        mapStyle: 'amap://styles/1d037584f9de2c75b6425884278f6fc9',
        features: ['road', 'point', 'bg'],
        viewMode: '2D'
    });
    //创建Leaflet Map
    const map = new Map('map');

    map.on('zoom', evt => {
        amap.setZoom(evt.target.getZoom());
    });

    map.on('move', evt => {
        const pt = evt.target.getCenter();
        amap.setZoomAndCenter(evt.target.getZoom(), [pt.lng, pt.lat]);
    });

    map.setView([39.909186, 116.397411], 10);
}
