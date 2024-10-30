$(function () {
    let api = "http://localhost:8080"
    //  if (sessionStorage.getItem("token") == null) {
    //      alert("未登录！请登录！")
    //      window.location.replace("./login.html");
    //  }
    var viz;
    var config = {
        container_id: "viz",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "123",
        arrows:true,
        labels: {
            "MENU0": {
                "caption": "name",
                "size": 20,
                "community": "name",
                "image": 'https://visjs.org/images/visjs_logo.png',
                "font": {
                    "size":26,
                    "color":"#000000"
                },
                // "title_properties": [
                //     "name",
                //     "pagerank"
                // ],
            },
            "MENU1": {
                "caption": "name",
                "size": 18,
                "community": "community",
            },
            "MENU2": {
                "caption": "name",
                "size": 16,
                "community": "community",
            },
            "MENU3": {
                "caption": "name",
                "size": 12,
            },
            "MENU4": {
                "caption": "name",
                "size": 10,
            },
        },
        relationships: {
            "R": {
                "thickness": "weight",
                "caption": 'name',
                // "caption":false,
            }
        },
        initial_cypher: "MATCH (n)-[r:R]->(m) RETURN * limit 50"
    };

    viz = new NeoVis.default(config);
    viz.render();
    $(".btn_submit").click(function (e) {
        e.preventDefault();
        const cql = $('.query_by_cql').val();
        console.log(cql)
        config['initial_cypher'] =  ($.trim(cql) === '')? "MATCH (n)-[r:R]->(m) RETURN * limit 50" :cql;
        try {
			viz.clearNetwork()
            viz.reinit(config)
            viz.render()
        }catch(err){
            alert('cypher语句有误，请检查')
        }
    });
	$(".btn_submit_byname1").click(function (e) {
        e.preventDefault();
        const name = $('.query_by_name1').val();
        console.log(name)
        config['initial_cypher'] =  ($.trim(name) === '')? "MATCH (n)-[r:R]->(m) RETURN * limit 50" :"match p = (n)-[*1..3]->(m) where m.name =~ '.*"+name+".*' return p";
        try {
			viz.clearNetwork()
            viz.reinit(config)
            viz.render()
        }catch(err){
            alert('cypher语句有误，请检查')
        }
    });
	$(".btn_submit_byname2").click(function (e) {
        e.preventDefault();
        const name = $('.query_by_name2').val();
        console.log(name)
        config['initial_cypher'] =  ($.trim(name) === '')? "MATCH (n)-[r:R]->(m) RETURN * limit 50" :"match p = (n)-[*1..3]->(m) where n.name =~ '.*"+name+".*' return p";
        try {
			viz.clearNetwork()
            viz.reinit(config)
            viz.render()
        }catch(err){
            alert('cypher语句有误，请检查')
        }
    });
    $(".btn_close").click(function (e) {
        e.preventDefault();
        viz.clearNetwork()
    });

})