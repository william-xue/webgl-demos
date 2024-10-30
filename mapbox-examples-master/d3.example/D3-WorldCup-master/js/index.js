/*数据区*/
var worldjson;
var matches;
var cups;
var ranks;
var currentYear;
var selectedCountry = [];
var pieChartData = [0, 0, 0, 0, 0, 0];
var areaChartData;

/* 有效年份 */
var years = [];
for(var i = 1930; i < 2015; i += 4) {
	if(i !== 1942 && i !== 1946) {
		years.push(i);
	};
}

/*地图区*/
var width = d3.select('#map').node().getBoundingClientRect().width,
	height = d3.select('#map').node().getBoundingClientRect().height;
var svg = d3.select("#map")
	.append("svg")
	.attr("width", width)
	.attr("height", height);
var worldMap = svg.append("g");
var projection = d3.geoMercator()
	.scale(140)
	.translate([width / 2, height / 2]);
var path = d3.geoPath()
	.projection(projection);
var zoom = d3.zoom()
	.scaleExtent([1, 8])
	.translateExtent([
		[0, 0],
		[width, height]
	])
	.on("zoom", function() {
		worldMap.attr("transform", d3.event.transform);
		d3.select("#map-zoomer").node().value = d3.event.transform.k;
	});
svg.call(zoom);

/*图表区*/
var type = 0; // 0表示pie，1表示bar
var pieBarChart = null;
var areaChart = null;
var bubbleChart = null;
var radarChart = null;

/*控件区*/
/*播放按钮*/
var playBtn = d3.select("#play-group").append("button")
	.attr("class", "btn btn-primary")
	.html('<span class="oi oi-media-play"></span>');
/*年份按钮*/
var yearBtns = d3.select("#button-group").selectAll("button")
	.data(years)
	.enter()
	.append("button")
	.attr("class", "btn btn-primary")
	.attr("id", function(d) {
		return "btn-year-" + d;
	})
	.text(function(d) {
		return d;
	});

/* 地图缩放控件事件绑定 */
d3.select('#zoom-in').on('click', function() {
	zoom.scaleBy(svg.transition(), 1.2);
});
d3.select('#zoom-out').on('click', function() {
	zoom.scaleBy(svg.transition(), 1 / 1.2);
});
d3.select('#reset').on('click', function() {
	x = d3.zoomIdentity.translate(0, 0).scale(1);
	zoom.transform(svg.transition(), x);
});
d3.select('#map-zoomer').on("change", function() {
	zoom.scaleTo(svg, +this.value);
});

/* 回到顶部按钮事件绑定 */
window.onscroll = function() {
	scrollFunction()
};

d3.json("./data/world.geo110_all.json", function(w) {
	// 读取GeoJson
	worldjson = w;
	// 绘制地图
	drawMap();
	d3.csv("./data/WorldCups.csv", function(c) {
		// 读取世界杯数据
		cups = c;
		d3.csv("./data/WorldCupMatches.csv", function(m) {
			// 读取比赛数据
			matches = m;
			d3.csv("./data/WorldCupRank.csv", function(r) {
				// 读取排名数据
				ranks = r;
				// 更新2014年图表
				update(2014);

				// 绑定按钮条事件
				var year_interval;
				yearBtns.on("click", function(d) {
					update(d);
					clearInterval(year_interval);
				});
				playBtn.on("click", function() {
					var year_idx = 0;
					year_interval = setInterval(function() {
						update(years[year_idx]);
						year_idx++;
						if(year_idx >= years.length) {
							clearInterval(year_interval);

						}
					}, 1000);
				})
			})

		})
	})
});

/* 绘制地图 */
function drawMap() {
	worldMap.selectAll("path")
		.data(worldjson.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("id", function(d) {
			return "map-country-" + d.properties.name
		});
}

/* 更新图表 */
function update(year) {
	// 设置当前年份，初始化被选中国家
	currentYear = year;
	selectedCountry = [];

	// 筛选这一年世界杯数据
	var currentCup = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.entries(cups)
		.filter(function(d) {
			return d['key'] == currentYear;
		})[0].values[0];

	// 年份聚合回调函数
	function aggYear(leaves) {
		var teams = d3.set();
		leaves.forEach(function(d) {
			teams.add(d['Home Team Name']);
			teams.add(d['Away Team Name']);
		});
		return {
			'teams': teams.values()
		}
	}

	// 获取这一年世界杯参赛队伍数据
	var currentTeams = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.rollup(aggYear)
		.entries(matches).filter(function(d) {
			return d['key'] == year;
		})[0].value['teams'];

	// 绘制东道主图表
	var homeCenter = getCenterOf(d3.select("[id='map-country-" + currentCup.Country + "']"));
	d3.selectAll('#world-cup-home').remove();
	worldMap.append('svg:foreignObject')
		.attr('x', homeCenter[0] - 5)
		.attr('y', homeCenter[1] - 5)
		.attr('id', 'world-cup-home')
		.html('<span class="oi oi-home" style="color:red"></span>')
		.style("pointer-events", "none");

	/*	绘制前三名，但因为Path中心不完全正确弃用
	var firstCenter = getCenterOf(d3.select("[id='map-country-"+currentCup.Winner+"']"));
	var secondCenter = getCenterOf(d3.select("[id='map-country-"+currentCup.RunnersUp+"']"));
	var thirdCenter = getCenterOf(d3.select("[id='map-country-"+currentCup.Third+"']"));
    
	worldMap.append('svg:foreignObject')
	.attr('x',firstCenter[0]-5)
	.attr('y',firstCenter[1]-5)
	.html('<span class="oi oi-badge" style="color:gold"></span>')
	;
    
	worldMap.append('svg:foreignObject')
	.attr('x',secondCenter[0])
	.attr('y',secondCenter[1])
	.html('<span class="oi oi-badge" style="color:#E6E8FA"></span>')
	;
    
	worldMap.append('svg:foreignObject')
	.attr('x',thirdCenter[0])
	.attr('y',thirdCenter[1])
	.html('<span class="oi oi-badge" style="color:#8C7853"></span>')
	;
	*/
	// 颜色修改回调函数
	function colorOfCountry(d) {
		if(d.properties.name == currentCup.Winner) {
			return 'gold';
		} else if(d.properties.name == currentCup.RunnersUp) {
			return '#E6E8FA';
		} else if(d.properties.name == currentCup.Third) {
			return '#8C7853';
		} else if(d.properties.name == currentCup.Country) {
			return 'red';
		} else if(currentTeams.indexOf(d.properties.name) != -1) {
			return 'steelBlue';
		} else {
			return 'lightgrey';
		}
	}

	// 修改颜色
	worldMap.selectAll('path')
		.attr("class", null)
		.transition()
		.duration(750)
		.style('fill', colorOfCountry);

	// 选中前三名国家并修改轮廓
	selectedCountry.push(currentCup.Winner);
	d3.select("[id='map-country-" + currentCup.Winner + "']").attr("class", "selected");
	selectedCountry.push(currentCup.RunnersUp);
	d3.select("[id='map-country-" + currentCup.RunnersUp + "']").attr("class", "selected");
	selectedCountry.push(currentCup.Third);
	d3.select("[id='map-country-" + currentCup.Third + "']").attr("class", "selected");

	// 鼠标移入生成的提示
	var tipFactory = d3scription(function(d) {
		var index = currentTeams.indexOf(d.properties.name);
		if(index != -1) {
			var row;
			for(var i = 0; i < ranks.length; i++) {
				if(ranks[i]['Team'] == d.properties.name) {
					row = ranks[i];
					break;
				}
			}
			var head = "<tr><th>" + "<img src='http://www.countryflags.io/" + d.properties.iso_a2 + "/flat/32.png'>" + d.properties.name + "</th></tr>";
			var best = "<tr><td>Best Finish</td><td>" + row['Best'] + "</td></tr>";
			var rank = "<tr><td>Rank</td><td>" + row['Pos'] + "</td></tr>";
			return "<table>" + head + best + rank + "</table>";
		}
		return "";
	});
	var tip = tipFactory()
		.element(worldMap);

	// 设置点选、移入移出交互
	worldMap.selectAll('path')
		.on("click", function(d) {
			if(currentTeams.indexOf(d.properties.name) != -1) {
				var index = selectedCountry.indexOf(d.properties.name)
				if(index == -1) {
					if(selectedCountry.length >= 6) return;
					selectedCountry.push(d.properties.name);
					d3.select("[id='map-country-" + d.properties.name + "']").attr("class", "selected");

					drawRadarChart();
					drawHeatMap();
				} else {
					selectedCountry.splice(index, 1);
					d3.select("[id='map-country-" + d.properties.name + "']").attr("class", null);
					drawRadarChart();
					drawHeatMap();
				}
			}
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// 修改按钮状态
	yearBtns.attr("class", "btn btn-primary");
	d3.select("#btn-year-" + year)
		.attr("class", "btn btn-warning");

	// 重新绘制所有图表
	drawPieBarChart();
	drawAreaChart();
	drawBubbleChart();
	drawRadarChart();
	drawHeatMap();
}

/* 获取地图中心坐标 */
function getCenterOf(selection) {
	var bounds = path.bounds(selection.datum());
	var dx = (bounds[0][0] + bounds[1][0]) / 2;
	var dy = (bounds[0][1] + bounds[1][1]) / 2;
	return [dx, dy];
}

/* 饼图/条形图绘制 */
function drawPieBarChart() {
	// 按年聚合比赛队伍回调函数
	function aggYear(leaves) {
		var teams = d3.set();
		leaves.forEach(function(d) {
			teams.add(d['Home Team Name']);
			teams.add(d['Away Team Name']);
		});
		return {
			'teams': teams.values()
		}
	}
	// 参赛队伍按年聚合
	var teamsByYear = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.rollup(aggYear)
		.entries(matches)
		.filter(function(d) {
			return d['key'] == currentYear;
		})[0].value['teams'];

	// 把队伍分配到各个大洲
	var pieChartData = [
		["North America", 0],
		["South America", 0],
		["Asia", 0],
		["Africa", 0],
		["Europe", 0],
		["Oceania", 0]
	];
	worldMap.selectAll('path')
		.filter(function(d) {
			if(teamsByYear.indexOf(d.properties.name) != -1) {
				switch(d.properties.continent) {
					case "North America":
						pieChartData[0][1]++;
						break;
					case "South America":
						pieChartData[1][1]++;
						break;
					case "Asia":
						pieChartData[2][1]++;
						break;
					case "Africa":
						pieChartData[3][1]++;
						break;
					case "Europe":
						pieChartData[4][1]++;
						break;
					case "Oceania":
						pieChartData[5][1]++;
						break;
				}
			}
		});

	// 绘制饼图/条形图
	if(pieBarChart == null) {
		pieBarChart = bb.generate({
			data: {
				columns: pieChartData,
				type: "pie",
				labels: true
			},
			title: {
				text: currentYear + " Continent of Countries(click here to change chart TYPE)",
				padding: {
					top: 10,
					right: 10,
					bottom: 10,
					left: 10
				}
			},
			size: {
				height: 500,
				width: 500
			},
			axis: {
				x: {
					tick: {
						format: function(index, categoryName) {
							return categoryName;
						}
					}
				}
			},
			tooltip: {
				format: {
					value: function(value, ratio, id) {
						return value;
					}
				}

			},
			bindto: {
				element: "#PieChart",
				classname: "bb piechart"
			}
		});
		// 绑定变换类型事件到标题
		d3.select(".piechart").select(".bb-title").on("click", function() {
			if(type == 0) {
				pieBarChart.transform("bar");
				pieBarChart.legend.show();
				type = 1;
			} else {
				pieBarChart.transform("pie");
				pieBarChart.legend.show();
				type = 0;
			}
		});
	} else {
		// 重载并修改标题
		pieBarChart.load({
			columns: pieChartData
		});
		d3.select(".piechart").select(".bb-title").text(currentYear + " Continent of Countries(click here to change chart TYPE)")
	}

}

function drawAreaChart() {
	// 按年分组世界杯数据
	var cupsByYear = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.entries(cups);

	// 按年聚合主客场参与数
	function aggYear(leaves) {
		var homeAtt = 0.0;
		var awayAtt = 0.0;

		leaves.forEach(function(d) {
			var homeCountry = cupsByYear.filter(function(dd) {
				return dd['key'] == d['Year'];
			})[0].values[0].Country;
			var att = +d['Attendance'];
			if(d['Home Team Name'] == homeCountry || d['Away Team Name'] == homeCountry) {

				homeAtt = homeAtt + att;
			} else {
				awayAtt = awayAtt + att;
			}
		});

		return {
			'homeAtt': homeAtt,
			'awayAtt': awayAtt
		}
	}
	var attByYear = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.rollup(aggYear)
		.entries(matches);

	// 将数据分配到主客场
	var areaChartData = [
		['HomeAttendance'],
		['AwayAttendance']
	];
	for(var i = 0; i <= years.indexOf(currentYear); i++) {
		// 无效年份使用空数据
		if(i == 3) {
			areaChartData[0].push(null);
			areaChartData[0].push(null);
			areaChartData[1].push(null);
			areaChartData[1].push(null);
		}
		areaChartData[0].push(attByYear[i].value.homeAtt);
		areaChartData[1].push(attByYear[i].value.awayAtt);
	}

	// 坐标轴数据
	var years_all = [];
	for(var i = 1930; i < 2015; i += 4) {
		years_all.push(i);
	}
	// 绘制面积图
	if(areaChart == null) {
		areaChart = bb.generate({
			data: {
				columns: areaChartData,
				types: {
					HomeAttendance: "area-spline",
					AwayAttendance: "area-spline"
				}
			},
			title: {
				text: currentYear + " Attandance of Home and Away Country",
				padding: {
					top: 10,
					right: 10,
					bottom: 10,
					left: 10
				}
			},
			size: {
				height: 500,
				width: 960
			},

			axis: {
				x: {
					type: "category",
					categories: years_all,
					label: "Year"
				},
				y: {
					label: "People"
				}

			},
			groups: [
				[
					"HomeAttendance",
					"AwayAttendance"
				]
			],
			bindto: {
				element: "#AreaChart",
				classname: "bb areachart"
			}
		});
	} else {
		// 重载并修改标题
		areaChart.load({
			columns: areaChartData
		});
		d3.select("#AreaChart").select(".bb-title").text(currentYear + " Attandance of Home and Away Country");
	}

}

function drawBubbleChart() {
	// 聚合一个国家主客场比赛数据
	function aggrByHome(leaves) {
		var matches = leaves.length;
		var wins = d3.sum(leaves, function(d) {
			if((+d['Home Team Goals']) > (+d['Away Team Goals'])) return 1;
			else return 0;
		});
		var goals = d3.sum(leaves, function(d) {
			return d['Home Team Goals'];
		});
		return [matches, wins, goals];
	}

	function aggrByAway(leaves) {
		var matches = leaves.length;
		var wins = d3.sum(leaves, function(d) {
			if((+d['Home Team Goals']) < (+d['Away Team Goals'])) return 1;
			else return 0;
		});
		var goals = d3.sum(leaves, function(d) {
			return d['Away Team Goals'];
		});
		return [matches, wins, goals];
	}

	// 比赛按年分组
	var currentMatches = d3.nest()
		.key(keyByYear)
		.entries(matches)
		.filter(function(d) {
			return d['key'] == currentYear;
		})[0].values;

	// 比赛按国家分组
	var teamsByHome = d3.nest()
		.key(keyByHome)
		.sortKeys(d3.ascending)
		.rollup(aggrByHome)
		.entries(currentMatches);
	var teamsByAway = d3.nest()
		.key(keyByAway)
		.sortKeys(d3.ascending)
		.rollup(aggrByAway)
		.entries(currentMatches);

	// 比赛数据分配
	var teams = [];
	var teams_r = {};
	var teams_xs = {};
	teamsByHome.map(function(d) {
		teams.push([d.key + "_x"]);
		teams.push([d.key]);
		teams_xs[d.key] = d.key + "_x";
	})

	// 范围
	var min_x = 16,
		max_x = 0,
		max_r = 0,
		max_y = 0;
	var x_range = d3.set();
	var catagory = d3.set();
	for(var i = 0; i < teams.length / 2; i++) {
		teams[2 * i].push(teamsByHome[i].value[0] + teamsByAway[i].value[0]);
		if(teams[2 * i][1] > max_x) max_x = teams[2 * i][1];
		if(teams[2 * i][1] < min_x) min_x = teams[2 * i][1];
		teams[2 * i + 1].push(teamsByHome[i].value[1] + teamsByAway[i].value[1]);
		if(teams[2 * i + 1][1] > max_y) max_y = teams[2 * i + 1][1];
		catagory.add(teams[2 * i][1]);
		teams_r[teamsByHome[i].key] = (teamsByHome[i].value[2] + teamsByAway[i].value[2]);
		if(teams_r[teamsByHome[i].key] > max_r) max_r = teams_r[teamsByHome[i].key];
	}
	catagory = catagory.values().sort(function(a, b) {
		return a - b;
	});
	for(var i = 0; i < teams.length / 2; i++) {
		teams[2 * i][1] = catagory.indexOf("" + teams[2 * i][1]);
	}

	// 半径比例尺
	var scale = d3.scaleSqrt().range([0, 30]).domain([0, max_r]);

	// 绘制气泡图
	bubbleChart = bb.generate({
		data: {
			xs: teams_xs,
			columns: teams,
			type: 'scatter',
			label: true
		},
		// 自定义点半径大小
		point: {
			r: function(d) {
				return scale(teams_r[d.id]);
			}
		},
		title: {
			text: currentYear + " Matches Data",
			padding: {
				top: 10,
				right: 10,
				bottom: 10,
				left: 10
			}
		},
		size: {
			height: 500,
			width: 960
		},

		axis: {
			x: {
				min: -0.5,
				max: catagory.length - 0.5,
				tick: {
					format: function(x) {
						return catagory[x];
					}
				},
				label: "Matches"
			},
			y: {
				max: max_y + 1,
				label: "Wins"
			}
		},
		legend: {
			position: "right"
		},
		tooltip: {
			format: {
				title: function() {
					return "Goals";
				},
				name: function(name, ratio, id, index) {
					return id;
				},
				value: function(value, ratio, id) {
					return teams_r[id];
				}

			}

		},

		bindto: "#BubbleChart"
	});
	// 按年修改标题
	d3.select("#BubbleChart").select(".bb-title").text(currentYear + " Matches Data");
}

// 绘制雷达图
function drawRadarChart() {
	// 按年聚合
	function aggYear(leaves) {
		var teams = d3.set();
		leaves.forEach(function(d) {
			teams.add(d['Home Team Name']);
			teams.add(d['Away Team Name']);
		});
		return {
			'teams': teams.values()
		}
	}

	// 按年聚合队伍
	var teamsByYear = d3.nest()
		.key(keyByYear)
		.sortKeys(d3.ascending)
		.rollup(aggYear)
		.entries(matches)
		.filter(function(d) {
			return d['key'] == currentYear;
		})[0].value['teams'];

	// 按主场国家聚合数据
	function aggrByHome(leaves) {
		var played = 0;
		var wins = 0;
		var draws = 0;
		var losses = 0;
		var goals_for = 0;
		var goals_against = 0;

		leaves.forEach(function(d) {
			if(d['Year'] <= currentYear) {
				played++;
				if((+d['Home Team Goals']) > (+d['Away Team Goals'])) {
					wins++;
				} else if((+d['Home Team Goals']) < (+d['Away Team Goals'])) {
					losses++;
				} else {
					draws++;
				}
				goals_for = goals_for + (+d['Home Team Goals']);
				goals_against = goals_against + (+d['Away Team Goals']);
			}

		});
		return [played, wins, draws, losses, goals_against, goals_for];
	}

	// 按客场国家聚合数据
	function aggrByAway(leaves) {
		var played = 0;
		var wins = 0;
		var draws = 0;
		var losses = 0;
		var goals_for = 0;
		var goals_against = 0;

		leaves.forEach(function(d) {
			if(d['Year'] <= currentYear) {
				played++;
				if((+d['Home Team Goals']) < (+d['Away Team Goals'])) {
					wins++;
				} else if((+d['Home Team Goals']) > (+d['Away Team Goals'])) {
					losses++;
				} else {
					draws++;
				}
				goals_for = goals_for + (+d['Away Team Goals']);
				goals_against = goals_against + (+d['Home Team Goals']);
			}

		});
		return [played, wins, draws, losses, goals_against, goals_for];
	}

	// 主场国家
	var teamsByHome = d3.nest()
		.key(keyByHome)
		.sortKeys(d3.ascending)
		.rollup(aggrByHome)
		.entries(matches).filter(function(d) {
			return teamsByYear.indexOf(d.key) != -1;
		});

	// 客场国家
	var teamsByAway = d3.nest()
		.key(keyByAway)
		.sortKeys(d3.ascending)
		.rollup(aggrByAway)
		.entries(matches).filter(function(d) {
			return teamsByYear.indexOf(d.key) != -1;
		});

	// 雷达图数据框架
	var radarChartData = [];
	for(var i = 0; i < teamsByHome.length; i++) {
		var d = [teamsByHome[i].key];
		for(var j = 0; j < teamsByHome[i].value.length; j++) {
			d.push(teamsByHome[i].value[j] + teamsByAway[i].value[j]);
		}
		radarChartData.push(d);
	}

	// 雷达图数据归一化
	var playedExtent = d3.extent(radarChartData, function(d) {
		return d[1];
	})
	var extent = [];
	for(var i = 1; i < radarChartData[0].length; i++) {
		extent.push(d3.extent(radarChartData, function(d) {
			return d[i];
		}));
		radarChartData.forEach(function(d) {
			if(d[i] != 0) {
				if((extent[i - 1][1] - extent[i - 1][0]) == 0) {
					d[i] = 1;
				} else
					d[i] = (d[i] - extent[i - 1][0]) / (extent[i - 1][1] - extent[i - 1][0]);
			}
		});
	}

	// 雷达图绘制
	radarChartData.push(["x", "Played", "Wins", "Draws", "Losses", "GoalsAgainst", "GoalsFor"]);
	radarChart = bb.generate({
		data: {
			x: "x",
			columns: radarChartData,
			type: "radar"
		},
		size: {
			height: 500,
			width: 600
		},
		radar: {
			axis: {
				line: {
					show: false
				},
				text: {
					show: function(d) {
						return d;
					}
				}
			},
			level: {
				text: {
					show: false
				}
			},
			size: {
				ratio: 0.85
			}
		},
		legend: {
			position: "right"
		},
		tooltip: {
			format: {
				name: function(name, ratio, id, index) {
					return id;
				},
				// 还原归一化之前的数据
				value: function(value, ratio, id, index) {
					return value * (extent[index][1] - extent[index][0]) + extent[index][0];
				}
			}
		},
		bindto: {
			element: "#RadarChart",
			classname: "bb radarchart"
		}
	});

	radarChart.hide();
	radarChart.legend.hide();
	radarChart.show(selectedCountry);
	radarChart.legend.show(selectedCountry);
}

/* 热力图绘制 */
function drawHeatMap() {
	// 重绘
	d3.select("#HeatMap svg").remove();

	// 位置大小
	var margin = {
		top: 50,
		right: 50,
		bottom: 0,
		left: 100
	};
	var w = 700;
	var h = 500;
	var heatMapWidth = w - margin.left - margin.right;
	var heatMapHeight = h - margin.top - margin.bottom;
	var count = selectedCountry.length;
	var gridSize = heatMapHeight / count;

	// 绘图区
	var heatMap = d3.select("#HeatMap").append("svg")
		.attr("width", w)
		.attr("height", h)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 颜色比例尺
	var z = d3.scaleLinear().range(["white", "rgb(255, 127, 14)"]);

	// 热力图矩阵初始化
	var matrix = [];
	for(var i = 0; i < selectedCountry.length; i++) {
		matrix[i] = [];
		for(var j = 0; j < selectedCountry.length; j++) {
			matrix[i][j] = 0;
		}
	}

	// 数据聚合
	matches.forEach(function(match) {
		if((+match['Year']) > currentYear) return;
		var i = selectedCountry.indexOf(match['Home Team Name']);
		var j = selectedCountry.indexOf(match['Away Team Name']);
		if(i != -1 && j != -1) {
			if((+match['Home Team Goals']) > (+match['Away Team Goals'])) matrix[j][i]++;
			else if((+match['Home Team Goals']) < (+match['Away Team Goals'])) matrix[i][j]++;
		}
	})

	// 构造雷达图数据
	var heatMapData = [];
	for(var i = 0; i < selectedCountry.length; i++) {
		for(var j = 0; j < selectedCountry.length; j++) {
			heatMapData.push([selectedCountry[i], selectedCountry[j], matrix[i][j]]);
		}
	}
	// 更新颜色比例尺定义域
	z.domain([0, d3.max(heatMapData, function(d) {
		return +d[2];
	})]);

	// 列标签
	var colLabels = heatMap.selectAll(".colLabel")
		.data(selectedCountry)
		.enter()
		.append("text")
		.text(function(d) {
			return d;
		})
		.attr("x", 0)
		.attr("y", function(d, i) {
			return i * gridSize;
		})
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")");

	// 行标签
	var rowLabels = heatMap.selectAll(".rowLabel")
		.data(selectedCountry)
		.enter()
		.append("text")
		.text(function(d) {
			return d;
		})
		.attr("x", function(d, i) {
			return i * gridSize;
		})
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)");

	// 提示弹出框
	var tipFactory = d3scription(function(d) {
		return "<table><tr><td>" + d[1] + " wins " + d[0] + "</td><td>" + d[2] + "</td></tr></table>";
	});
	var tip = tipFactory()
		.element(heatMap);

	// 热力图网格
	var girds = heatMap.selectAll(".winsGird")
		.data(heatMapData)
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return selectedCountry.indexOf(d[0]) * gridSize;
		})
		.attr("y", function(d) {
			return selectedCountry.indexOf(d[1]) * gridSize;
		})
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("stroke", "lightgrey")
		.style("stroke-opacity", 0.6)
		.style("fill", function(d) {
			return z(d[2]);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// 图例
	var legend = heatMap.selectAll(".legend")
		.data(z.ticks(6).slice(1).reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return "translate(" + (heatMapHeight + 10) + "," + (20 + i * 20) + ")";
		});
	legend.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", z);
	legend.append("text")
		.attr("x", 26)
		.attr("y", 10)
		.attr("dy", ".35em")
		.text(String);
	heatMap.append("text")
		.attr("class", "label")
		.attr("x", heatMapHeight + 10)
		.attr("y", 10)
		.attr("dy", ".35em")
		.text("Wins");

}

function keyByYear(d) {
	return d['Year'];
}

function keyByHome(d) {
	return d['Home Team Name'];
}

function keyByAway(d) {
	return d['Away Team Name'];
}

function scrollFunction() {
	if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("myBtn").style.display = "block";
	} else {
		document.getElementById("myBtn").style.display = "none";
	}
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}