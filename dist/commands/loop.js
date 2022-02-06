"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const track_1 = require("../classes/track");
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.loop = {
    name: 'loop',
    description: 'Repeats the currently playing song!',
    data: new SlashCommandBuilder().setName('loop').setDescription('Repeats the currently playing song!'),
    ephemeral: false,
    async execute(interaction, client) {
        var _a;
        let subscription = client.subscriptions.get(interaction.guildId);
        if (!subscription) {
            return await interaction.followUp('Not playing in this server!');
        }
        if (subscription.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            let url = ((_a = (subscription.audioPlayer.state.resource)) === null || _a === void 0 ? void 0 : _a.metadata.url) || undefined;
            if (url == undefined) {
                return await interaction.followUp('An error has occurred!');
            }
            if (subscription.isLooped && subscription.queue[0]) {
                let song = (subscription.audioPlayer.state.resource).metadata.url;
                let nextsong = subscription.queue[0].url;
                if (song === nextsong) {
                    subscription.queue.shift();
                }
                subscription.isLooped = false;
                await interaction.followUp({ content: `Loop Disabled!`, ephemeral: false });
            }
            else {
                const track = await track_1.Track.from(url, interaction, client);
                subscription.enqueue(track);
                subscription.isLooped = true;
                await interaction.followUp({ content: `Loop Enabled!`, ephemeral: false });
            }
        }
        else {
            await interaction.followUp('Not playing in this server!');
        }
    }
};
//# sourceMappingURL=loop.js.map