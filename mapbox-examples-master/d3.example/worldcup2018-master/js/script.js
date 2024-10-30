    /**
     * Loads in the table information from fifa-matches-2018.json
     */




// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

window.addEventListener('message', function(mes){
  const {type, data} = mes
  console.log('年份:', data);
  if (Object.prototype.toString.call(data) == '[object Object]' && data.type && data.type === 'change') {
    update(data.data)
    document.getElementById('title').innerText = `Exploring Match Statistics for ${data.data} World Cup`
    // $("#title").text('Exploring Match Statistics for 2018 World Cup')
  }else {
    console.log('过去....')
  }
}, false);

update(2018)

function update(year){
  d3.csv(`data/fifa-matches-${year}.csv`).then( matchesCSV => {
  teamData = d3.nest()
      .key(d => {
          return d.Team;
      })
      .rollup(function(v) { 
        var gameObj = new Object();
        gameObj["Goals Conceded"] = d3.sum(v, function(d) { return d['Goals Conceded']; });
        gameObj["Goals Made"] = d3.sum(v, function(d) { return d['Goals Made']; });
        gameObj["Delta Goals"] = d3.sum(v, function(d) { return d['Delta Goals']; });
        gameObj.Wins = d3.sum(v, function(d) { return d.Wins; });
        gameObj.Losses = d3.sum(v, function(d) { return d.Losses; });
       
        var games = new Array();
        var rank = -1;
        for(var leaf of v) {
          if(findRank(leaf.Result) > rank) rank = findRank(leaf.Result);
          var opponentGameObj = new Object();
          opponentGameObj.key = leaf.Opponent;
          opponentGameObj.value = {
            "Goals Made": leaf['Goals Made'],
            "Goals Conceded": leaf['Goals Conceded'],
            "Delta Goals": [],
            "Wins": [],
            "Losses": [],
            "Result" : {"label": leaf.Result, "ranking": findRank(leaf.Result)},
            "type": "game",
            "Opponent": leaf.Team
          }
          games.push(opponentGameObj);
        }
        gameObj.Result = {"label": findResult(rank), "ranking": rank}; 
        gameObj["TotalGames"] = v.length;
        gameObj.games = games;
        gameObj["type"] = "aggregate";
        return gameObj;
      })
     
    .entries(matchesCSV);

    d3.csv(`data/fifa-tree-${year}.csv`).then( treeCSV => {

      treeCSV.forEach( (d, i) => {
        d.id = d.Team + d.Opponent + i;
      });

      //Create Tree Object
      let tree = new Tree();
      tree.createTree(treeCSV);

      //Create Table Object and pass in reference to tree object (for hover linking)

      let table = new Table(teamData,tree);

      document.getElementById('goalHeader').innerHTML=''
      table.createTable();
      table.updateTable();


   });
  });

}


// d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

// //     /**
// //      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
// //      *
// //      */

//   teamData = d3.nest()
//       .key(d => {
//           return d.Team;
//       })
//       .rollup(function(v) { 
//         var gameObj = new Object();
//         gameObj["Goals Conceded"] = d3.sum(v, function(d) { return d['Goals Conceded']; });
//         gameObj["Goals Made"] = d3.sum(v, function(d) { return d['Goals Made']; });
//         gameObj["Delta Goals"] = d3.sum(v, function(d) { return d['Delta Goals']; });
//         gameObj.Wins = d3.sum(v, function(d) { return d.Wins; });
//         gameObj.Losses = d3.sum(v, function(d) { return d.Losses; });
       
//         var games = new Array();
//         var rank = -1;
//         for(var leaf of v) {
//           if(findRank(leaf.Result) > rank) rank = findRank(leaf.Result);
//           var opponentGameObj = new Object();
//           opponentGameObj.key = leaf.Opponent;
//           opponentGameObj.value = {
//             "Goals Made": leaf['Goals Made'],
//             "Goals Conceded": leaf['Goals Conceded'],
//             "Delta Goals": [],
//             "Wins": [],
//             "Losses": [],
//             "Result" : {"label": leaf.Result, "ranking": findRank(leaf.Result)},
//             "type": "game",
//             "Opponent": leaf.Team
//           }
//           games.push(opponentGameObj);
//         }
//         gameObj.Result = {"label": findResult(rank), "ranking": rank}; 
//         gameObj["TotalGames"] = v.length;
//         gameObj.games = games;
//         gameObj["type"] = "aggregate";
//         return gameObj;
//       })
     
//     .entries(matchesCSV);

//     d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

//           treeCSV.forEach( (d, i) => {
//             d.id = d.Team + d.Opponent + i;
//           });

//           //Create Tree Object
//           let tree = new Tree();
//           tree.createTree(treeCSV);

//           //Create Table Object and pass in reference to tree object (for hover linking)

//           let table = new Table(teamData,tree);

//           table.createTable();
//           table.updateTable();


//        });

// });

function findRank(result) {
  var ranks = new Array();
  ranks.push('Group');
  ranks.push('Round of Sixteen');
  ranks.push('Quarter Finals');
  ranks.push('Semi Finals');
  ranks.push('Fourth Place');
  ranks.push('Third Place');
  ranks.push('Runner Up');
  ranks.push('Winner');
  return ranks.indexOf(result);
}

function findResult(rank) {
  var ranks = new Array();
  ranks.push('Group');
  ranks.push('Round of Sixteen');
  ranks.push('Quarter Finals');
  ranks.push('Semi Finals');
  ranks.push('Fourth Place');
  ranks.push('Third Place');
  ranks.push('Runner Up');
  ranks.push('Winner');
  return ranks[rank];
}
