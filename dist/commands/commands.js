"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const play_1 = require("./play");
const pause_1 = require("./pause");
const resume_1 = require("./resume");
const skip_1 = require("./skip");
const stop_1 = require("./stop");
const queue_1 = require("./queue");
const loop_1 = require("./loop");
const nowplaying_1 = require("./nowplaying");
const test_1 = require("./test");
const lyrics_1 = require("./lyrics");
const ping_1 = require("./ping");
const uptime_1 = require("./uptime");
const statusrefresh_1 = require("./statusrefresh");
exports.commands = [
    play_1.play,
    pause_1.pause,
    resume_1.resume,
    skip_1.skip,
    stop_1.stop,
    queue_1.queue,
    loop_1.loop,
    nowplaying_1.nowplaying,
    lyrics_1.lyrics,
    test_1.test,
    ping_1.ping,
    uptime_1.uptime,
    statusrefresh_1.status
];
//# sourceMappingURL=commands.js.map