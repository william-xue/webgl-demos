$(function () {
  
  $.get('./test.json', (result) => {
    result.features.map(f=>{
      if(f.properties.coordinates.trim() !== ''){
        let coors = f.properties.coordinates.split(';')
        let coorArr = []
        coors.forEach(element => {
          coorArr.push(element.split(',').map(Number))
        });
        f.geometry.coordinates.push(coorArr)
        f.properties.coordinates = ''; // 置空
      }
    })
    
    console.log(result);
    // 自动下载
    downGeojson(result);
  })


  function downGeojson(result) {
    var blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json,charset=utf-8;' });
    let fileName = new Date().getTime() + ".json";
    //IE浏览器使用msSaveBlob
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
    } else {
        var aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
    }
}
})