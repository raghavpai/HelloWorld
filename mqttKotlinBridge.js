function connect() {
    window.mqttClient.connect({ onSuccess: onConnect });
}

function disconnect() {
    window.mqttClient.disconnect();
}

function publish(topic, message) {
    const payload = new Paho.MQTT.Message(topic);
    payload.destinationName = message;
    window.mqttClient.send(payload);
}

function subscribe(topic) {
    window.mqttClient.subscribe(topic);
}

function unsubscribe(topic) {
    window.mqttClient.unsubscribe(topic);
}