let mqttUrl;
let mqttOptions;

function createMQTTClient() {
  const hostname = window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttUrl();
  const port = window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttPort();

  mqttUrl = `wss://${hostname}:${port}/mqtt`

  const clientId = "clientId_" + Math.random().toString(36).substring(2, 15);
  mqttOptions = {
    clientId: clientId,
    clean: true, // clean session
    connectTimeout: 30_000,
    username: window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttUserName(),
    password: window.composeApp.com.gsb.vyapar.bhagya.mqtt.getMqttPassword()
  };
}

function connect() {
  if (!window.mqttClient) {
    if (!mqttUrl || !mqttOptions) {
      createMQTTClient();
    }

    const client = mqtt.connect(mqttUrl, mqttOptions);

    client.on('connect', () => {
      console.log('Connected');
      window.composeApp.com.gsb.vyapar.bhagya.mqtt.connectComplete();
    });

    const handleDisconnect = (err) => {
      const msg = err?.message || 'Connection lost';
      console.log('Connection lost:', msg);
      window.composeApp.com.gsb.vyapar.bhagya.mqtt.connectionLost(msg);
    };
    client.on('close', handleDisconnect);
    client.on('error', handleDisconnect);

    client.on('message', (topic, payload) => {
      console.log('onMessageArrived:', payload.toString());
      window.composeApp.com.gsb.vyapar.bhagya.mqtt.messageArrived(
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
        if (err) {
          console.error('Subscription failed', err);
        } else {
          console.log('Subscription successful', granted);
        }
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