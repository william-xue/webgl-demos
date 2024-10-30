$(function () {
    // 大的圆形进度条
    function addGuageBig(val = 89) {
        let chartDom = document.getElementById('guage-big');
        let myChart = echarts.init(chartDom);
        let option;

        const gaugeData = [
            {
                value: val,
                name: '安全指数',
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-20%']
                }
            },
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 30,
                    endAngle: -330,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 0,
                            color: '#d1c150',//
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 15,
                            // color: [
                            //     [0.1, 'red'], // 0~10% 红轴
                            //     [0.2, 'green'], // 10~20% 绿轴
                            //     [0.3, 'blue'], // 20~30% 蓝轴
                            // ]
                            color: [[1, '#1b2e7000']]
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 30
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 18,
                        color: '#fff'
                    },
                    detail: {
                        width: 20,
                        height: 25,
                        fontSize: 20,
                        color: '#d1c150',
                        borderColor: 'auto',
                        borderRadius: 10,
                        borderWidth: 1,
                        formatter: '{value}'
                    }
                }
            ],
            aria: {
                enabled: true,
                decal: {
                    show: true,
                    decals: [
                        // {symbol: 'rect'},
                        { symbol: 'circle' },
                        { symbol: 'roundRect' },
                        { symbol: 'triangle' },
                        { symbol: 'diamond' },
                        { symbol: 'pin' },
                        { symbol: 'arrow' }
                    ]
                }
            }
        };
        // setInterval(function () {
        //     gaugeData[0].value = +(Math.random() * 100).toFixed(2);
        //     gaugeData[1].value = +(Math.random() * 100).toFixed(2);
        //     gaugeData[2].value = +(Math.random() * 100).toFixed(2);
        //     myChart.setOption({
        //         series: [
        //             {
        //                 data: gaugeData,
        //                 pointer: {
        //                     show: false
        //                 }
        //             }
        //         ]
        //     });
        // }, 2000);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }
    }


    function addGuageSmall(id, val = 89) {
        let chartDom = document.getElementById(id);
        let myChart = echarts.init(chartDom);
        let option;

        const gaugeData = [
            {
                value: val,
                name: '安全指数',
                title: {
                    show: false,
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '0%']
                }
            },
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 30,
                    endAngle: -330,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 0,
                            color: '#d1c150',//
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 5,
                            color: [[1, '#1b2e70']]
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 50
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14,
                        color: '#fff'
                    },
                    detail: {
                        width: 20,
                        height: 14,
                        fontSize: 15,
                        color: '#d1c150',
                        borderColor: 'auto',
                        borderRadius: 10,
                        borderWidth: 0,
                        formatter: '{value}'
                    }
                }
            ],
            aria: {
                enabled: false,
                decal: {
                    show: true,
                    decals: [
                        // {symbol: 'rect'},
                        { symbol: 'circle' },
                        { symbol: 'roundRect' },
                        { symbol: 'triangle' },
                        { symbol: 'diamond' },
                        { symbol: 'pin' },
                        { symbol: 'arrow' }
                    ]
                }
            }
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }
    }

    // 横向柱状图
    function add_chart_bar1() {
        let chartDom = document.getElementById('chart-bar-1');
        let myChart = echarts.init(chartDom);
        let option;
        const labelLeft = {
            position: 'right'
        };
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 10,
                bottom: 10
            },
            xAxis: {
                show: false,
                type: 'value',
                position: 'top',
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisLine: { show: false },
                axisLabel: { show: true, color: '#fff' },
                axisTick: { show: false },
                splitLine: { show: false },
                data: [
                    '风度',
                    '风温',
                    '富氧度'
                ]
            },
            series: [
                {
                    name: '数值',
                    type: 'bar',
                    stack: 'Total',
                    label: {
                        show: true,
                        // formatter: '{b}'
                        position: 'right',
                        valueAnimation: true
                    },
                    barWidth: 8,
                    showBackground: true,
                    itemStyle: {
                        // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        //     { offset: 0, color: '#585435' },
                        //     // { offset: 0.5, color: '#d1c150' },
                        //     { offset: 1, color: '#d1c150' }
                        // ])
                        color: '#d1c150',

                    },
                    // emphasis: {
                    //     itemStyle: {
                    //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //             { offset: 0, color: '#2378f7' },
                    //             { offset: 0.7, color: '#2378f7' },
                    //             { offset: 1, color: '#585435' }
                    //         ])
                    //     }
                    // },
                    data: [
                        { value: 4500.1, label: labelLeft, },
                        { value: 6105.6, label: labelLeft },
                        { value: 10118.23, label: labelLeft },
                    ]
                }
            ],
            label: {
                color: '#fff'
            }
        };

        option && myChart.setOption(option);

    }


    // 柱状图2
    function add_chart_bar2() {
        let chartDom = document.getElementById('chart-bar-2');
        let myChart = echarts.init(chartDom);
        let option;
        option = {
            legend: { show: true, right: 40, textStyle: { color: "#fff" } },
            tooltip: {},
            dataset: {
                dimensions: ['product', '探尺1', '探尺2'],
                source: [
                    { product: '8:30', '探尺1': 43.3, '探尺2': 85.8 },
                    { product: '8:40', '探尺1': 83.1, '探尺2': 73.4 },
                    { product: '8:50', '探尺1': 86.4, '探尺2': 65.2 },
                ]
            },
            grid: {
                top: 30,
                bottom: 30
            },
            xAxis: {
                type: 'category',
                show: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'grey'
                    }
                }
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [{ type: 'bar', barWidth: 8, }, { type: 'bar', barWidth: 8, }]
        };

        option && myChart.setOption(option);

    }

    // 折现图
    function add_chart_line1() {
        let chartDom = document.getElementById('chart-line-1');
        let myChart = echarts.init(chartDom);
        let option;
        option = {
            legend: { show: true, right: 40, textStyle: { color: "#fff" } },
            tooltip: {},
            dataset: {
                dimensions: ['product', '风压', '均项温'],
                source: [
                    { product: '8:30', '风压': 250.3, '均项温': 250.7 },
                    { product: '8:40', '风压': 233.1, '均项温': 273.4 },
                    { product: '8:50', '风压': 247.4, '均项温': 265.2 },
                ]
            },
            grid: {
                top: 30,
                bottom: 80
            },
            xAxis: {
                type: 'category',
                show: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'grey'
                    }
                }
            },

            yAxis: {
                show: true,
                type: 'value',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'grey'
                    }
                }
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [{
                type: 'line',
                barWidth: 8,
                markLine: {
                    symbol: ['none', 'none'],
                    label: { show: false },
                    data: [{ xAxis: 1 }, { xAxis: 2 }, { xAxis: 0 }, { xAxis: 3 }]
                },
            }, { type: 'line', barWidth: 8, }]
        };

        option && myChart.setOption(option);

    }
    // 进度条图
    addGuageBig(90);
    addGuageSmall('guage-top', 70)
    addGuageSmall('guage-middle', 50)
    addGuageSmall('guage-bottom', 40)
    add_chart_bar1()
    add_chart_bar2()
    add_chart_line1()



    // 右侧柱状图
    function add_right_bar(id,dimensions ,source ,colors) {
        let chartDom = document.getElementById(id);
        let myChart = echarts.init(chartDom);
        let option;
        option = {
            legend: { show: true, textStyle: { color: "#fff" } },
            tooltip: {},
            dataset: {
                dimensions: dimensions,
                source: source
            },
            grid: {
                top: 40,
                bottom: 20
            },
            xAxis: {
                type: 'category',
                show: true,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisTick:{
                    show:false
                }
            },
            yAxis: {
                show: false,
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },

            },
            series: [{
                type: 'bar',
                barWidth: 8,
                stack: 'Total',
                label: {
                    show: true,
                    position: 'top',
                    color:'#fff'
                },
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors[0] },
                        { offset: 1, color: colors[1] }
                    ])
                },
            }]
        };

        option && myChart.setOption(option);

    }
    add_right_bar('chart-bar-first'
    ,['product', '利用系数']
    ,[
        { product: '高炉', '利用系数': 4.35 },
        { product: '平均', '利用系数': 6.84 },
        { product: '最佳', '利用系数': 6.68 },
    ],['#088afd','#1374c9'])
    add_right_bar('chart-bar-second'
    ,['product' ,'燃料比']
    ,[
        { product: '高炉', '燃料比': 8.35 },
        { product: '平均', '燃料比': 9.84 },
        { product: '最佳', '燃料比': 9.68 },
    ], ['#02d7f9','#01788b'])
    add_right_bar('chart-bar-third'
    ,['product', '入炉品味']
    ,[
        { product: '高炉', '入炉品味': 58.35 },
        { product: '平均', '入炉品味': 59.84 },
        { product: '最佳', '入炉品味': 54.68 },
    ], ['#723cf5','#3706af'])
    add_right_bar('chart-bar-forth'
    ,['product', '燃气利用率']
    ,[
        { product: '高炉', '燃气利用率': 48.35 },
        { product: '平均', '燃气利用率': 49.84 },
        { product: '最佳', '燃气利用率': 44.68 },
    ], ['#d1c150','#585435'])
})
