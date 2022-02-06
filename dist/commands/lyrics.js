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
exports.lyrics = void 0;
const genius_lyrics_1 = __importDefault(require("genius-lyrics"));
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const { getColorFromURL } = require('color-thief-node'); // get color from image url
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
const dotenv = __importStar(require("dotenv")); // Load Env
dotenv.config();
const genius = new genius_lyrics_1.default.Client(process.env['GENIUS_TOKEN']);
exports.lyrics = {
    name: 'lyrics',
    description: 'Display Lyrics of current playing song!',
    data: new SlashCommandBuilder().setName('lyrics').setDescription('Display Lyrics of current playing song!'),
    ephemeral: false,
    async execute(interaction, client) {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            if (subscription.audioPlayer.state.status == voice_1.AudioPlayerStatus.Playing) {
                let input = (subscription.audioPlayer.state.resource).metadata.details;
                try {
                    const searches = await genius.songs.search(input.title.replace('Official Video', '').replace('Music Video', ''));
                    const song = searches[0];
                    if (song) {
                        const lyricsEmbed = new discord_js_1.MessageEmbed()
                            .setTitle(song.title || "Not Found!")
                            .setURL(song.url || "Not Found!")
                            .setAuthor(song.artist.name || "Not Found!")
                            .setThumbnail(song.thumbnail)
                            .setTimestamp()
                            .setFooter('Genius', 'https://i.imgur.com/R1pX0eH.png');
                        try {
                            let extractColor = await getColorFromURL(song.thumbnail.split('?')[0]);
                            lyricsEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
                        }
                        catch (err) {
                            console.log(err);
                            lyricsEmbed.setColor('#ffffff');
                        }
                        interaction.followUp({ content: 'Lyrics Found', embeds: [lyricsEmbed] });
                    }
                }
                catch (err) {
                    interaction.followUp('No results found!');
                }
            }
            else {
                await interaction.followUp({ content: `No song is currently playing!` });
            }
        }
        else {
            await interaction.followUp({ content: `No song is currently playing!` });
        }
    }
};
//# sourceMappingURL=lyrics.js.map