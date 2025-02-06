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