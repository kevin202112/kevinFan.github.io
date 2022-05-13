var chatVue = new Vue({
	el: '#chat',
	data: {
        sendMessage: "",
        messages: [],
	},
	methods: {
        send: function(){
            if(this.sendMessage.length > 0){
                socket.emit("message", this.sendMessage);
                this.sendMessage = "";
            }
        },
        recive: function(message){
            this.messages.push(message);
            setTimeout(function(){
                var msgbox = document.getElementById('chatbox');
                msgbox.scrollTop = msgbox.scrollHeight;
            },100);
        },
        typeTest: function(data){
            if(data.from === mySocketId){
                return "msg-box-me";
            }else {
                return "msg-box-other";
            }
        }
	}
})
