import Discord from 'discord.js';
import mongoose from 'mongoose';
import * as models from './classes/models';
export declare class customClient extends Discord.Client {
    spotifyCredentials: any;
    subscriptions: Map<any, any>;
    commands: any;
    secondsToHms: any;
    rgbToHex: any;
    db: mongoose.Connection;
    models: typeof models;
    app: any;
}
//# sourceMappingURL=bot.d.ts.map