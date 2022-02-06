"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resume = void 0;
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.resume = {
    name: 'resume',
    description: 'Resume playback!',
    data: new SlashCommandBuilder().setName('resume').setDescription('Resume playback!'),
    ephemeral: false,
    async execute(interaction, client) {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            subscription.audioPlayer.unpause();
            await interaction.followUp({ content: `Resumed Playback!`, ephemeral: false });
        }
        else {
            await interaction.followUp('Not playing in this server!');
        }
    }
};
//# sourceMappingURL=resume.js.map