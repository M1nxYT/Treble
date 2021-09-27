import { customClient } from "../bot";
import Genius from "genius-lyrics";
import { MessageEmbed, MessageInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
const { getColorFromURL } = require('color-thief-node'); // get color from image url
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
import * as dotenv from 'dotenv'; // Load Env
dotenv.config();

const genius = new Genius.Client(process.env['GENIUS_TOKEN']);

export let lyrics = {
    name: 'lyrics',
    description: 'Display Lyrics of current playing song!',
    data: new SlashCommandBuilder().setName('lyrics').setDescription('Display Lyrics of current playing song!'),
    ephemeral: false,

    async execute(interaction: any, client: customClient) {
        let subscription = client.subscriptions.get(interaction.guildId);
        if (subscription) {
            if (subscription.audioPlayer.state.status == AudioPlayerStatus.Playing) {
                let input = (subscription.audioPlayer.state.resource).metadata.details

                try {
                    const searches = await genius.songs.search(input.title.replace('Official Video', '').replace('Music Video', ''));
                    const song = searches[0];

                    if (song) {
                        const lyricsEmbed = new MessageEmbed()
                            .setTitle(song.title || "Not Found!")
                            .setURL(song.url || "Not Found!")
                            .setAuthor(song.artist.name || "Not Found!")
                            .setThumbnail(song.thumbnail)
                            .setTimestamp()
                            .setFooter('Genius', 'https://i.imgur.com/R1pX0eH.png');

                        try {
                            let extractColor = await getColorFromURL(song.thumbnail.split('?')[0]);
                            lyricsEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
                        } catch (err) {
                            console.log(err)
                            lyricsEmbed.setColor('#ffffff');
                        }
                        interaction.followUp({ content: 'Lyrics Found', embeds: [lyricsEmbed] })
                    }
                }
                catch (err) {
                    interaction.followUp('No results found!')
                }

            }
            else { await interaction.followUp({ content: `No song is currently playing!` }); }
        }
        else { await interaction.followUp({ content: `No song is currently playing!` }); }
    }
}