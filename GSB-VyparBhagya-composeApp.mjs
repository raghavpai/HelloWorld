
import * as Li9za2lrby5tanM from './skiko.mjs';
import { instantiate } from './GSB-VyparBhagya-composeApp.uninstantiated.mjs';
import "./custom-formatters.js"

const exports = (await instantiate({
    './skiko.mjs': Li9za2lrby5tanM
})).exports;

export const {
connectionLost,
messageArrived,
connectComplete,
getMqttUrl,
getMqttPort,
getMqttUserName,
getMqttPassword,
memory,
_initialize
} = exports


