function draw(geo_data) {
        "use strict";
        var margin = 75,
            width = 1400 - margin,
            height = 600 - margin;

        var svg = d3.select("#mapContainer")
           .append("svg")
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 1400 600")
           .append('g')
           .attr('class', 'map');     

        var years = [];
    

          for (var i = 1930; i < 2015; i +=4) {
            if(i !== 1942 && i !== 1946) {
              years.push(i);
            };
          }

        var projection = d3.geo.mercator()
                               .scale(140)
                               .translate([width / 2, height / 1.2]);

        var path = d3.geo.path().projection(projection);

        var map = svg.selectAll('path')
                     .data(geo_data.features)
                     .enter()
                     .append('path')
                     .attr('d', path)
                     .style('fill', 'lightblue')
                     .style('stroke', 'orangered')
                     .style('stroke-width', 0.5);


 // Start Animation on Click
 d3.select("#start").on("click", function() {

       d3.select(".years_buttons").remove();
       d3.select(".explanation").remove();

      d3.tsv("world_cup_geo.tsv", function(d) {
        d['attendance'] = +d['attendance'];
        d['date'] = format.parse(d['date']);
        return d;
      }, plot_points);
  
 });

        function plot_points(data) {
            
            function agg_year(leaves) {
                var total = d3.sum(leaves, function(d) {
                    return d['attendance'];
                });

                var coords = leaves.map(function(d) {
                    return projection([+d.long, +d.lat]);
                });

                var center_x = d3.mean(coords, function(d) {
                    return d[0];
                });

                var center_y = d3.mean(coords, function(d) {
                    return d[1];
                });

                var filtered = leaves.filter(function(d) {
                   return d.stage == "FINAL ROUND"; 
                });

                var winningTeam = filtered.map(function(d) {
                    return d['team1'];
                });

                var teams = d3.set();

                leaves.forEach(function(d) {
                    teams.add(d['team1']);
                    teams.add(d['team2']);
                });

                return {
                  'winningTeam'  : winningTeam,
                  'attendance' : total,
                  'x' : center_x,
                  'y' : center_y,
                  'teams' : teams.values()
                };
            } //end agg_year

            var nested = d3.nest()
                           .key(function(d) {
                              return d['date'].getUTCFullYear();
                           })
                           .rollup(agg_year)
                           .entries(data);

            var attendance_max = d3.max(nested, function(d) {
                return d.values['attendance'];
            });

            var radius = d3.scale.sqrt()
                           .domain([0, attendance_max])
                           .range([0, 15]);

            var cirlceStroke = d3.scale.sqrt()
                           .domain([0, attendance_max])
                           .range([0, 5]);

            function key_func(d) {
                return d['key'];
            }

            // Define the div for the tooltip
             var div = d3.select("body").append("div") 
               .attr("class", "tooltip")       
               .style("opacity", 0);

             var div2 = d3.select("body").append("div") 
               .attr("class", "tooltip2")       
               .style("opacity", 0);

            var div3 = d3.select("body").append("div") 
              .attr("class", "tooltip3")       
              .style("opacity", 0);

            svg.append('g')
               .attr("class", "bubble")
               .selectAll("circle")
               .data(nested.sort(function(a, b) { 
                  return b.values['attendance'] - a.values['attendance'];
               }), key_func)
               .enter()
               .append("circle")
               .attr('class', 'cirlce2')  
               .attr('cx', function(d) { return d.values['x']; })
               .attr('cy', function(d) { return d.values['y']; })
               .attr('r', function(d) { return radius(d.values['attendance']);
               });


          function update(year) {
              var filtered = nested.filter(function(d) {
                  return new Date(d['key']).getUTCFullYear() === year;
              });

             
              var circles = svg.selectAll('circle')
                               .data(filtered, key_func);

              circles.exit().remove();

              circles.enter()
                     .append("circle")
                     .transition()
                     .duration(400)
                     .attr('cx', function(d) { return d.values['x']; })
                     .attr('cy', function(d) { return d.values['y']; })
                     .attr('r', function(d) {
                        return radius(d.values['attendance']);
                     })
                     .style('stroke-width', function(d) {
                          return cirlceStroke(d.values['attendance']);
                     })
                     .attr('class', 'cirlce2');
                   
                   function matchData(data) {
                    //avoid selectAll here, otherwise chart circles display this tootltip
                   d3.select('circle')
                      .data(data)
                     .on("mouseover", function(d) {    
                              div3.transition()    
                                  .duration(200)    
                                  .style("opacity", .9);    
                              div3.html("<div><span>Winner:</span> <span style='color:white'>" + winner + "</span></div>") 
                                  .style("left", (d3.event.pageX - 50) + "px")   
                                  .style("top", (d3.event.pageY - 50) + "px");  
                              })          
                              .on("mouseout", function(d) {   
                                  div3.transition()    
                                      .duration(500)    
                                      .style("opacity", 0); 
                              });

                   } //end function matchData
                   matchData(data);
                     
              //countries in an array of strings of names
              var countries = filtered[0].values['teams'];
              const sumCountries = countries.length;
              // console.log(sumCountries);

              var winner = filtered[0].values['winningTeam'];
              // console.log(winner);

              d3.select("#title")
                .html('<p>' + "Year: " + year + '</p>'
                      + '<br/>'+ '<h1>' + "Winner: " + winner  + '</h1>' 
                      + '<br/>'+ '<p>' + "Number of participating countries: " + sumCountries + '</p>'
                      );

              //(d) is the geojson for path. there is a path for every country. (d) has properties
              function update_countries(d) {
                  if(countries.indexOf(d.properties.name) !== -1) {
                      return "lightblue";
                  } else {
                      return 'white';
                  }

              }

              //every path had a geojson attached
              svg.selectAll('path')
                .transition()
                .duration(400)
                .style('fill', update_countries)
                .style('stroke', update_countries)
                .style('stroke', 'orangered')
                .style('stroke-width', 0.33);


          }; //end update

          function countryData(data) {
          svg.selectAll('path')
            .on("mouseover", function(d) { 
                     div2.transition()    
                         .duration(200)    
                         .style("opacity", .9);    
                     div2.html("<div><span style='color:white'>" + d.properties.name + "</span></div>") 
                         .style("left", (d3.event.pageX - 50) + "px")   
                         .style("top", (d3.event.pageY - 50) + "px");  
                     })          
                     .on("mouseout", function(d) {   
                         div2.transition()    
                             .duration(500)    
                             .style("opacity", 0); 
                     });
          } //end function countryData
          countryData(data);

        //Year Buttons
          var year_idx = 0;

          var year_interval = setInterval (function() {
            update(years[year_idx]);

            year_idx++;
            // console.log(years[year_idx]);

            if(year_idx >= years.length) {
              clearInterval(year_interval);

               var buttons = d3.select("#buttonContainer")
                        .append("div")
                        .attr("class", "years_buttons")
                        .selectAll("div")
                        .data(years)
                        .enter()
                        .append("div")
                        .text(function(d) {
                            return d;
                        });

                var explanation = d3.select("#startContainer")
                        .append("p")
                        .attr("class", "explanation")
                        .text('Click on the year buttons to update map')
                            .style('color', 'white');

                buttons.on("click", function(d) {
                    d3.select(".years_buttons")
                      .selectAll("div")
                      .transition()
                      .duration(400)
                      .style("color", "white")
                      .style("background", "orange");


                  d3.select(this)
                    .transition()
                    .duration(400)
                    .style('background', "lightblue")
                    .style('color', 'white');
                  update(d);

                });
            }


          }, 300); //end year buttons



  
      } //end function draw

      
    };

   

  function draw2(data) {
  "use strict";

      var margin = 125,
          width = 900 - margin,
          height = 400 - margin;

      var radius = 3;
      var color = "white";


      var svg = d3.select("#chartContainer")
       .append("svg")
       //responsive SVG 
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 900 400");

      // Define the div for the tooltip
       var div = d3.select("body").append("div") 
         .attr("class", "tooltip")       
         .style("opacity", 0);

      //chart explanation
      var explanation = d3.select("#chartExplanation")
              .append("p")
              .attr("class", "chartExplanation")
              .text('Hover on graph to see match details')
                  .style('color', 'white');

  /*
   Chart construction code
  */

      d3.select("svg")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

      // Find range of date column
      var time_extent = d3.extent(data, function(d) {
          return d['date'];
      });

      // Find range of attendance column
      var count_extent = d3.extent(data, function(d) {
          return d['attendance'];
      })

      // Create x-axis scale mapping dates -> pixels
      var time_scale = d3.time.scale()
        .range([margin, width])
        .domain(time_extent);

      // Create y-axis scale mapping attendance -> pixels
      var count_scale = d3.scale.linear()
        .range([height, margin])
        .domain(count_extent);

      var time_axis = d3.svg.axis()
        .scale(time_scale)
        .ticks(d3.time.years, 2);

      var count_axis = d3.svg.axis()
        .scale(count_scale)
        .orient("left");

      d3.select("svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(time_axis)
        .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

      d3.select("svg")
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin + ",0)")
        .call(count_axis)
        .append("text")
                .attr("y", 88)
                .attr("x", 118 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Attendance");

      d3.selectAll("circle")
        .attr("cx", function(d) {
            return time_scale(d["date"]);
        })
        .attr("cy", function(d) {
            return count_scale(d["attendance"]);
        })
        .attr("r", radius)
        .attr("r", function(d) {
              return is_home_game(d) ? "7" : "3";
          })
        // .attr("fill", color);
        .attr("fill", function(d) {
              return is_home_game(d) ? "orange" : "white";
          })
        .on("mouseover", function(d) {    
                 div.transition()    
                     .duration(200)    
                     .style("opacity", .9);    
                 div.html("<div><span>Year:</span> <span style='color:white'>" + d.year + "</span></div>" + "<div><span>Match:</span> <span style='color:white'>" + d['team1'] + " vs.</span> <span style='color:white'>"  + d['team2']+ "</span></div>" + "<div><span>Score:</span> <span style='color:white'>" + d['goals'] + "</span></div>") 
                     .style("left", (d3.event.pageX - 50) + "px")   
                     .style("top", (d3.event.pageY - 50) + "px");  
                 })          
                 .on("mouseout", function(d) {   
                     div.transition()    
                         .duration(500)    
                         .style("opacity", 0); 
                 });

        function is_home_game(d) {
              return ((d.team1 == d.home)||(d.team2 == d.home));
            };

        //legend
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
            .selectAll("g")
            .data(["Home Team", "Others"])
            .enter().append("g");

          legend.append('circle')
            .attr('cy', function (d, i) {
              return i * 30;
            })
            .attr("r", function(d) {
                if (d == "Home Team") {
                    return radius * 2;
                } else {
                    return radius;
                }
              })
            .attr("fill", function(d) {
                if (d == "Home Team") {
                    return 'orange';
                } else {
                    return 'white';
                }
              });

          legend.append("text")
              .attr("y", function(d, i) {
                  return i * 30 + 5;
              })
              .attr("x", radius * 5)
              .text(function(d) {
                  return d;
              });
}; //end chart2
