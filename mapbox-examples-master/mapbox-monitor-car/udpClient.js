var dgram = require("dgram");
 
var udpClient = dgram.createSocket("udp4");
global.lng1 = 121.29734
global.lat1 = 31.068249
global.lng2 = 121.29734
global.lat2 = 31.068249

setInterval(()=>{
  global.lng1 += Math.random()*0.001;
  global.lng2 += Math.random()*0.005;
  let data = {
    spoofingFlag:Math.random() >0.5 ? 0:1,
    predictionLongitude:global.lng1,
    predictionLatitude:31.35761,
    radius: 0.4,
    speed: Math.random()*100,
    Utc_timeStamp: Date.parse(new Date()),
    receiverLongitude:global.lng2,
    receiverLatitude:31.35761
  }
  udpClient.send(JSON.stringify(data),"41234","localhost");
},3000)
process.stdin.on("data", function(data){
    udpClient.send(data, "41234", "localhost")
})
 
udpClient.on("message", function(message, rxinfo){
    console.log(`服务器接收到来自 ${rxinfo.address}:${rxinfo.port} 的 ${message}`);
    //udpClient.send("收到消息后返回", rxinfo.port, rxinfo.address)
});
 
udpClient.on('listening', () => {
    const address = udpClient.address();
    console.log(`服务器监听 ${address.address}:${address.port}`);
});
//udpClient.bind(41239);