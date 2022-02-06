"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = void 0;
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.stop = {
    name: 'stop',
    description: 'Stop playback!',
    data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback!'),
    ephemeral: false,
    async execute(interaction, client) {
        var _a;
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription && subscription.voiceConnection) {
            try {
                subscription.voiceConnection.destroy();
                client.subscriptions.delete(interaction.guildId);
            }
            catch (err) { }
            (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
            await interaction.followUp({ content: `Stopped Playback!`, ephemeral: false });
        }
        else {
            await interaction.followUp('Not playing in this server!');
        }
    }
};
//# sourceMappingURL=stop.js.map