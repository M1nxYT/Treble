import { play } from './play';
import { pause } from './pause';
import { resume } from './resume';
import { skip } from './skip';
import { stop } from './stop';
import { queue } from './queue';
import { loop } from './loop';
import { nowplaying } from './nowplaying';
import { test } from './test';
import { lyrics } from './lyrics';
import { ping } from './ping';
import { uptime } from './uptime';
import { status } from './statusrefresh';

export let commands = [
    play,
    pause,
    resume,
    skip,
    stop,
    queue,
    loop,
    nowplaying,
    lyrics,
    test,
    ping,
    uptime,
    status
]