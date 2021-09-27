import { customClient } from "../bot";
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
const { getColorFromURL } = require('color-thief-node'); // get color from image url

export let nowplaying = {
    name: 'nowplaying',
    description: 'Get information about currently playing song!',
    data: new SlashCommandBuilder().setName('nowplaying').setDescription('Get information about currently playing song!'),
    ephemeral: true,
    
    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);

        if (subscription) {
            if (subscription.audioPlayer.state.status === AudioPlayerStatus.Playing) {
                let song = (subscription.audioPlayer.state.resource).metadata.details

                let imageForColor = song.thumbnails.filter((thumbnail: { url: string | string[]; }) => thumbnail.url.includes('.jpg'))


                const nowPlayingEmbed = new MessageEmbed()
                    .setTitle(song.title || "Not Found!")
                    .setURL(song.video_url || "Not Found!")
                    .setAuthor(song.author.name || "Not Found!")
                    .setThumbnail(song.thumbnails[song.thumbnails.length - 1].url)
                    .setTimestamp()
                    .addField('Duration', client.secondsToHms(song.lengthSeconds) || "Not Found!", true)
                    .addField('Upload Date', song.publishDate || "Not Found!", true)
                    .addField('Views', song.viewCount || "Not Found!", true)
                    .addField('Likes', song.likes.toString() || "Not Found!", true)
                    .addField('Dislikes', song.dislikes.toString() || "Not Found!", true)
                    .addField('Rating', Math.floor(song.averageRating / 5 * 100).toString() + '%' || "Not Found!", true)
                    .setFooter('Youtube', 'https://i.imgur.com/v2zMp3T.png');

                try {
                    let extractColor = await getColorFromURL(imageForColor[imageForColor.length - 1].url.split('?')[0]);
                    nowPlayingEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
                } catch (err) {
                    console.log(err)
                    nowPlayingEmbed.setColor('#ffffff');
                }

                await interaction.followUp({ embeds: [nowPlayingEmbed] });

            } else {
                await interaction.followUp({ content: `No song is currently playing!`, ephemeral: true });
            }
        } else {
            await interaction.followUp('Not playing in this server!');
        }

    }
}