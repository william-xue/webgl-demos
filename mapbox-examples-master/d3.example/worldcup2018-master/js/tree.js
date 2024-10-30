/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        
        let treeGroup = d3.select('#tree');
        treeGroup.attr("transform", "translate(100, 0)");
       
        let height = 800;
        let width = 300;
        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([height, width]);

        //Create a root for the tree using d3.stratify(); 
        let root = d3.stratify()
            .id((d,i) => { return i; })
            .parentId(d => { return d.ParentGame; })
            (treeData);
        
        root.x0 = height/2;
        root.y0 = 0;
        
        let treeDataPos = treemap(root);

        //Add nodes and links to the tree. 

        let nodes = treeDataPos.descendants(),
            links = treeDataPos.descendants().slice(1);
        
        nodes.forEach(function(d){ d.y = d.depth * 180});
        
        let node = treeGroup.selectAll('node')
        .data(nodes, d => d.id || (d.id = ++i));

        let nodeEnter = node.enter().append('g')
            .attr("transform", d => {
                return "translate(" + d.y + "," + d.x + ")";
        })

        nodeEnter.append('circle')
            .attr('r', 5)
            .attr('transform', 'translate(7,0)')
            .style("fill", d => {
                if (d.parent == null || d.data.Team == d.parent.data.Team || d.data.Team == d.parent.data.Opponent) return "#034e7b";
                else return "#cb181d";
            });
        
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", d => d.children || d._children)
            .attr('transform', (d) => { if(!d.children) return 'translate(14,0)'})
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .text(d => d.data.Team);
        
              // UPDATE
        let nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .attr("transform", d => "translate(" + (d.y)/1.5 + "," + d.x + ")");

        let link = treeGroup.selectAll('path.link')
            .data(links, d => d.id);

        let linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', d => this.diagonal(d, d.parent));
        
        let linkUpdate = linkEnter.merge(link);

        linkUpdate.attr('d', d => this.diagonal(d, d.parent));
            
        link.exit().remove();
    }
    
    diagonal(s, d) {
       var newSourceY = s.y/1.5;
       var newDestinationY = d.y/1.5; 
       let path = `M ${newSourceY} ${s.x}
                   C ${(newSourceY + newDestinationY) / 2} ${s.x},
                   ${(newSourceY + newDestinationY) / 2} ${d.x},
                   ${newDestinationY} ${d.x}`
        
        return path
    }
    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        let treeGroup = d3.select('#tree');

        let links = treeGroup.selectAll('path.link');
        let paths = links._groups[0];

        if(row.value.type == 'aggregate') {
            for(var path of paths) {
                var pathData = path.__data__.data; 
                if(pathData.Team == row.key || pathData.Opponent == row.key) 
                    path.classList.add("selected");
            }
        }

        
        if(row.value.type == 'game') {
            for(var path of paths) {
                var pathData = path.__data__.data; 
                if((pathData.Team == row.key && pathData.Opponent == row.value.Opponent) || 
                    (pathData.Opponent == row.key && pathData.Team == row.value.Opponent)) 
                    path.classList.add("selected");
            }
        }

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        let paths =  d3.select('#tree').selectAll('path');
        paths.classed('selected', false);

    }
}
