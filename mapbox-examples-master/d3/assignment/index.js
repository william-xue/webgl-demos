/**
 * 描述:  d3 绘制地图
 * 作者:  xx 
 * 日期:  20221207
**/

//获取svg
var width = document.getElementsByClassName('left')[0].offsetWidth,
  height = document.getElementsByClassName('left')[0].offsetHeight;

var svg = d3.select('.left').append('svg').attr('width', width).attr('height', height);

//创建区域分组
var g = svg.append('g').attr('transform', 'translate(0,0)');

//创建一个地图投影
var mercator = d3.geoMercator()
  .center([107, 36])//设置投影的中心点 经纬度
  .scale(800)//设置缩放因子
  .translate([width / 2, height / 2]);//设置平移偏移量

//创建一个地理路径生成器
var geoPath = d3.geoPath()
  .projection(mercator)//设置地理路径生成器的投影方式

//获取中国地图的json文件
//利用node.js 在本地起一个http-server
d3.json('./china.json').then(function (data) {//D3 v5版本d3.json()现在将返回一个你可以在.then()方法中处理的Promise
  console.log(data);//features

  //新建一个颜色比例尺
  var scaleColor = d3.scaleOrdinal()
    .domain(d3.range(data.features.length))
    .range(d3.schemeCategory10);

  //绘制区域
  g.append('g')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('stroke', 'gray')
    .attr('strok-width', 1)
    .attr('d', function (d, i) {
      return geoPath(d);
    })
    // .attr('fill', 'none')
    .attr('fill', function (d, i) {
      return scaleColor(i);
    })
    .on('mouseover', function (d, i) {
      d3.select(this).attr('fill', 'yellow');
    })
    .on('mouseout', function (d, i) {
      d3.select(this).attr('fill', scaleColor(i));
    });

  //绘制文字
  g.append('g')
    .selectAll('text')
    .data(data.features)
    .enter()
    .append('text')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('x', function (d, i) {
      var position = mercator(d.properties.centroid || [0, 0]);
      return position[0];
    })
    .attr('y', function (d, i) {
      var position = mercator(d.properties.centroid || [0, 0]);
      return position[1];
    })
    .attr('dy', function (d, i) {
      //这里为什么这么写呢，因为澳门和香港重合了，挤到一起了。
      if (d.properties.name === '澳门特别行政区') {
        return 10;
      }
    })
    .text(function (d, i) {
      return d.properties.name;
    });

  // 绘制散点
  d3.csv('./attractions.csv').then(data => {
    console.log(22, data)
    svg.append("g")   //将所有的circle添加到g元素中，并设置id以后方便引用
      .attr("id", "circles")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        var position = mercator([d.longitude, d.latitude] || [0, 0]);
        // console.log(position)
        return position[0];
      })
      .attr("cy", function (d) {
        var position = mercator([d.longitude, d.latitude] || [0, 0]);
        // console.log(position)
        return position[1];
      })
      .attr("r", function (d) {
        return 4;
      })
      .attr("fill", 'red')
      // .on('click',function(d,i){
      //     console.log(d,i)
      // });
      .on('click', function (d, i) {
        console.log('over');
        var x = d.pageX;
        var y = d.pageY;
        const {
          attractions,
          city,
          dress,
          latitude,
          level,
          longitude
        } = d.target.__data__;
        d3.select("#tooltip").remove();
        // var item = d.target.__data__;
        d3.select('svg').append("text")
          .attr("id", "tooltip")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-setif")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .attr("fill", "blue")
          .text(attractions)
      })
  })

  svg.append("g")
    .attr("transform", "translate(" + (width / 2 - 180) + "," + 80 + ")")
    .append("text")
    .text("map title")
    .attr("class", "title")
    .attr("font-size","20")
    .attr("fill","#555")
});


/**
 * 描述:  d3 绘制横向柱状图
 * 作者:  xx 
 * 日期:  20221207
**/

// 柱状图
d3.csv('./amount.csv', function (csvdata) {
  return csvdata;
}).then(function (dataset) {
  console.log(dataset);

  var datasetSort = dataset.sort(function (a, b) {
    return b.count - a.count;
  })
  
  dataset = datasetSort.slice(0,10)
  console.log(dataset, datasetSort);

  const width = document.getElementsByClassName('top')[0].offsetWidth;
  const height = document.getElementsByClassName('top')[0].offsetHeight;
  const paddingTop = 30;
  const paddingBottom = 30;
  const paddingLeft = 140;
  const paddingRight = 24;
  const rectWidth = 10;
  const decoRectWidth = 2;
  const delay = 0;
  const duration = 2000;
  const max = Math.max(...dataset.map((item) => item.count));

  console.log('max===', max)
  const xData = dataset.map((item) => item.city); // 对接数据时根据name名创建

  /****************************** 比例尺 ***************************************/
  const yScale = d3.scaleBand()
    .domain(xData)
    .rangeRound([height - paddingTop - paddingBottom, 0])
  const xScale = d3.scaleLinear()
    .domain([0, max * 1.1])
    .range([0, width - paddingLeft - paddingRight]);

  // 绘制
  const svg = d3.select('.right .top').append('svg')
    .attr('width', width)
    .attr('height', height);
  // 坐标轴
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickPadding(12)
  const yAxis = d3.axisLeft(yScale)
    .ticks(5)
    .tickPadding(8)
  // .tickFormat(d3.format('d'));
  // ***************坐标轴***************
  svg.append('g')
    .attr('class', 'r-xAxis')
    .attr('transform', `translate(${paddingLeft},${height - paddingBottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'r-yAxis')
    .attr('transform', `translate(${paddingLeft},${paddingTop})`)
    .call(yAxis);
  // 添加横向网格线
  svg.selectAll('.r-xAxis .tick')
    .append('line')
    .attr('class', 'column-grid')
    .attr('x1', 0)
    // .attr('x2', width - paddingLeft - paddingRight)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', -(height - paddingBottom - paddingTop));

  // // ***************矩形图******************
  // yScale.range([0, height - paddingTop - paddingBottom]);
  xScale.range([0, width - paddingLeft - paddingRight]);

  const rectGroup = svg.selectAll('.rectItem')
    .data(dataset)
    .enter()
    .append('g')
    .attr('class', 'rectItem');

  rectGroup.append('rect')
    .attr('width', 0)
    .attr('height', rectWidth)
    .attr('x', paddingLeft)
    .attr('fill', '#30d47287')
    .attr('transform', `translate(0 ,${paddingTop})`)
    .attr('y', (d) => {
      return yScale(d.city) + ((yScale.bandwidth() - rectWidth) / 2)
    })
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('width', (d) => xScale(d.count))
  // .attr('x', (d) => paddingLeft + xScale(d.value));

  // 中间装饰矩形
  // rectGroup.append('rect')
  //   .attr('width', decoRectWidth)
  //   .attr('height', 0)
  //   .attr('y', height - paddingTop - paddingBottom)
  //   .attr('fill', '#30ca6e')
  //   .attr('opacity', 0.6)
  //   .attr('transform', `translate(${paddingLeft},${paddingTop})`)
  //   .attr('x', (d) => xScale(d.name) + ((xScale.bandwidth() - decoRectWidth) / 2))
  //   .transition()
  //   .delay(delay)
  //   .duration(duration)
  //   .attr('height', (d) => yScale(d.value))
  //   .attr('y', (d) => height - paddingTop - paddingBottom - yScale(d.value));
  // 上方装饰矩形
  // rectGroup.append('rect')
  //   .attr('width', rectWidth)
  //   .attr('height', 2)
  //   .attr('y', height - paddingTop - paddingBottom - 4)
  //   .attr('fill', '#32dd77')
  //   .attr('transform', `translate(${paddingLeft},${paddingTop})`)
  //   .attr('x', (d) => xScale(d.name) + ((xScale.bandwidth() - rectWidth) / 2))
  //   .transition()
  //   .delay(delay)
  //   .duration(duration)
  //   .attr('y', (d) => height - paddingTop - paddingBottom - yScale(d.value));

  rectGroup.append('text')
    .text((d) => d.count)
    .attr('x', paddingLeft)
    .attr('class', 'valueDes')
    .attr('transform', `translate(20, 0)`)
    .attr('y', (d) => yScale(d.city) + yScale.bandwidth() + paddingTop)
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x', (d) => paddingLeft + xScale(d.count));

  const xyLine = svg.append('g')
    .attr('class', 'lineGroup');
  // x
  xyLine.append('line')
    .attr('class', 'xyLine')
    .attr('x1', paddingLeft - 1)
    .attr('x2', width - paddingRight)
    .attr('y1', height - paddingBottom)
    .attr('y2', height - paddingBottom);
  // y
  xyLine.append('line')
    .attr('class', 'xyLine')
    .attr('x1', paddingLeft)
    .attr('x2', paddingLeft)
    .attr('y1', paddingTop)
    .attr('y2', (height - paddingBottom) + 1);

  svg.append("g")
    .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
    .append("text").text("Top population states in india")
    .attr("class", "title")

})


/**
 * 描述:  d3 绘制饼状图
 * 作者:  xx 
 * 日期:  20221207
**/

// 饼状图
d3.csv('./pieData.csv', function (csvdata) {
  return csvdata;
}).then(function (data) {
  var width = document.getElementsByClassName('bottom')[0].offsetWidth,
    height = document.getElementsByClassName('bottom')[0].offsetHeight,
    radius = Math.min(width, height) / 2 - 20;
    console.log(width, height);

  var svg = d3.select(".bottom").append('svg')
    .attr('width', width-10)
    .attr('height', height-10);
    
  var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  var color = d3.scaleOrdinal([
    'gray', 'green', 'pink', 'orange', 'yellow', 'red', 'purple'
  ]);

  var path = d3.arc()
    .outerRadius(radius - 10).innerRadius(0);
  var label = d3.arc()
    .outerRadius(radius).innerRadius(radius - 80);

  var pie = d3.pie().value(function (d) {
    // console.log(d);
    return d.percent;
  });

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arc.append("path")
    .attr("d", path)
    .attr("fill", function (d) { return color(d.data.states); });

  console.log(arc)
  arc.append("text").attr("transform", function (d) {
    return "translate(" + label.centroid(d) + ")";
  })
    .text(function (d) { return d.data.states; });
    
  svg.append("g")
    .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
    .append("text").text("Top population states in india")
    .attr("class", "title")

})