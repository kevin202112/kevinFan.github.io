const socket = io();
var mySocketId = "";
function socketInit(){
    socket.emit('idGet');

    socket.on("message", function(data) {
        chatVue.recive(data);
    });
    socket.on("connection", function(data) {
        mySocketId = data;
    });

    socket.on("recivePlayerData", function(data) {
        recivePlayerData(data);
    });
}
