var map, bufferAnalystService, geoBufferAnalystParams, resultLayer,
  queryService, queryByGeometryParameters, resultLayer1,
  baseUrl = "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China", // 3857
  // baseUrl = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World",// 4326 底图服务和业务图层服务要坐标系对应上
  busiUrl = "http://localhost:8090/iserver/services/map-20220120/rest/maps/test%4020200120", // 你发布的点数据rest图层服务
  serviceUrl = "http://localhost:8090/iserver/services/spatialAnalysis-20220120/restjsr/spatialanalyst"; // 发布的点数据空间分析服务
// map = L.map('map', {
//   crs: L.CRS.EPSG4326,
//   center: [31.93, 118.85],
//   maxZoom: 18,
//   zoom: 10
// });
// L.supermap.tiledMapLayer(baseUrl, { noWrap: true }).addTo(map);
L.supermap.tiledMapLayer(busiUrl, { noWrap: true }).addTo(map);
L.control.scale().addTo(map)

// draw start
var drawGeo = null;
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
var options = {
  position: 'topleft',
  draw: {
    polyline: {},
    polygon: {},
    circle: {},
    rectangle: {},
    marker: {},
    remove: {}
  },
  edit: {
    featureGroup: editableLayers,
    remove: true
  }
};
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);
handleMapEvent(drawControl._container, map);
map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
    layer = e.layer;
  console.log(e)
  drawGeo = e.layer;
  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }
  editableLayers.addLayer(layer);
});

function handleMapEvent(div, map) {
  if (!div || !map) {
    return;
  }
  div.addEventListener('mouseover', function () {
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
  });
  div.addEventListener('mouseout', function () {
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
  });
}
// draw end

$("#buffer").click(() => {
  console.log(1111, editableLayers, $("#distance").val());
  geoBufferAnalystProcess();
})
$("#clear").click(() => {
  //移除除底图外的所有图层
  map.eachLayer(function (layer) {
    if (!layer._container || ('' + jQuery(layer._container).attr('class')).replace(/\s/g, '') != 'leaflet-layer') {
      layer.remove();
    }
  });
  editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);
})

function geoBufferAnalystProcess() {
  var pointsList = [
    [-4690.000, 2823.940]
  ];
  //在地图上添加所有离散gps信号点
  for (var i = 0; i < pointsList.length; i++) {
    L.circleMarker(pointsList[i], { color: 'black', radius: 2 }).addTo(map);
  }
  //将离散gps信号点生成线路
  var roadLine = L.polyline(pointsList, { color: 'red' }).addTo(map);
  bufferAnalystService = L.supermap.spatialAnalystService(serviceUrl);
  //对生成的线路进行缓冲区分析
  geoBufferAnalystParams = new SuperMap.GeometryBufferAnalystParameters({
    sourceGeometry: drawGeo,
    sourceGeometrySRID: 3857,   // 指定坐标系，不然不识别distance范围
    bufferSetting: new SuperMap.BufferSetting({
      endType: SuperMap.BufferEndType.ROUND,
      leftDistance: new SuperMap.BufferDistance({ value: $("#distance").val() }),
      rightDistance: new SuperMap.BufferDistance({ value: $("#distance").val() }),
      semicircleLineSegment: 10
    })
  });
  bufferAnalystService.bufferAnalysis(geoBufferAnalystParams, function (serviceResult) {
    resultLayer = L.geoJSON(serviceResult.result.resultGeometry).addTo(map);

    queryService = L.supermap.queryService(busiUrl);
    queryByGeometryParameters = new SuperMap.QueryByGeometryParameters({
      queryParams: [new SuperMap.FilterParameter({ name: "test@20200120" })], // name是图层名
      geometry: resultLayer,
      spatialQueryMode: SuperMap.SpatialQueryMode.INTERSECT
    });
    queryService.queryByGeometry(queryByGeometryParameters, function (serviceResult) {
      var result = serviceResult.result;

      resultLayer1 = L.geoJSON(result.recordsets[0].features).bindPopup(function (layer) {
        console.log(layer.feature.properties)
        let obj = layer.feature.properties;
        let res = ''
        Object.keys(obj).forEach(function (key) {
          res += `<div>${key}：${obj[key]}</div>`
        })
        return res;
      }).addTo(map);
    });
  });
}
