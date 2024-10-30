//地图
mapboxgl.accessToken = 'pk.eyJ1IjoibW9rMTIzIiwiYSI6ImNrdnowcGI5ejE4YTcydW9sbHpyMnJ1bG0ifQ.T8OFc77vrgvUjVxPPMNwjg';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  // style: 'mapbox://styles/mok123/ckvz470ui79fu14ldfmkllg7h', // stylesheet location
  // center: [121.393628, 31.170878], // starting position [lng, lat]
  center: [121.29734, 31.068249], // starting position [lng, lat]
  zoom: 12 // starting zoom 
});

map.touchZoomRotate.disableRotation();
window.map = map;
map.on('load', () => {
  // 注册image icon
  map.loadImage('./img/start.png', (error, image) => {
    if (error) throw error;
    if (!map.hasImage('startMarker')) {
      map.addImage('startMarker', image);
    }
  });
  /* map.loadImage(endMarker, (error, image) => {
    if (error) throw error;
    if (!map.hasImage('endMarker')) {
      map.addImage('endMarker', image);
    }
  }); */
  map.loadImage('./img/car.png', (error, image) => {
    if (error) throw error;
    if (!map.hasImage('carMarker')) {
      map.addImage('carMarker', image);
    }
  });

  // 轨迹箭头
  const svgXML = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"> 
                <path d="M529.6128 512L239.9232 222.4128 384.7168 77.5168 819.2 512 384.7168 946.4832 239.9232 801.5872z" p-id="9085" fill="#ffffff"></path> 
            </svg>
            `;
  // 给图片对象写入base64编码的svg流
  const svgBase64 = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXML)));
  const arrowIcon = new Image(20, 20);
  arrowIcon.src = svgBase64;
  arrowIcon.onload = function () {
    map.addImage('arrowIcon', arrowIcon);
  };

  initTrack();
  bindClick();

  receiveFromServer();
});

function receiveFromServer(){
  var ws = new WebSocket("ws://127.0.0.1:8082");

  ws.onopen = function (evt) {
    console.log("Connection open ...");
    ws.send("Hello WebSockets!");
  };

  ws.onmessage = (evt) => {
    console.log(evt.data);
    
    animate(JSON.parse(evt.data))

    // ws.close();
  };

  ws.onclose = function (evt) {
    console.log("Connection closed.");
  };
}

let showPopup = false,
  popup = null;
// 车辆行驶轨迹渲染入口函数
function initTrack() {
  rendererTrack().then(() => {
    // rendererStartStation();
    addAnimatePointSource();
  })
}

const rendererTrack = () => {
  return new Promise((resolve, reject) => {
    map.addSource('source-track', {
      type: 'geojson',
      data: trackGeojson,
    });
    map.addLayer({
      id: 'layer-track',
      type: 'line',
      source: 'source-track',
      paint: {
        // 'line-color': '#E68F0A',
        'line-color': 'green',
        'line-width': 8,
      },
    });
    map.addLayer({
      id: 'layer-arrow',
      type: 'symbol',
      source: 'source-track',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 40, // 图标间隔，默认为250
        'icon-image': 'arrowIcon', // 箭头图标
        'icon-size': 0.5
      }
    });
    resolve();
  });
};
// 添加动态点图层
const addAnimatePointSource = () => {
  map.addSource('source-carPosition', {
    type: 'geojson',
    data: animatePointGeoJson,
  });
  map.addSource('source-predictionPosition', {
    type: 'geojson',
    data: predictionGeoJson,
  });
  map.addLayer({
    id: 'layer-carPosition',
    type: 'symbol',
    source: 'source-carPosition',
    layout: {
      'icon-image': 'carMarker',
      'icon-size': 0.2,
      'icon-rotate': ['get', 'bearing'],
      'icon-rotation-alignment': 'map',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    }
  });
  map.addLayer({
    id: 'layer-predictionPosition',
    type: 'symbol',
    source: 'source-predictionPosition',
    layout: {
      'icon-image': 'startMarker',
      'icon-size': 0.2,
      'icon-rotate': ['get', 'bearing'],
      'icon-rotation-alignment': 'map',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true
    }
  });
  map.addSource('source-carBuffer', {
    type: 'geojson',
    data: bufferGeojson,
  });
  map.addLayer({
    'id': 'layer-carBuffer',
    'type': 'fill',
    'source': 'source-carBuffer', // reference the data source
    'layout': {},
    'paint': {
      'fill-color': '#38c2f5',
      'fill-opacity': 0.5
    }
  });
};

const animate = (data) => {
  const {spoofingFlag,
    predictionLongitude,
    predictionLatitude,
    radius,
    speed,
    Utc_timeStamp,
    receiverLongitude,
    receiverLatitude} = data

  if (Object.keys(trackGeojson) == 0) return;
  if (!map || !map.getSource('source-track')) return;
  if (!map || !map.getSource('source-carPosition')) return;
  if (!map || !map.getSource('source-predictionPosition')) return;
  if (!map || !map.getSource('source-carBuffer')) return;
  refreshLineChart()
  setSpeed(speed);
  const currentPnt = [receiverLongitude,receiverLatitude];
  const buffered = turf.buffer(turf.point(currentPnt), radius, { units: 'kilometers' });
  const predictionPnt = [predictionLongitude,predictionLatitude]
  var distance = turf.distance(predictionPnt, currentPnt, { units: 'kilometers' });

  chartData.push([moment(Utc_timeStamp).format("YYYY-MM-DD hh:mm:ss"), distance * 1000])
  // end 
  animatePointGeoJson.features[0].properties.bearing = turf.bearing(
    turf.point(currentPnt),
    turf.point(predictionPnt)
  ) + 90;
  animatePointGeoJson.features[0].geometry.coordinates = currentPnt;
  predictionGeoJson.features[0].geometry.coordinates = predictionPnt;
  const trackCopy = JSON.parse(JSON.stringify(trackGeojson));
  trackCopy.features[0].geometry.coordinates.push(currentPnt); // 不管如何都按正确行使的轨迹进行展示
  trackGeojson = deepCopy(trackCopy);
  map.getSource('source-carPosition').setData(animatePointGeoJson);
  map.getSource('source-predictionPosition').setData(predictionGeoJson);
  map.getSource('source-carBuffer').setData(buffered);
  if (spoofingFlag) {
    map.setPaintProperty('layer-carBuffer', 'fill-color', '#38c2f5')
  } else {
    map.setPaintProperty('layer-carBuffer', 'fill-color', '#de3434')
  }
  map.getSource('source-track').setData(trackCopy);

  popup && popup.remove();
  if (showPopup) {
    const {
      address, driver, plateNo, temp, speed,
    } = {};
    popup = new mapboxgl.Popup({
      offset: 30, className: 'car-popup', closeOnClick: false, closeButton: false, maxWidth: 400,
    }).setLngLat(endPnt)
      .setHTML(`
              <div class='item'><div class='item-k'>车型: </div><div class='item-v'>大卡车</div></div>
              <div class='item'><div class='item-k'>车牌: </div><div class='item-v'>沪AAAAA</div></div>
              <div class='item'><div class='item-k'>车速: </div><div class='item-v'>64km/h</div></div>
              <div class='item'><div class='item-k'>车驾号: </div><div class='item-v'>A00001</div></div>`)
      .addTo(map);
  }
};

const rendererStartStation = () => {
  map.addSource('source-startStation', {
    type: 'geojson',
    data: startStationGeojson,
  });
  // add video icon
  map.addLayer({
    id: 'layer-startStation',
    type: 'symbol',
    source: 'source-startStation',
    layout: {
      'icon-image': 'startMarker',
      'icon-allow-overlap': true,
      'icon-size': 0.3,
    },
  });
};

// 清除地图上的要素
const clearMap = () => {
  if (!map) return;
  if (map.getLayer('layer-track')) {
    map.removeLayer('layer-track');
  }
  if (map.getLayer('layer-arrow')) {
    map.removeLayer('layer-arrow');
  }
  if (map.getLayer('layer-startStation')) {
    map.removeLayer('layer-startStation');
  }
  if (map.getLayer('layer-carBuffer')) {
    map.removeLayer('layer-carBuffer');
  }
  if (map.getLayer('layer-carPosition')) {
    map.removeLayer('layer-carPosition');
  }
  if (map.getLayer('layer-predictionPosition')) {
    map.removeLayer('layer-predictionPosition');
  }
  if (map.getSource('source-track')) {
    map.removeSource('source-track');
  }
  if (map.getSource('source-startStation')) {
    map.removeSource('source-startStation');
  }
  if (map.getSource('source-carBuffer')) {
    map.removeSource('source-carBuffer');
  }
  if (map.getSource('source-carPosition')) {
    map.removeSource('source-carPosition');
  }
  if (map.getSource('source-predictionPosition')) {
    map.removeSource('source-predictionPosition');
  }
};

// 绑定点击事件，开关车辆信息
function bindClick() {
  map.on('click', 'layer-carPosition', (e) => {
    showPopup = !showPopup;
  });
};

// map end.

//速度表
var myChart = echarts.init(document.getElementById("odometer"));
var app = {};

var option = {
  series: [
    {
      type: 'gauge',
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        distance: -15,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -10,
        length: 10,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'auto',
        distance: 20,
        fontSize: 15
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} km/h',
        fontSize: 15,
        color: 'auto'
      },
      data: [
        {
          value: 70
        }
      ]
    }
  ]
};
function setSpeed(data){
  myChart.setOption({
    series: [
      {
        data: [
          {
            value: data
          }
        ]
      }
    ]
  });
}

option && myChart.setOption(option);


//折线图
var lineChart = echarts.init(document.getElementById("chart"));
// var chartData = [["10:23:00", 175], ["10:23:20", 293], ["10:23:40", 326], ["10:24:00", 153], ["10:24:08", 73], ["10:25:00", 267], ["10:26:00", 183]]
var chartData = [];

refreshLineChart();

function refreshLineChart() {
  lineChart.setOption({
    title: {
      text: '实时位置监测',
      left: '1%'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%'
    },
    xAxis: {
      data: chartData.map(function (item) {
        return item[0];
      })
    },
    yAxis: {},
    toolbox: {
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    // dataZoom: [
    //   {
    //     startValue: '2014-06-01'
    //   },
    //   {
    //     type: 'inside'
    //   }
    // ],
    visualMap: {
      top: 50,
      right: 10,
      pieces: [
        {
          gt: 0,
          lte: 400,
          color: '#38c2f5'
        },
        {
          gt: 400,
          color: '#de3434'
        }
      ],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      name: '距离',
      type: 'line',
      data: chartData.map(function (item) {
        return item[1];
      }),
      markLine: {
        silent: true,
        lineStyle: {
          color: '#333'
        },
        data: [
          {
            yAxis: 400
          }
        ]
      }
    }
  }
  );
}

