window.load = () => {
    // Write Javascript code!
    // 三个覆盖层的图层对象
    var layer1 = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }),
        layer2 = new L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenTopoMap'
        }),
        layer3 = new L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri'
        });

    // 创建地图容器对象
    var map = new L.map('map', {
        center: [39.915, 116.404], // 北京市中心坐标
        zoom: 10, // 初始缩放级别
        layers: [layer2] // 图层组
    });
    //map.setView([39.909186, 116.397411], 10);

    // 定义图层组控制对象
    var baseMaps = {
        "OSM": layer1,
        "TopoMap": layer2,
        "Satellite": layer3
    };

    // 添加图层组控制到地图对象
    // new L.control.layers(baseMaps).addTo(map);


};