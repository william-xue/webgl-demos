
let map;
$(function () {
  //  初始化地图容器并加入 地图底图

  // 加载天地图添加电子地图 或者 影像
  // 地形图：http://t4.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=key
  // 街道图：http://t4.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=key
  // 影像图：http://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=key
  // 影像标注：http://t4.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=key
  // 地形标注：http://t4.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=key
  // 矢量标注：http://t4.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=key
  // var vector_map = L.tileLayer("http://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=93724b915d1898d946ca7dc7b765dda5").addTo(map);
  //添加注记
  map = new ol.Map({
    interactions: ol.interaction.defaults().extend([new ol.interaction.DragZoom()]),
    view: new ol.View({
      center: ol.proj.fromLonLat([114, 30.5]), //定位到的经纬度
      zoom: 5
    }),
    layers: [
      // osm底图
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      // 高德影像
      // new ol.layer.Tile({
      //   source: new ol.source.XYZ({
      //     url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
      //   })
      // }),
      // // arcgis
      // new ol.layer.Tile({
      //   source: new ol.source.XYZ({
      //     url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
      //   })
      // }),
    ],
    target: 'map-container' //mapdiv的id
  });
  map.addControl(new ol.control.FullScreen())
  

  let url = 'http://localhost:8081/geoserver/gwc/service/wmts';
  // 存储添加的wmts图层
  let mylayers = []; 

  $("#menu input").change(function () {
    let name = $(this).attr('name');
    console.log($(this)[0].checked, name)
    
    let findLyr =  mylayers.find(item=>item.name == name)
    if ($(this)[0].checked) { // 显示
      if(findLyr){ // 已经添加过了
        findLyr.layer && findLyr.layer.setVisible(true);
      }else{ // 未添加过
        let layer = addWMTS(name)
        mylayers.push({
          name,
          layer
        })
      }
    } else { // 隐藏
      findLyr.layer && findLyr.layer.setVisible(false);
    }

  })

  function addWMTS(name){
    //设置地图投影
    var projection = ol.proj.get('EPSG:4326');
    var projectionExtent = projection.getExtent();
    var matrixIds = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10',
      'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
    //切片大小
    var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5,
      4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];

    var source = new ol.source.WMTS({
      url: url,
      layer: name,
      matrixSet: 'EPSG:4326',
      format: 'image/png',
      projection: projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      wrapX: true
    })
    source.setTileLoadFunction(function customLoader(tile, src) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.addEventListener('loadend', function (evt) {
        var data = this.response;
        if (data !== undefined) {
          tile.getImage().src = URL.createObjectURL(data);
        } else {
          tile.setState(TileState.ERROR);
        }
      });
      xhr.addEventListener('error', function () {
        tile.setState(TileState.ERROR);
      });
      xhr.open('GET', src);
      xhr.setRequestHeader('f00', 'bar');
      xhr.send();
    })
    let mylayer = new ol.layer.Tile({
      source: source
    })
    map.addLayer(mylayer);
    return mylayer;
  }


  // 点击获取坐标
  map.on('click',(e)=>{
    console.log(e)
    let coord = e.coordinate;
    // var newCoord= ol.proj.fromLonLat(coord,'EPSG:3857');
    var newCoord = ol.proj.transform(coord,'EPSG:3857', 'EPSG:4326')
    console.log(newCoord)
  })

  // 绘制线段

  let featureLine = new ol.Feature({
    geometry: new ol.geom.LineString([
      ol.proj.fromLonLat([115.403218, 39.92372],'EPSG:3857'),
      ol.proj.fromLonLat([112.503218, 39.62372],'EPSG:3857'),
      ol.proj.fromLonLat([101.503218, 39.62372],'EPSG:3857'),
    ]),
  });
  let source = new ol.source.Vector()
  source.addFeature(featureLine)
  let layer = new ol.layer.Vector({id:'111'})
  layer.setSource(source)
  map.addLayer(layer)
})