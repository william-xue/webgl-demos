function test(map) {
    // 绘制直线
    var latlngs1 = [
        [37.4552378188, 116.9989013672],
        [36.8378664654, 117.3999023438],
        [36.3151251475, 117.3422241211]
    ];
    var p1 = new Object();
    p1.color = 'blue';
    p1.weight = 2;
    var polyline = drawMapLine(map, latlngs1, p1);

    // 绘制多边形
    var latlngs2 = [
        [[36.5008053176, 118.6413574219],
            [36.5272948145, 119.1796875000],
            [36.3151251475, 118.8061523438]],
        [[37.0814756489, 118.9050292969],
            [37.2653099556, 121.1462402344],
            [36.9850030929, 121.0034179688],
            [36.3151251475, 119.8828125000]
        ]
    ];

    var p2 = new Object();
    p2.color = 'blue';
    p2.weight = 2;
    var polygon = drawPolygon(map, latlngs2, p2);

    var latlngs3 = [36.6485889420, 116.9824218750];
    var p3 = new Object();
    p3.color = 'blue';
    p3.weight = 1;
    var circle = drawCircle(map, latlngs3, 5000, p3);

    p3.dashArray = 5;
    p3.color = 'red';
    drawCircle(map, [36.2354121684, 115.9057617188], 5000, p3);

    var p4 = new Object();
    p4.color = 'blue';
    p4.weight = 2;
    drawCircleMarker(map, [38.2597498004, 116.8643188477], p4);


    var p5 = new Object();
    var myIcon = L.icon({
        iconUrl: 'resource/images/map/gif.gif',
        iconSize: [32, 32],
    });
    p5.icon = myIcon;
    p5.alt = '测试图标';
    var marker = createMaker(map, [36.0268893543, 120.4046630859], p5);
    addToolTips(map, marker, '我是\<br\/\>提示框！');

    var p6 = new Object();
    var myIcon1 = L.icon({
        iconUrl: 'resource/images/map/marker.png',
        iconSize: [32, 32],
    });
    p6.icon = myIcon1;
    p6.alt = '测试图标';
    createMaker(map, [36.6485889420, 116.9824218750], p6);


    drawText(map, [34.9805024454, 116.8176269531], '\<font color=\'red\'\>-10℃\<\/font\>')

    highLight(polyline, 10, 'blue', 'red');
    highLight(circle, 10, 'blue', 'red', 500, 1);
    highLight(polygon, 10, 'blue', 'red');
    map.on("zoomend",function(e){
    	alert(e);
    	
    });
}

var sdCrs = new L.Proj.CRS('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
        {
            origin: [-400, 400],
            resolutions: [
				0.00974627227988083
				,0.0073097042099106186
				,0.00487313613994041
				,0.00243656806997021
				,0.0012182840349851
				,0.000609142017492552
				,0.000304571008746276
				,0.000152285504373138
				,7.61427521865689E-05
				,3.80713760932845E-05
            ]
        });

function initMap(mapType){
	 L.TileLayerBase = L.TileLayer.extend({
         getTileUrl: function (tilePoint) {
             var zz = tilePoint.z.toString(16);
             var xx = tilePoint.x.toString(16);
             var yy = tilePoint.y.toString(16);
             return L.Util.template(this._url, L.extend({
                 s: this._getSubdomain(tilePoint),
                 z: "L" + pad(zz, 2),
                 x: "C" + pad(xx, 8),
                 y: "R" + pad(yy, 8)
             }, this.options));
         }
     });
// EPSG:4326
     var map = L.map('mapContiner', {
         crs: sdCrs,
         continuousWorld: true,
         worldCopyJump: false
     }).setView([36.223311,120.21767], 2);

     // 底图
     var mapTileUrl = mapUrl+'arc/{z}/{y}/{x}.png';
     if(mapType){
    	 isQdMap = false;
    	 L.Util.setOptions(map,{crs:sdCrs});
     }else{
    	 mapTileUrl = mapUrl+'qd/{z}/{y}/{x}.png';
    	 isQdMap = true;
     }
     var tileLayer = new L.TileLayerBase(mapTileUrl, {
         maxZoom: 10,
         minZoom: 0,
         continuousWorld: true
     });
     
     //增加监听====
 	map.on('movestart', function(e){
 		
	});
	// 鼠标移动停止
	map.on('moveend', function(e){
		
	});
	// 地图级别变化
	map.on("zoomend",function(e){
		var z = map.getZoom();
		
	});
	return map;
 }
/**
 * 
 * @param map地图对象
 * @param latlngs纬经度数组，二位数组
 * @param param
 *            参数对象，color、weight
 * @param zoom
 *            是否将中心点定位到线上
 * @return polyline对象
 */
function drawMapLine(map, latlngs, param, zoom) {
    var color = param.color == null ? 'red' : param.color;
    var weight = param.weight == null ? 1 : param.weight;
    if (!zoom) {
        zoom = false;
    }
    var polyline = L.polyline(latlngs, {color: color, weight: weight,smoothFactor: 0.5 }).addTo(map);
    if (zoom) {
        map.fitBounds(polyline.getBounds());

    }
    return polyline;
}

/**
 * 
 * @param map地图对象
 * @param latlngs纬经度数组,三维数组
 * @param param
 *            参数对象，color、weight 如果绘制虚线的多边形，请设置param属性dashArray值，建议为5
 * @param zoom
 *            是否将中心点定位到面上
 * @return polyline对象
 */
function drawPolygon(map, latlngs, param, zoom) {
	if(param.color == null){
		param.color == 'red';
	}
    if(param.weight == null){
    	param.weight == 1;
    }
    var dashArray = param.dashArray;
    if (!zoom) {
        zoom = false;
    }
    var polygon = L.polygon(latlngs, param).addTo(map);
    if (zoom) {
        map.fitBounds(polygon.getBounds());
    }
    return polygon;
}

/**
 * 
 * @param map地图对象
 * @param center
 *            圆心坐标，纬经度,一维数组
 * @param radius
 *            圆半径，单位m
 * @param param
 *            参数对象，color、weight 如果绘制虚线的圆，请设置param属性dashArray值，建议为5
 * @param zoom
 *            是否将中心点定位到圆上
 * @return polyline对象
 */
function drawCircle(map, center, radius, param, zoom) {
    var latlngs = createCirclePolygon(center, radius);

    return drawPolygon(map,[latlngs],param,zoom);
}

function drawPolygonPoint(map, latlngs){
	var result = new Array();
    for(var i = 0;i<latlngs.length;i++){
    	var circle = L.circleMarker(latlngs[i], {color: 'red', weight: 1,radius:2,fill:true,fillColor:'red',fillOpacity:1});
    	result.push(circle);
    }
    var layerGroup = L.layerGroup(result);
    map.addLayer(layerGroup);
    return layerGroup;
	
}

function drawCirclePoint(map, center, radius,lidu) {
	if(!lidu){
		lidu = 2;
	}
	var result = new Array();
    var latlngs = createCirclePolygon(center, radius,lidu);
    for(var i = 0;i<latlngs.length;i++){
    	var circle = L.circleMarker(latlngs[i], {color: 'red', weight: 1,radius:2,fill:true,fillColor:'red',fillOpacity:1});
    	result.push(circle);
    }
    var layerGroup = L.layerGroup(result);
    map.addLayer(layerGroup);
    return layerGroup;
}


function drawCircle1(map, center, radius, param, zoom) {
    var color = param.color == null ? 'red' : param.color;
    var weight = param.weight == null ? 1 : param.weight;
    var circle = L.circle(center, {radius: radius, color: color, weight: weight}).addTo(map);
    if (zoom) {
        map.fitBounds(circle.getBounds());
    }
    return circle;
}

/**
 * 绘制固定大小的的圆
 * 
 * @param map
 * @param center
 * @param param
 */
function drawCircleMarker(map, center, param, zoom) {
    var color = param.color == null ? 'red' : param.color;
    var weight = param.weight == null ? 1 : param.weight;
    var circle = L.circleMarker(center, {color: color, weight: weight}).addTo(map);
    if (zoom) {
        map.setView(center);
    }
    return circle;
}


/**
 * 
 * @param map
 * @param center
 * @param options
 *            参数对象必带icon，选填alt
 * 
 * icon，iconUrl和iconSize必带，其他选填 var myIcon = L.icon({ iconUrl: 'my-icon.png',
 * iconSize: [38, 95], iconAnchor: [22, 94], popupAnchor: [-3, -76], shadowUrl:
 * 'my-icon-shadow.png', shadowSize: [68, 95], shadowAnchor: [22, 94] });
 * 
 * @param zoom
 * @return marker
 */
function createMaker(map, center, options, zoom) {
    var marker = L.marker(center, options).addTo(map);
    if (zoom) {
        map.setView(center);
    }
    return marker;
}
/**
 * 
 * @param target高亮的对象
 * @param count闪烁次数
 * @param color图形初始颜色
 * @param newColor
 *            闪烁的颜色
 * @param timedelay
 *            闪烁间隔
 */
function highLight(target, count, color, newColor, timedelay, weight) {
    if (!weight) {
        weight = 2;
    }
    if (!timedelay) {
        timedelay = 500;
    }
    var hitCount = 0;
    var t = setInterval(function () {

        var c = '';
        // console.log(hitCount % 2)
        if (hitCount % 2 == 0) {
            c = newColor;
        } else {
            c = color;
        }
        target.setStyle({
            color: c,
            opacity: 1,
            weight: weight
        });
        hitCount++;
        if (hitCount >= count) {
            clearInterval(t);
            target.setStyle({
                color: color,
                opacity: 1,
                weight: weight
            });
        }
    }, timedelay);
}

/**
 * 
 * @param map
 * @param center
 * @param htmlText
 * @param bgPos
 *            L.point(16,-16);相对于背景的偏移位置，pix
 * @param divClass
 *            可在在css中定义
 */
function drawText(map, center, htmlText) {
    var myIcon = L.divIcon({className: 'vertical-text', html: htmlText});
    var markerLayer = L.marker(center, {icon: myIcon}).addTo(map);
    return markerLayer;
}

/**
 * 
 * @param point
 *            需要添加tooltip的标注
 * @param htmlText
 *            显示内容，支持html标记
 * @param option
 *            offset Point Point(0, 0) direction String 'right, left, top,
 *            bottom, center, auto'
 */
function addToolTips(map, point, htmlText, option) {
    if (!option) {
        option = new Object();
        option.offset = L.point(16, -16);
        option.direction = "top";
        option.permanent = true;
    }

    point.bindTooltip(htmlText, option).openTooltip();
    L.DomEvent.on(point, "click", function () {
        if (point.getTooltip().isOpen()) {
            map.closeTooltip(point.getTooltip());// .closeTooltip();
        } else {
            map.openTooltip(point.getTooltip());// .openTooltip();
        }
    });
}
//根据中心点、半径、刻度创建圆
function createCirclePolygon(center, r,angleSpan) {
    var radius = r / (((Math.PI * 2) * 5730000) / 360);// 计算弧度
    var angle = 0;
    var x = 0;// 经度
    var y = 0;// 纬度
    if(!angleSpan){
    	angleSpan = 5;
    }
    var count = ((360 / angleSpan) + 1);
    var pt;
    var ring = new Array();
    var i = 0;
    var xx = Number(center[1]);
    var yy = Number(center[0]);
    while (i < count) {
        x = (xx + (radius * Math.sin(((angle * Math.PI) / 180))));
        y = (yy + (radius * Math.cos(((angle * Math.PI) / 180))));
        x = x.toFixed(6);
        y = y.toFixed(6);
        angle = (angle + angleSpan);
        pt = [y, x];
        // pt = [x, y]
        ring.push(pt);
        i++;
    }
    //console.log(ring)
    return ring;
}

