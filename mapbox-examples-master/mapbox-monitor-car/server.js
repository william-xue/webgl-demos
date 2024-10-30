var express = require('express');
var app = express();

app.use(express.static(__dirname + ''));
app.get('/', function (req, res) {
    res.sendFile(__dirname+"/static/"+"index.html") 
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("app started at port 8081")

})

// udp 通信
var dgram = require("dgram");
 
var udpServer = dgram.createSocket("udp4");
 
var rxPort, rxAddress;
udpServer.on("error", function(error){
    console.log(`服务器异常：\n${err.stack}`);
    server.close();
});
 
/* udpServer.on("message", (message, rxinfo)=>{
    console.log(`服务器接收到来自 ${rxinfo.address}:${rxinfo.port} 的 ${message}`);
    rxAddress = rxinfo.address;
    rxPort = rxinfo.port;
    udpServer.send("收到消息后返回", rxinfo.port, rxinfo.address)
}); */
 
process.stdin.on("data", function(data){
    if(rxPort == undefined || rxAddress == undefined){
        console.log("未接收到客户端信息");
    }
    udpServer.send(data, rxPort, rxAddress);
});
 
udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`服务器监听 ${address.address}:${address.port}`);
});

udpServer.bind(41234);

// 建立了一个websocket
var ws = require("nodejs-websocket");
console.log("开始建立连接...")

ws.createServer(function(conn){
    udpServer.on("message", (message, rxinfo)=>{
      console.log(`服务器接收到来自 ${rxinfo.address}:${rxinfo.port} 的 ${message}`);
      rxAddress = rxinfo.address;
      rxPort = rxinfo.port;
      conn.sendText(message);
  
      udpServer.send("收到消息后返回"+message, rxinfo.port, rxinfo.address)
    });

    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8082)
console.log("WebSocket建立完毕")