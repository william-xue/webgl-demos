import { Canvas, Map, GeoJSON, Marker, Icon, LayerGroup } from 'leaflet';

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
        mapStyle: 'amap://styles/1e65d329854a3cf61b568b7a4e2267fd',
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

    const data = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    NAME: '西北五环',
                    URL:
                        'https://lbsugc.cdn.bcebos.com/images/H6609c93d70cf3bc772e13cf7de00baa1cc112acc.jpg',
                    DESC: '这是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [116.22196197509766, 39.99527080014614]
                }
            },
            {
                type: 'Feature',
                properties: {
                    NAME: '东五环',
                    URL:
                        'https://lbsugc.cdn.bcebos.com/images/H7e3e6709c93d70cfd71b5b16f7dcd100bba12bcc.jpg',
                    DESC: '这又是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [116.53816223144531, 39.9034155951341]
                }
            },
            {
                type: 'Feature',
                properties: {
                    NAME: '南五环',
                    URL:
                        'https://poi-pic.cdn.bcebos.com/d0bf12c973c86ccf2eb79d337bdeb860.jpg',
                    DESC: '这还是一段很长的描述很长的描述很长的描述很长的描述很长的描述'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [116.40151977539062, 39.7631584037253]
                }
            }
        ]
    };

    const svg =
        '<svg t="1621166776642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1407" width="200" height="200"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" p-id="1408"></path></svg>';

    const glayer5 = new GeoJSON(data, {
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

    glayer5.addTo(map).bindPopup(layer => {
        return `<div style="height: 150px; width: 300px; display: grid; grid-gap: 10px; grid-template-columns: 1fr 1fr">
      <img style="height: 100%; width: 100%;" src=${layer.feature.properties['URL']
            }>
      <div style="display: grid; grid-gap: 10px; grid-template-rows: auto 1fr">
        <span>名称: ${layer.feature.properties['NAME']}</span>
        <span>描述: ${layer.feature.properties['DESC']}</span>
      </div>
    </div>`;
    });

}
