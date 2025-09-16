let mqttUrl;
let mqttOptions;

function createMQTTClient() {
  const hostname = window.wasmModule.getMqttUrl();
  const port = window.wasmModule.getMqttPort();

  mqttUrl = `wss://${hostname}:${port}/mqtt`

  const clientId = "clientId_" + Math.random().toString(36).substring(2, 15);
  mqttOptions = {
    clientId: clientId,
    clean: true, // clean session
    connectTimeout: 30_000,
    username: window.wasmModule.getMqttUserName(),
    password: window.wasmModule.getMqttPassword()
  };
}

function connect() {
  if (!window.mqttClient) {
    if (!mqttUrl || !mqttOptions) {
      createMQTTClient();
    }

    const client = mqtt.connect(mqttUrl, mqttOptions);

    client.on('connect', () => {
      window.wasmModule.connectComplete();
    });

    const handleDisconnect = (err) => {
      const msg = err?.message || 'Connection lost';
      window.wasmModule.connectionLost(msg);
    };
    client.on('close', handleDisconnect);
    client.on('error', handleDisconnect);

    client.on('message', (topic, payload) => {
      window.wasmModule.messageArrived(
        topic,
        payload.toString()
      );
    });

    window.mqttClient = client;
  } else {
    window.mqttClient.reconnect();
  }
}

function disconnect() {
  if (window.mqttClient) {
    window.mqttClient.end();
  }
}

function publish(topic, message) {
  if (window.mqttClient) {
    window.mqttClient.publish(
      topic,
      message,
      { qos: 1 },
      (err) => {
        if (err) console.error('Publish failed:', err);
      }
    );
  }
}

function subscribe(topic) {
  if (window.mqttClient) {
    window.mqttClient.subscribe(
      topic,
      { qos: 1 },
      (err, granted) => {
        if (err) console.error('Subscription failed', err);
      }
    );
  }
}

function unsubscribe(topic) {
  if (window.mqttClient) {
    window.mqttClient.unsubscribe(topic, (err) => {
      if (err) console.error('Unsubscribe failed:', err);
    });
  }
}

