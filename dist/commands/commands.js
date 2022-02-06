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
const lyrics_1 = require("./lyrics");
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
]; // removed ping, test, uptime and status for now
//# sourceMappingURL=commands.js.map