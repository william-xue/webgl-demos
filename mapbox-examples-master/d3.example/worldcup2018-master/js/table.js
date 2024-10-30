/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {

    // Maintain reference to the tree object
    this.tree = treeObject;

    /**List of all elements that will populate the table.*/
    // Initially, the tableElements will be identical to the teamData
    this.tableElements = null;

    ///** Store all match data for the 2018 Fifa cup */
    this.teamData = teamData;

    this.tableHeaders = ["Team", "Delta Goals", "Result",  "Wins", "Losses", "TotalGames"];

    /** letiables to be used when sizing the svgs in the table cells.*/
    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };

    this.bar = {
      "height": 20
    };

    /** Set variables for commonly accessed data columns*/
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

    /** Setup the scales*/
    this.goalScale = null;


    /** Used for games/wins/losses*/
    this.gameScale = null;

    /**Color scales*/
    /**For aggregate columns*/
    /** Use colors '#feebe2' and '#690000' for the range*/
    this.aggregateColorScale = null;


    /**For goal Column*/
    /** Use colors '#cb181d' and '#034e7b' for the range */
    this.goalColorScale = null;

    this.labelScale = null;

    /** To keep a check on what is
     * sorted, so that double click could sort in
     * the opposite order.
     */
    this.sort = [];

  }


  /**
   * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
   *
   */
  createTable() {

    // Update Scale Domains
    var minGoalsConceded = d3.min(this.teamData, d => d.value['Goals Conceded']);
    var maxGoalsConceded = d3.max(this.teamData, d => d.value['Goals Conceded']);
    var minGoalsMade = d3.min(this.teamData, d => d.value['Goals Made']);
    var maxGoalsMade = d3.max(this.teamData, d => d.value['Goals Made']);
    var goalDomainArray = new Array();
    goalDomainArray.push(minGoalsConceded);
    goalDomainArray.push(maxGoalsConceded);
    goalDomainArray.push(minGoalsMade);
    goalDomainArray.push(maxGoalsMade);

    this.goalScale = d3.scaleLinear()
      .domain([0, d3.max(goalDomainArray)])
      .range([0, 115])
      .nice();

    // Create the axes
    let goalAxes = d3.axisBottom();
    goalAxes.scale(this.goalScale);

    this.goalColorScale = d3.scaleOrdinal(["steelblue", "gray", "darkred"]);

    //add GoalAxis to header of col 1.

    let goalHeader = d3.select("#goalHeader").append('svg')
      .attr('height', this.cell.height)
      .attr('width', '135')
      .attr('id', 'goalAxesSVG');


    let goalAxesSVG = d3.select("#goalAxesSVG");

    let goalAxisGroup = goalAxesSVG.append("g").attr('transform', 'translate(5, 0)').call(goalAxes);

    var minWins = d3.min(this.teamData, d => d.value['Wins']);
    var maxWins = d3.max(this.teamData, d => d.value['Wins']);
    var minLosses = d3.min(this.teamData, d => d.value['Losses']);
    var maxLosses = d3.max(this.teamData, d => d.value['Losses']);
    var minGames = d3.min(this.teamData, d => d.value['TotalGames']);
    var maxGames = d3.max(this.teamData, d => d.value['TotalGames']);

    var gameDomainArray = new Array();
    gameDomainArray.push(minWins);
    gameDomainArray.push(maxWins);
    gameDomainArray.push(minLosses);
    gameDomainArray.push(maxLosses);
    gameDomainArray.push(minGames);
    gameDomainArray.push(maxGames);

    this.gameScale = d3.scaleLinear()
      .domain([d3.min(gameDomainArray), d3.max(gameDomainArray)])
      .range([0, this.cell.width])
      .nice();


    this.labelScale = d3.scaleLinear()
      .domain([d3.min(gameDomainArray), d3.max(gameDomainArray)+2])
      .range([0, this.cell.width-20])
      .nice();

    this.aggregateColorScale = d3.scaleLinear().domain([d3.min(gameDomainArray), d3.max(gameDomainArray)])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#feebe2"), d3.rgb('#690000')]);;

    // ******* TODO: PART V *******

    let table = d3.select('#matchTable');

    let theadSelection = table.select('thead');

    let trSelection = theadSelection.select('tr');

    let thSelection = trSelection.selectAll('th').data(this.tableHeaders);

    thSelection.on("click", (d) => {
      this.collapseList();
      this.sortByAttribute(d);
      this.updateTable();
    });

  }


  /**
   * Updates the table contents with a row for each element in the global variable tableElements.
   */
  updateTable() {
    // ******* TODO: PART III *******
    this.tableElements = this.teamData;

    let table = d3.select('#matchTable');

    let tbodySelection = table.select('tbody');

    let trSelection = tbodySelection.selectAll('tr').data(this.teamData);

    let trEnterSelection = trSelection.enter().append('tr');
                          

    trSelection.exit().remove();

    trSelection = trSelection.merge(trEnterSelection);

    trSelection.on("mouseover", (d) => this.tree.updateTree(d));
    trSelection.on("mouseout", () => this.tree.clearTree());

    let tdSelection = trSelection.selectAll('td')
      .data(function (d, i) {
        var dataArr = new Array();
        dataArr.push({ 'type': d.value.type, 'vis': 'text', 'value': d.key, 'index': i });
        dataArr.push({ 'type': d.value.type, 'vis': 'goals', 'value': [d.value['Goals Conceded'], d.value['Goals Made']], 'index': i  });
        dataArr.push({ 'type': d.value.type, 'vis': 'text', 'value': d.value.Result.label, 'index': i  });
        dataArr.push({ 'type': d.value.type, 'vis': 'bar', 'value': d.value.Wins, 'index': i  });
        dataArr.push({ 'type': d.value.type, 'vis': 'bar', 'value': d.value.Losses, 'index': i  });
        dataArr.push({ 'type': d.value.type, 'vis': 'bar', 'value': d.value['TotalGames'], 'index': i  });
        return dataArr;
      });

    let tdEnterSelection = tdSelection.enter()
      .append("td");

    tdSelection.exit().remove();

    tdSelection = tdSelection.merge(tdEnterSelection);

    tdSelection.attr("style", (d, i) => {
      if (d.type == "aggregate" && i == 0)
        return "font-family: Courier; color: #cb181d; font-weight: bold"
      if (d.type == "game" && i == 0)
        return "font-family: Courier; color: #8a8a8a; font-weight: bold"
    })
      .html(function (d, i) {
        if (d.vis == 'text') {
          if (d.type == "game" && i == 0)
            return 'x' + d.value;
          else
            return d.value;
        }
      })
      .on("click", (d) => this.updateList(d.index));

    tdSelection = trSelection.selectAll('td');

    let tdBarSelection = tdSelection.filter((d) => {
      return d.vis == 'bar'
    })

    tdBarSelection.append('svg').attr('height', this.cell.height).attr('width', 125);

    tdBarSelection.selectAll('svg').append('g');

    let groups = tdBarSelection.selectAll('g');

    groups.append('rect');

    let rects = groups.selectAll('rect');

    rects.attr('height', this.cell.height)
      .attr('width', (d) => this.gameScale(d.value))
      .style('fill', (d) => this.aggregateColorScale(d.value));
    
    groups.append('text')
      .text((d) => { if (d.value != 0) return d.value })
      .attr("font-family", "sans-serif")
      .attr("x", (d) => (this.gameScale(d.value) > 9) ? this.gameScale(d.value)-9 : this.gameScale(d.value))
      .attr("y", (this.cell.height / 2 + 3))
      .attr('class', 'label');

    // Goals
    let tdGoalSelection = tdSelection.filter((d) => {
      return d.vis == 'goals'
    })

    tdGoalSelection.append('svg').attr('height', this.cell.height).attr('width', 125);

    tdGoalSelection.selectAll('svg').append('g').attr('transform', 'translate(5, 7)');

    let goalGroups = tdGoalSelection.selectAll('g');

    goalGroups.append('rect');

    goalGroups.append('title').text((d) => 'Goals Conceded: '+d.value[0] + ', Goals Scored: '+d.value[1]);

    let goalRects = goalGroups.selectAll('rect');

    goalRects.attr('height', (d) => { if (d.type == "game") return 5; else return 10 })
      .attr('x', (d) => {
        if (d.value[0] < d.value[1])
          return this.goalScale(d.value[0]);
        else
          return this.goalScale(d.value[1]);
      })
      .attr('width', (d) => {
        if (d.type == 'aggregate') {
          if (d.value[0] < d.value[1])
            return this.goalScale(d.value[1] - d.value[0]);
          else
            return this.goalScale(d.value[0] - d.value[1]);
        }
        if (d.type == 'game') {
          if (d.value[0] < d.value[1])
            return (d.value[1] - d.value[0] > 6) ? this.goalScale(d.value[1] - d.value[0]) - 6 : this.goalScale(d.value[1] - d.value[0]);
          else
            return (d.value[0] - d.value[1]) ? this.goalScale(d.value[0] - d.value[1]) - 6 : this.goalScale(d.value[0] - d.value[1]);
        }
      })
      .attr('fill', (d) => {
        if (d.value[0] < d.value[1])
          return "#034e7b";
        if (d.value[0] == d.value[1])
          return "#8a8a8a";
        else
          return "#cb181d";
      })
      .attr('class', 'goalBar')
      .attr('transform', (d) => { if (d.type == "game") return "translate(3,2.5)" });

    goalGroups.append('circle').classed('winner', true);

    let winnerCircles = goalGroups.selectAll('.winner');

    winnerCircles.attr('cy', 5)
      .attr('cx', (d) => this.goalScale(d.value[1]))
      .classed('goalCircle', true)
      .attr('fill', (d) => {
        if (d.type == 'aggregate')
          return '#364e74'
        else return 'none';
      })
      .attr('style', (d) => {
        if (d.type == 'game')
          return 'stroke: #364e74';
      });

    goalGroups.append('circle').classed('node', true);

    let nodeCircles = goalGroups.selectAll('.node');

    nodeCircles.attr('cy', 5)
      .attr('cx', (d) => this.goalScale(d.value[0]))
      .classed('goalCircle', true)
      .attr('fill', (d) => {
        if (d.type == 'aggregate') {
          if (d.value[0] == d.value[1]) return '#8a8a8a';
          else return '#be2714';
        }
        else return 'none';
      })
      .attr('style', (d) => {
        if (d.type == 'game')
          if (d.value[0] == d.value[1]) return 'stroke: #8a8a8a';
          else return 'stroke: #be2714';
      });
  }

  /**
   * Updates the global tableElements variable, with a row for each row to be rendered in the table.
   *
   */
  updateList(i) {
    // ******* TODO: PART IV *******

    //Only update list for aggregate clicks, not game clicks
    let table = d3.select('#matchTable');

    let tbodySelection = table.select('tbody');

    let trSelection = tbodySelection.selectAll('tr');

    let currentSelectionState = this.teamData[i].value.type;

    //do nothing is the current clicked item is a game
    if (currentSelectionState == "game") return;

    let nextSelectionState = null;

    if (this.teamData.length > (i + 1))
      nextSelectionState = this.teamData[i + 1].value.type;

    //add games if it's aggregate; otherwise remove games
    if (nextSelectionState == "aggregate" || nextSelectionState == null) {
      this.teamData.splice(i + 1, 0, ...this.teamData[i].value.games);
    } else {
      this.teamData.splice(i + 1, this.teamData[i].value.games.length);
    }
    this.updateTable();


  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate values per country.
   *
   */
  // ******* TODO: PART IV *******
  collapseList() {
    var tempArray = new Array();

    for (var element of this.teamData) {
      if (element.value.type == 'aggregate') tempArray.push(element);
    }

    this.teamData = [];
    this.teamData = tempArray;

    this.updateTable();

  }

  sortByAttribute(d) {
    if(d == "Team") {
      if(this.sort.indexOf("Team") == -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.ascending(a.key, b.key));
        this.sort.push("Team");
      } else if(this.sort.indexOf("Team") != -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.descending(a.key, b.key));
        this.sort.splice(this.sort.indexOf('Team'), 1);
      }
      return;
    }

    if(d == "Result") {
      if(this.sort.indexOf("Result") == -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.descending(a.value[d].ranking, b.value[d].ranking));
        this.sort.push("Result");
      } else if(this.sort.indexOf("Result") != -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.ascending(a.value[d].ranking, b.value[d].ranking));
        this.sort.splice(this.sort.indexOf('Result'), 1);
      }
      return;
    }
    
    if(this.sort.indexOf(d) == -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.descending(a.value[d], b.value[d]));
        this.sort.push(d);
      } else if(this.sort.indexOf(d) != -1) {
        this.teamData = this.teamData.slice().sort((a, b) => d3.ascending(a.value[d], b.value[d]));
        this.sort.splice(this.sort.indexOf(d), 1);
      }
    }


}
