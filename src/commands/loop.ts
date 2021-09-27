import { customClient } from "../bot";
import { MusicSubscription } from "../classes/subscription";
import { Track } from '../classes/track';
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let loop = {
    name: 'loop',
    description: 'Repeats the currently playing song!',
    data: new SlashCommandBuilder().setName('loop').setDescription('Repeats the currently playing song!'),
    ephemeral: false,
    
    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);

        if(!subscription){ return await interaction.followUp('Not playing in this server!'); }

        if (subscription.audioPlayer.state.status === AudioPlayerStatus.Playing) {

            let url = (subscription.audioPlayer.state.resource)?.metadata.url || undefined

            if(url == undefined){return await interaction.followUp('An error has occurred!')}

            if (subscription.isLooped && subscription.queue[0]) {
                let song = (subscription.audioPlayer.state.resource).metadata.url
                let nextsong = subscription.queue[0].url

                if(song === nextsong){
                    subscription.queue.shift();
                }
                subscription.isLooped = false
                await interaction.followUp({ content: `Loop Disabled!`, ephemeral: false });
            }
            else {
                const track = await Track.from(url, interaction, client);
                subscription.enqueue(track);
                subscription.isLooped = true
                await interaction.followUp({ content: `Loop Enabled!`, ephemeral: false });
            }

        } else {
            await interaction.followUp('Not playing in this server!');
        }
    }
}