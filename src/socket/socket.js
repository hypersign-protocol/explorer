this.connection = new WebSocket(this.$config.websocketUrl);

this.connection.onopen = function() {
    console.log("Socket connection is open");
};

this.connection.onmessage = function({ data }) {
    console.log("Websocket connection  data", data);
};
this.connection.onerror = function(error) {
    console.log("Websocket connection error ", error);
};
class HIDSocket {

}