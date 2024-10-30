var dgram = require("dgram");
 
var udpServer = dgram.createSocket("udp4");
 
var rxPort, rxAddress;
udpServer.on("error", function(error){
    console.log(`服务器异常：\n${err.stack}`);
    server.close();
});
 
udpServer.on("message", function(message, rxinfo){
    console.log(`服务器接收到来自 ${rxinfo.address}:${rxinfo.port} 的 ${message}`);
    rxAddress = rxinfo.address;
    rxPort = rxinfo.port;
    udpServer.send("收到消息后返回", rxinfo.port, rxinfo.address)
});
 
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