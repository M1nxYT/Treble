"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customClient = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const voice_1 = require("@discordjs/voice");
const track_1 = require("./classes/track");
const subscription_1 = require("./classes/subscription");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const yts = require('yt-search');
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const models = __importStar(require("./classes/models"));
const express_1 = __importDefault(require("express"));
dotenv.config();
class customClient extends discord_js_1.default.Client {
}
exports.customClient = customClient;
const client = new customClient({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
    allowedMentions: { parse: ['users'] }
});
client.db = mongoose_1.default.connection;
if (process.env['MONGODB']) {
    mongoose_1.default.connect(process.env['MONGODB']);
}
client.app = (0, express_1.default)();
client.db.on('error', console.error.bind(console, 'connection error:'));
client.models = models;
const events_1 = require("./events/events");
for (const event of events_1.events) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute([...args], client));
    }
    else {
        client.on(event.name, (...args) => event.execute([...args], client));
    }
}
const commands_1 = require("./commands/commands");
client.commands = new discord_js_1.default.Collection();
for (const command of commands_1.commands) {
    client.commands.set(command.name, command);
}
;
client.subscriptions = new Map();
client.spotifyCredentials = { id: process.env.SPOTIFY_ID, secret: process.env.SPOTIFY_SECRET };
client.secondsToHms = function (d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
};
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
client.rgbToHex = (r, g, b) => {
    let dominentColor = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    let embedColor = parseInt(dominentColor.replace('#', '0x'));
    return embedColor;
};
client.on('interactionCreate', async (interaction) => {
    var _a, _b;
    if (!interaction.isSelectMenu() || !interaction.guildId)
        return;
    let subscription = client.subscriptions.get(interaction.guildId);
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
    // Remove the components from the message
    interaction.update({
        content: "Song will now be queued",
        components: []
    });
    let url = interaction.values[0];
    if (!ytdl_core_1.default.validateURL(url)) {
        await interaction.followUp('Could not add that song to the queue');
        return;
    }
    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
        if (interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel) {
            const channel = interaction.member.voice.channel;
            subscription = new subscription_1.MusicSubscription((0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator, // no idea what the fuck this is
            }));
            subscription.voiceConnection.on('error', console.warn);
            client.subscriptions.set(interaction.guildId, subscription);
            (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
        }
    }
    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
        await interaction.followUp('Join a voice channel and then try that again!');
        return;
    }
    // Make sure the connection is ready before processing the user's request
    try {
        await (0, voice_1.entersState)(subscription.voiceConnection, voice_1.VoiceConnectionStatus.Ready, 20e3); // what the fuck is 20e3
    }
    catch (error) {
        console.warn(error);
        await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
        return;
    }
    try {
        // Attempt to create a Track from the user's video URL
        const track = await track_1.Track.from(url, interaction, client);
        // Enqueue the track and reply a success message to the user
        subscription.enqueue(track);
        await interaction.followUp(`Enqueued **${track.title}**`);
        console.log(`${track.title} Added to queue`);
    }
    catch (error) {
        console.warn(error);
        await interaction.reply('Failed to play track, please try again later!');
    }
});
client.on('error', console.warn);
void client.login(process.env.TOKEN);
//# sourceMappingURL=bot.js.map