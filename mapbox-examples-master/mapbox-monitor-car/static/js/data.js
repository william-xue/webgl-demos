let trackGeojson = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
      "properties": {
      },
      "geometry": {
        "coordinates": [],
        "type": "LineString"
      }
  }],
}
let realTrackGeojson = {
  "features": [
    {
      "geometry": {
        "coordinates": [
          [
            121.29734,
            31.068249
          ],
          [
            121.295265,
            31.084618
          ],
          [
            121.29438,
            31.095419
          ],
          [
            121.295425,
            31.107334
          ],
          [
            121.299,
            31.122557
          ],
          [
            121.299995,
            31.131025
          ],
          [
            121.29982,
            31.13771
          ],
          [
            121.291435,
            31.147661
          ],
          [
            121.28585,
            31.155392
          ],
          [
            121.28158,
            31.16137
          ],
          [
            121.27566,
            31.172861
          ],
          [
            121.27219,
            31.183712
          ],
          [
            121.2571,
            31.204071
          ],
          [
            121.25754,
            31.208414
          ],
          [
            121.255714,
            31.210907
          ],
          [
            121.243225,
            31.224997
          ],
          [
            121.243225,
            31.224997
          ],
          [
            121.23708,
            31.237469
          ],
          [
            121.23803,
            31.251764
          ],
          [
            121.23882,
            31.266531
          ],
          [
            121.239746,
            31.268156
          ],
          [
            121.24202,
            31.276587
          ],
          [
            121.246,
            31.287638
          ],
          [
            121.24884,
            31.299234
          ],
          [
            121.24884,
            31.299234
          ],
          [
            121.251114,
            31.31602
          ],
          [
            121.251114,
            31.31602
          ],
          [
            121.267136,
            31.31912
          ],
          [
            121.26655,
            31.31845
          ],
          [
            121.28777,
            31.318117
          ],
          [
            121.30947,
            31.32155
          ],
          [
            121.30947,
            31.32155
          ],
          [
            121.315155,
            31.331635
          ],
          [
            121.3176,
            31.331501
          ],
          [
            121.321594,
            31.332947
          ],
          [
            121.34415,
            31.334364
          ],
          [
            121.35233,
            31.334284
          ],
          [
            121.35233,
            31.334284
          ],
          [
            121.35637,
            31.333696
          ],
          [
            121.35637,
            31.333696
          ],
          [
            121.35637,
            31.333696
          ],
          [
            121.35637,
            31.333696
          ],
          [
            121.367004,
            31.337786
          ],
          [
            121.3731,
            31.339537
          ],
          [
            121.38664,
            31.346867
          ],
          [
            121.39412,
            31.348549
          ],
          [
            121.404495,
            31.351294
          ],
          [
            121.41257,
            31.353132
          ],
          [
            121.42766,
            31.356113
          ],
          [
            121.43068,
            31.35761
          ],
          [
            121.43781,
            31.359854
          ],
          [
            121.43781,
            31.359854
          ],
          [
            121.44934,
            31.36346
          ],
          [
            121.456055,
            31.36213
          ],
          [
            121.456055,
            31.36213
          ],
          [
            121.455475,
            31.355534
          ],
          [
            121.455475,
            31.355534
          ],
          [
            121.456055,
            31.36213
          ],
          [
            121.455475,
            31.355534
          ]
        ],
        "type": "LineString"
      },
      "type": "Feature",
      "properties": {

      }
    }
  ],
  "type": "FeatureCollection"
};

let startStationGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [ 121.29734, 31.068249]
      }
    }
  ],
};

let animatePointGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: []
    }
  }]
};

// 预报点
let predictionGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: []
    }
  }]
};

let bufferGeojson = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
      "properties": {
      },
      "geometry": {
        "coordinates": [[]],
        "type": "Polygon"
      }
  }]
}

let CarData = {
  trackGeojson,
  startStationGeojson,
  animatePointGeoJson,
  predictionGeoJson,
  bufferGeojson
}