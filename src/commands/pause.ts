import { customClient } from "../bot";
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let pause = {
    name: 'pause',
    description: 'Pause playback!',
    data: new SlashCommandBuilder().setName('pause').setDescription('Pause playback!'),
    ephemeral: false,
    
    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            subscription.audioPlayer.pause();
            await interaction.followUp({ content: `Paused Playback!`, ephemeral: false });
        } else {
            await interaction.followUp('Not playing in this server!');
        }
    }
}