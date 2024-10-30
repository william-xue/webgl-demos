let hasEdit = false; // 判断是否有编辑
var drawGeo = null; // 绘制的几何图形，用来做缓冲区
var editableLayers = new L.FeatureGroup(); // 编辑几何图层集
function startEdit() {
  hasEdit = true;
  // draw start
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
}

// 路灯缓冲区点击响应
$('#ldhcqclick').click(function () {
  if (hasEdit) return;
  startEdit();
});

// 建筑物缓冲区点击响应
$('#jzwhcqclick').click(function () {
  if (hasEdit) return;
  startEdit();
});

function jzwbufferquery() {
  let distance = $('#jzwBufferValue').val()
  if (drawGeo == null || !distance) {
    alert('请先画几何图形')
    return;
  }
  geoBufferAnalystProcess('All_Building@Campus', distance) // 格式为数据集@数据源，iserver中可以查看，这里是建筑物
}

function ldbufferquery() {
  let distance = $('#ldBufferValue').val()
  if (drawGeo == null || !distance) {
    alert('请先画几何图形')
    return;
  }
  geoBufferAnalystProcess('StreetLights@Campus', distance) // 格式为数据集@数据源，iserver中可以查看，这里是路灯
}

// 清除图上图形
function bufferclear() {
  drawGeo = null;
  map.eachLayer(function (layer) {
    if (!layer._container || ('' + jQuery(layer._container).attr('class')).replace(/\s/g, '') != 'leaflet-layer') {
      layer.remove();
    }
  });
  editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);
}

function geoBufferAnalystProcess(layerName, distance) {
  bufferAnalystService = L.supermap.spatialAnalystService(url5); // 发布的空间分析服务地址，在first.js中定义
  //对生成的线路进行缓冲区分析
  geoBufferAnalystParams = new SuperMap.GeometryBufferAnalystParameters({
    sourceGeometry: drawGeo,
    sourceGeometrySRID: 4326,   // 指定坐标系，不然不识别distance范围
    bufferSetting: new SuperMap.BufferSetting({
      endType: SuperMap.BufferEndType.ROUND,
      leftDistance: new SuperMap.BufferDistance({ value: distance }), // 缓冲距离
      rightDistance: new SuperMap.BufferDistance({ value: distance }),
      semicircleLineSegment: 10 // 数字越大，越圆滑
    })
  });
  bufferAnalystService.bufferAnalysis(geoBufferAnalystParams, function (serviceResult) {
    if (!serviceResult.result) return;
    resultLayer = L.geoJSON(serviceResult.result.resultGeometry).addTo(map);

    queryService = L.supermap.queryService(url);  // url 为发布的rest服务地址，在first.js 中定义的
    queryByGeometryParameters = new SuperMap.QueryByGeometryParameters({
      queryParams: [new SuperMap.FilterParameter({ name: layerName })], // name是图层名
      geometry: resultLayer,
      spatialQueryMode: SuperMap.SpatialQueryMode.INTERSECT // 几何查询中相交的元素
    });
    queryService.queryByGeometry(queryByGeometryParameters, function (serviceResult) {
      var result = serviceResult.result;
      L.geoJSON(result.recordsets[0].features).bindPopup(function (layer) {
        // 查询结果要素弹窗
        let obj = layer.feature.properties;
        let res = ''
        Object.keys(obj).forEach(function (key) {
          res += `<div style="color:blue;">${key}：${obj[key]}</div>`
        })
        return res;
      }).addTo(map);
    });
  });
}