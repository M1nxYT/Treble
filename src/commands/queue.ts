import { customClient } from "../bot";
import { Track } from "../classes/track";
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let queue = {
    name: 'queue',
    description: 'Display the playback queue!',
    data: new SlashCommandBuilder().setName('queue').setDescription('Display the playback queue!'),
    ephemeral: false,
    
    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);
        // Print out the current queue, including up to the next 5 tracks to be played.
        if (subscription) {
            const queue = subscription.queue.slice(0, 5).map((track: Track, index: number) => `${index + 1}. ${track.title}`).join('\n');

            const nowPlayingEmbed = new MessageEmbed()
                .setColor('#ffffff')
                .setTitle('Queue')
                .setDescription(queue)
                .setFooter(`${subscription.queue.length} Total in queue!`, 'https://i.imgur.com/v2zMp3T.png')

            if (queue.length > 0) {
                await interaction.followUp({ embeds: [nowPlayingEmbed] });
            } else {
                await interaction.followUp(`No items in queue`);
            }
        } else {
            await interaction.followUp('Not playing in this server!');
        }
    }
}