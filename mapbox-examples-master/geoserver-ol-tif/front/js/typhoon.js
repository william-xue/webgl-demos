let map;
window.onload=function(){
    map = new ol.Map({
        target: 'map',                          // 关联到对应的div容器
        layers: [
            new ol.layer.Tile({                 // 瓦片图层
                source: new ol.source.OSM()     // OpenStreetMap数据源
            })
        ],
        view: new ol.View({                     // 地图视图
            projection: 'EPSG:3857',
            center: [0, 0],
            zoom: 0
        }),
        controls: ol.control.defaults().extend([
            new ol.control.OverviewMap({        // 实例化一个OverviewMap类的对象，并加入到地图中
                layers:[
            new ol.layer.Tile({                 // 瓦片图层
                source: new ol.source.OSM()     // OpenStreetMap数据源
            })
        ],
                view: new ol.View({                     // 地图视图
                    projection: 'EPSG:3857',
           
        }),
            })        
        ])
    });
    popUp();
    var url="../data/typhoon.json";
    $.ajax({
        type:'get',//方法类型  
        url:url,
        dataType:'json',//数据类型 
        success:function(data){
            data=data.features;
            addPoint(data);
            showInfo(data);
        }
    })
   
}

function addPoint(data){
    let features=[];
    let lines=[]
    for(var i=0;i<data.length;i++){
        let curPointData = data[i].properties;
        let [lng, lat] = [curPointData.longitude, curPointData.latitude];
        let position = ol.proj.fromLonLat([lng, lat]);
        let featureByPoint = new ol.Feature({
            geometry: new ol.geom.Point(position),
          });
        let speed=curPointData['max wind speed(intensity)']
        featureByPoint.setStyle(new ol.style.Style({
            image:new ol.style.Circle({
                radius: 2,
                fill: new ol.style.Fill({
                    color:getColor(speed)
                }),
                stroke: new ol.style.Stroke({color: getColor(speed), width: 1}),
              })
        }))
        featureByPoint.set('typhoonPoint',true);
        featureByPoint.set('id',i);
        features.push(featureByPoint);
        if(i!=data.length-1){
            let nextPos=data[i+1].properties;
            let [nexLng,nexLat]=[nextPos.longitude,nextPos.latitude];
            lines.push([ol.proj.fromLonLat([lng, lat]),ol.proj.fromLonLat([nexLng, nexLat])]);
        }
    }

    let featureByLine=new ol.Feature({
        geometry: new ol.geom.MultiLineString(lines)
    })
    features.push(featureByLine);
    let layer=new ol.layer.Vector();
    let source=new ol.source.Vector();
    source.addFeatures(features);
    layer.setSource(source);
    map.addLayer(layer);
}

function addPointInterval(data){
    let points = data;
    let index = 0;
    let layer = new VectorLayer();
    let source = new VectorSource();
    layer.setSource(source);
    let intervalLogo = setInterval(() => {
        if (index == points.length) {
          clearInterval(intervalLogo);
          return;
        }
        let position = [points[index].longitude, points[index].latitude];
        if (index == 0) {
          map.getView().setCenter(fromLonLat(position));
        }
        // 点 的 数据源设置
        let featurePoint = new ol.Feature({
          geometry: new Point(fromLonLat(position)),
        });
        let speed=points[index]['max wind speed(intensity)']
        featureByPoint.setStyle(new ol.style.Style({
            image:new ol.style.Circle({
                radius: 2,
                fill: new ol.style.Fill({
                    color:getColor(speed)
                }),
                stroke: new ol.style.Stroke({color: getColor(speed), width: 1}),
              })
        }))
        featurePoint.set("typhoonPoint", true);
        featurePoint.set("id", index);
        // 写到这里的时候 预期的结果 应该是 如果有 全部都绘制了  、 没有清除  上一个被绘制的目标点
        if (
          points[index].radius7.length != 0 ||
          points[index].radius7 != null
        ) {
          let featureSolar = this.drawSolarExact(points[index]);
          let lastShowSolar = this.lastShowSolar;
          if (lastShowSolar != null) {
            source.removeFeature(lastShowSolar);
          }
          this.lastShowSolar = featureSolar;
          source.addFeature(featureSolar);
        }

        source.addFeature(featurePoint);

        if (index > 0) {
          let lastPosition = [points[index - 1].longitude, points[index - 1].latitude];
          let featureLine = new ol.Feature({
            geometry: new ol.geom.LineString([
              fromLonLat(position),
              fromLonLat(lastPosition),
            ]),
          });
          source.addFeature(featureLine);
        }
        // 需要一个出口
        index++;
      }, 100);
      this.map.addLayer(layer);
    }
var lastZoomPoint=null;
function showInfo(data){
    
    map.on('pointermove',function(ev){
        let feature=map.forEachFeatureAtPixel(ev.pixel,function(feature){
            return feature;
        })
            if(feature){
                if(feature.get('typhoonPoint')){
                    map.getTargetElement().style.cursor='pointer';
                    if(lastZoomPoint!=null){
                      //  console.log("hello")
                        lastZoomPoint.getStyle().getImage().setRadius(2);
                        lastZoomPoint.changed();
                    }
                    console.log(feature.getStyle().getImage())
                    feature.getStyle().getImage().setRadius(4);
                    feature.changed();
                    lastZoomPoint=feature;
                    var id=feature.get('id');
                    showDetails(ev,id,data);
                    
                }
            }else{
                 if(lastZoomPoint!=null){
                   // console.log("hello")
                    lastZoomPoint.getStyle().getImage().setRadius(2);
                    lastZoomPoint.changed();
                 }
                map.getTargetElement().style.cursor='';
                overlay.setPosition(undefined);
            }
      
        }) 
}
let overlay=null
const container = document.getElementById('info-box');
function popUp(){
    overlay = new ol.Overlay({
        element: container,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
    overlay.setPosition(undefined);
    map.addOverlay(overlay)
    
}

function showDetails(ev,id,data){
    let curPointData = data[id].properties; //当前悬浮的点的数据
    const coordinate = ev.coordinate;//求得坐标
    overlay.setPosition(coordinate);
    var textSpan=document.getElementsByClassName('rightSpan');
    var date=curPointData.date.split("-");
    var hour=curPointData.time.split(':')[0];
    var lon=curPointData.longitude;
    var lat=curPointData.latitude;
    var speed=curPointData['max wind speed(intensity)'];
    var pressure=curPointData['min pressure'];
    var str=date[0]+"年"+delZero(date[1])+"月"+delZero(date[2])+"日"+delZero(hour)+"时";
    textSpan[0].innerHTML=id;
    textSpan[1].innerHTML=str;
    var str=lon+"°/"+lat+"°";
    textSpan[2].innerHTML=str;
    textSpan[3].innerHTML=speed;
    textSpan[4].innerHTML=pressure;
}

function delZero(str){
    if(str[0]=='0'){
        str=str.substr(1);
    }
    return str;
}

function getColor(speed){
    let color;
    if(speed>=10.8&&speed<=17.1){
        color='rgb(233,218,122)'
    }else if(speed>=17.2&&speed<=24.4){
        color='rgb(16,29,199)'
    }else if(speed>=24.5&&speed<=32.6){
        color='green'
    }else if(speed>=32.7&&speed<=41.4){
        color='rgb(239,171,118)'
    }else if(speed>=41.5&&speed<=50.9){
        color='rgb(193,89,196)'
    }else{
        color='red'
    }
    return color
}