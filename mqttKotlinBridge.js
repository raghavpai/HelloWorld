function connect() {
    window.mqttClient.connect({ onSuccess: onConnect });
}

function disconnect() {
    window.mqttClient.disconnect();
}

function publish(topic, message) {
    window.mqttClient.send(topic, message, 1, false);
}

function subscribe(topic) {
    window.mqttClient.subscribe(topic, {
        qos: 1,
        onSuccess: function () {
            console.log("Subscription successful");
        },
        onFailure: function (err) {
            console.error("Subscription failed", err);
        }
    });
}

function unsubscribe(topic) {
    window.mqttClient.unsubscribe(topic);
}

function createMQTTClient() {
    const hostname = window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttUrl();
    const port = window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttPort();
    const clientId = "clientId_" + Math.random().toString(36).substring(2, 15);
    const client = new Paho.MQTT.Client(hostname, port, clientId);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    window.mqttClient = client
}

function onConnect() {
  console.log("onConnect");
  window.composeApp.com.gsb.vyapar.bhagya.mqtt.connectComplete();
}

function onConnectionLost(responseObject) {
  console.log("onConnectionLost: " + responseObject.errorMessage);
  window.composeApp.com.gsb.vyapar.bhagya.mqtt.connectionLost(responseObject.errorMessage)
}

function onMessageArrived(message) {
  console.log("onMessageArrived: " + message.payloadString);
  window.composeApp.com.gsb.vyapar.bhagya.mqtt.messageArrived(message.destinationName, message.payloadString)
}