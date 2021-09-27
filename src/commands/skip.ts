import { customClient } from "../bot";
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let skip = {
    name: 'skip',
    description: 'Skip the currently playing Song!',
    data: new SlashCommandBuilder().setName('skip').setDescription('Skip the currently playing Song!'),
    ephemeral: false,
    
    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            subscription.audioPlayer.stop();
            await interaction.followUp({ content: `Skipped Song!`, ephemeral: false });
        } else {
            await interaction.followUp('Not playing in this server!');
        }
    }
}