function toolbar_img_over(event) {

    event.style.background = "rgb(100,100,100)";
}

function toolbar_img_out(event) {
    event.style.background = "rgb(240, 231, 231)"
}

function setTool(tooltype) {
    if (tooltype == "pan")
        map.enablePan();

    if (tooltype == "zoomin")
        level = map.getLevel() + 1;
    map.setLevel(level);

    if (tooltype == "zoomout")
        level = map.getLevel() - 1;
    map.setLevel(level);

    if (tooltype == "full")
        level = map.getMinZoom();
    map.setLevel(level);


}
function initPage() {
    //设定切换地图div的位置
    ele = document.getElementById("div_mapType");
    // 距离右边的宽度：10px
    ele.style.right = "10px";
    // top的高度为8%
    ele_top = document.body.clientHeight * 0.08 + "px";
    ele.style.top = ele_top;
    // 可见性
    ele.style.visibility = "visible";
    ele = document.getElementById("div_distance");
    ele.style.right = "220px";
    ele_top = (document.body.clientHeight * 0.08 + 32) + "px";
    ele.style.top = ele_top;
    ele.style.visibility = "visible";

    //坐标查询：
    ele = document.getElementById("div_searchLocation");
    ele.style.right = "10px";
    ele_top = (document.body.clientHeight * 0.08 + 80) + "px";
    ele.style.top = ele_top;
    //ele.style.visibility="visible"; 
    // //空气质量
    // ele = document.getElementById("div_AQI");
    // ele.style.left = "1px";
    // ele_top = (document.body.clientHeight * 0.08 + 170) + "px";
    // ele.style.top = ele_top;
    // ele.style.width = "450px";
    // ele.style.visibility="visible"; 
    //地点查询：
    ele = document.getElementById("div_searchAddress");
    ele.style.right = "10px";
    ele_top = (document.body.clientHeight * 0.08 + 250) + "px";
    ele.style.top = ele_top;


}

function setMap(mapType) {
    var ele_street = document.getElementById('street_map');
    var ele_image = document.getElementById('image_map');
    if (mapType == "street") {
        tiled.setVisibility(true);
        tiled_image.setVisibility(false);
        ele_street.style.borderWidth = '1px';
        ele_image.style.borderWidth = '0px';
    }
    else {
        tiled.setVisibility(false);
        tiled_image.setVisibility(true);
        ele_street.style.borderWidth = '0px';
        ele_image.style.borderWidth = '1px';
    }
}
function xy() {
    //设定显示坐标div的位置
    ele = document.getElementById("div_mapCoordinates");
    ele.style.right = "220px";
    ele_top = (document.body.clientHeight * 0.08) + "px";
    ele.style.top = ele_top;
    ele.style.visibility = "visible";
}
function map_mousemove_xy(event) {
    ele = document.getElementById("div_xy");
    //console.log(event);
    ele.innerHTML = "&nbsp;横坐标：" + String(event.mapPoint.x).substring(0, 13) +
        "&nbsp;纵坐标：" + String(event.mapPoint.y).substring(0, 13);
}
function mousemove_xy(event) {
    ele = document.getElementById("div_xy1");
    var pt = normalizedVal.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
    //console.log(pt);
    ele.innerHTML = "&nbsp;经度：" + String(pt[0]).substring(0, 6) +
        "&nbsp;纬度：" + String(pt[1]).substring(0, 6);

}

function addGraphic(evt) {
    drawtool.deactivate();
    map.enableMapNavigation();
    var symbol;
    //如果添加的图形是点就使用markerSymbol,如果是线使用lineSymbol,面使用fillSymbol
    if (evt.geometry.type == "point" || evt.geometry.type === "multipoint") {
        symbol = markerSymbol;
    }
    else if (evt.geometry.type == "line" || evt.geometry.type === "polyline") {
        symbol = lineSymbol;
    }
    else if (evt.geometry.type == "polygon" || evt.geometry.type === "ellipse") {
        symbol = fillSymbol;
    }
    else if (evt.geometry.type == "freehandpolyline" || evt.geometry.type === "polyline") {
        symbol = lineSymbol;
    }
    else {
        symbol = fillSymbol;
    }
    graphic = createNewGraphic();
    graphic.geometry = evt.geometry;
    graphic.symbol = symbol;
    glayer.add(graphic);
}
function draw_handler(mode) {
    drawtool.activate(mode);
}
///生成随机点：
function createRandomPoints() {
    var lng = -180 + Math.random() * 360;
    var lat = -80 + Math.random() * 160;
    console.log(lng);
    var pt = createNewPoint(lng, lat);
    map.centerAndZoom(pt, 2);
    var graphic = createNewGraphic();
    graphic.geometry = pt;
    graphic.symbol = markerSymbol;
    glayer.add(graphic);
}
function createPointsByLng() {
    for (i = -80; i <= 80; i += 3) {
        // console.log(i);
        var pt = createNewPoint(127, i);
        var graphic = createNewGraphic();
        graphic.geometry = pt;
        graphic.symbol = markerSymbol;
        glayer.add(graphic);
    }

}

// 测量面积
function measureArea(mode){
    drawtool_area.activate(mode);
}
function area_draw_Hanlder(evt) {
    drawtool_area.deactivate();
    glayer.clear();

    var areasAndLengthParams = createNewAreasAndLengthsPara();
    areasAndLengthParams.lengthUnit = lengthUnit;
    areasAndLengthParams.areaUnit = areasUnit;
    geometryService.simplify([evt.geometry], function(simplifiedGeometries) {
        areasAndLengthParams.polygons = simplifiedGeometries;
        geometryService.areasAndLengths(areasAndLengthParams);
    });

    graphic = createNewGraphic();
    graphic.geometry = evt.geometry;
    graphic.symbol = fillSymbol;
    glayer.add(graphic);
}


//激活测量距离的drawtool
function measureDistance(mode) {
    drawtool_distance.activate(mode);
}
function measureDistance2(mode) {
    drawtool_distance2.activate(mode);
}
function distance_draw_Hanlder(evt) {
    drawtool_distance.deactivate();
    var lengthParams = createNewLengthsPara();
    glayer.clear();

    lengthParams.polylines = [evt.geometry];
    //距离量算是用的单位米，不同html文件中设置不一样，当使用人口数据的动态地图是为千米
    lengthParams.lengthUnit = geometryUnit;
    lengthParams.geodesic = true; //平面坐标，所以设置false
    console.log(lengthParams);

    geometryService.lengths(lengthParams);
    graphic = createNewGraphic();
    graphic.geometry = evt.geometry;
    graphic.symbol = lineSymbol;
    glayer.add(graphic);
}


function outputDistance(evtObj) {
    var result = evtObj.result;
    console.log(result);
    ele = document.getElementById("div_distance");
    ele.innerHTML = (result.lengths[0] ).toFixed(3) + "英里";
    ele.style.visibility = "visible";
}

function outputArea(evtObj) {
    var result = evtObj.result;
    console.log(result);
    ele = document.getElementById("div_distance");
    ele.innerHTML = (result.lengths[0] ).toFixed(3) + "平方英里";
    ele.style.visibility = "visible";
}

function tool(t) {   //绘制工具
    if (t == "drawtool") {
        ele = document.getElementById("div_drawtools");
        ele.style.visibility = "visible";
    }
    else if (t == "measuretool") {
        ele = document.getElementById("div_measuretools");
        ele.style.visibility = "visible";
    }
    else if (t == "statisticstool") {
        ele = document.getElementById("div_statisticstools");
        ele.style.visibility = "visible";
    }

}
function close_tools(t) {
    if (t == "drawtool") {
        ele = document.getElementById("div_drawtools");
        ele.style.visibility = "hidden";
    }
    else if (t == "measuretool") {
        ele = document.getElementById("div_measuretools");
        ele.style.visibility = "hidden";
    }
    else if (t == "statisticstool") {
        ele = document.getElementById("div_statisticstools");
        ele.style.visibility = "hidden";
    }
}

function searchLocation() {  //实现查找坐标
    var lng = document.getElementById("txt_search_lng").value;
    var lat = document.getElementById("txt_search_lat").value;
    //console.log(lng,lat);
    var pt = createNewPoint(lng, lat);
    map.centerAndZoom(pt, 9);
    var graphic = createNewGraphic();
    graphic.geometry = pt;
    graphic.symbol = picMarkerSymbol;
    glayer.add(graphic);
}
//打开老龄化或男女比例的dialog：
function showdialog(n) {
    if (n == "nf") {
        ele = document.getElementById("div_nf");
        ele.style.visibility = "visible";
    }
    if (n == "llh") {
        ele = document.getElementById("div_llh");
        ele.style.visibility = "visible";
    }
}
//关闭老龄化或男女比例的dialog：
function closedialog(n) {
    if (n == "nf") {
        ele = document.getElementById("div_nf");
        ele.style.visibility = "hidden";
    }
    if (n == "llh") {
        ele = document.getElementById("div_llh");
        ele.style.visibility = "hidden";
    }
}
//精确查询州名：
function searchAddress() {
    //ele获取州的名字
    ele = document.getElementById("txt_address");

    url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
    var queryTask = createNewQueryTask(url);
    // console.log(queryTask);
    var query = createNewQuery();
    //返回几何对象：
    query.returnGeometry = true;
    //返回所有字段*：
    query.outFields = ["*"];
    //模糊查询：
    query.where = "STATE_NAME like '%" + ele.value + "%'"
    //精确查询： query.where = "STATE_NAME = '" + ele.value + "'";
    query.outSpatialReference = map.spatialReference;
    // console.log(query);
    queryTask.execute(query, showResults);

}
//query查询结果添加到地图
function showResults(results) {
    ele=document.getElementById("div_nf");
    ele.style.visibility="hidden";
    ele = document.getElementById("div_llh");
    ele.style.visibility="hidden";

    glayer.clear();
    var resultsCount = results.features.length;
    console.log(resultsCount);
    var symbol;
    for (var i = 0; i < resultsCount; i++) {
        if (results.features[i].geometry.type === "point" || results.features[i].geometry.type === "multipoint") {
            symbol = picMarkerSymbol;
        } else if (results.features[i].geometry.type === "line" || results.features[i].geometry.type === "polyline") {
            symbol = lineSymbol;
        }
        else {
            symbol = fillSymbol;
        }
        var graphic = createNewGraphic();
        graphic.geometry = results.features[i].geometry;
        graphic.symbol = symbol;
        glayer.add(graphic);
        //将查询到的内容缩放到全屏：
        var gExtent = graUtils.graphicsExtent(glayer.graphics);
        map.setExtent(gExtent.expand(2));
    }
}
//查询人口：
function searchPopu() {
    //ele获取州的名字
    ele = document.getElementById("txt_Popu");

    url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
    var queryTask = createNewQueryTask(url);
    // console.log(queryTask);
    var query = createNewQuery();
    //返回几何对象：
    query.returnGeometry = true;
    //返回所有字段*：
    query.outFields = ["*"];
    var elel = ele.value * 10e4;
    //家庭成员>4：
    query.where = "FHH_CHILD >2 group by FAMILIES>4";
    //人口逆增长：
    //query.where ="POP2000>POP2007";
    //query.where ="POP2007 >" +elel;
    //精确查询： query.where = "STATE_NAME = '" + ele.value + "'";
    query.outSpatialReference = map.spatialReference;
    //console.log(query.where);
    queryTask.execute(query, showResults);

}
function showPopuDialog() {
    ele = document.getElementById("div_searchPopu");
    ele.style.visibility = "visible";
}
function closeSearchPopu() {
    ele = document.getElementById("div_searchPopu");
    ele.style.visibility = "hidden";
}
//矩形框选择要素
function select_draw_Hanlder(evt) {

    drawtool_select.deactivate();
    map.enableMapNavigation();
    var symbol;
    //如果添加的图形是点就使用markerSymbol,如果是线使用lineSymbol,面使用fillSymbol
    if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
        symbol = markerSymbol;
    }
    else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
        symbol = lineSymbol_select;
    }
    else {
        symbol = fillSymbol_select;
    }
    graphic = createNewGraphic();
    graphic.geometry = evt.geometry;
    graphic.symbol = symbol;
    glayer_select.add(graphic);

    //使用querytask进行空间查询
    url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
    var queryTask = createNewQueryTask(url);
    // console.log(queryTask);
    var query = createNewQuery();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.geometry = evt.geometry;
    query.spatialRelationship = 'esriSpatialRelIntersects';//'esriSpatialRelContains' 包含关系;//esriSpatialRelIntersects
    query.outSpatialReference = map.spatialReference;//esriSpatialRelIntersects 交叉关系
    // console.log(query);
    queryTask.execute(query, showResults_select);
}
//query空间查询结果添加到地图
function showResults_select(results) {
    var resultsCount = results.features.length;
    console.log(resultsCount);
    var symbol;
    for (var i = 0; i < resultsCount; i++) {
        if (results.features[i].geometry.type === "point" || results.features[i].geometry.type === "multipoint") {
            symbol = picMarkerSymbol;
        } else if (results.features[i].geometry.type === "line" || results.features[i].geometry.type === "polyline") {
            symbol = lineSymbol;
        }
        else {
            symbol = fillSymbol;
        }
        var graphic = createNewGraphic();
        graphic.geometry = results.features[i].geometry;
        graphic.symbol = symbol;
        glayer_select.add(graphic);

    }
    var gExtent = graUtils.graphicsExtent(glayer_select.graphics);
    map.setExtent(gExtent.expand(2));
}
function activate_draw_select(toolmode) {
    glayer_select.clear();
    drawtool_select.activate(toolmode);
}
//出现人口老龄化的州
function searchLocation(){
    ele=document.getElementById("txt_popu");

    url="http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
    var queryTask=createNewQueryTask(url);
    //console.log(queryTask);
    var query=createNewQuery();
    query.returnGeometry=true;
    query.outFields=["*"];
    query.where="AGE_65_UP/POP2007>0.07";
    console.log(query.where);
    query.outSpatialReference=map.spatialReference;
    //console.log(query);
    queryTask.execute(query,showResults);
}
//Florida州男性居民数量多于女性居民数量的县
function searchAddress(){
    ele=document.getElementById("txt_address");

    url="http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/2";
    //统计图层转换为县
    var queryTask=createNewQueryTask(url);
  
    var query=createNewQuery();
    query.layerIds=[3];
    query.returnGeometry=true;
    query.outFields=["*"];
    query.where="MALES>FEMALES  AND  STATE_NAME='Florida'";
    
    query.outSpatialReference=map.spatialReference;
   
    queryTask.execute(query,showResults);
}
