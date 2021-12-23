import { customClient } from "../bot";
const { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js'); // discord js
const { AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice'); // discord js voice
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
const { getColorFromURL } = require('color-thief-node'); // get color from image url
const Spotify = require('node-spotify-api') // spotify search
const yts = require('yt-search') // youtube search
const ytdl = require('ytdl-core'); // fetches audio info
const { MusicSubscription } = require('../classes/subscription.js'); // music subs
import { Track } from '../classes/track';

export let play = {
    name: 'play',
    description: 'Play a Song!',
    data: new SlashCommandBuilder().setName('play').setDescription('Play a Song!').addStringOption((option: any) => option.setName('song').setDescription('Url or Song Name').setRequired(true)),
    ephemeral: true,
    
    async execute(interaction: any, client: customClient) {

        const spotify = new Spotify(client.spotifyCredentials)
        const url = interaction.options.get('song').value.replace('https://open', 'https://api').replace('/track', '/v1/tracks').replace('/playlist', '/v1/playlists').replace('/album', '/v1/albums')
        let subscription = client.subscriptions.get(interaction.guildId);

        if (!subscription) {
            if (interaction.member.voice.channel) {
                const channel = interaction.member.voice.channel; // get voice channel
                subscription = new MusicSubscription(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator, // no idea what the fuck this is
                    }),
                );
                subscription.voiceConnection.on('error', console.warn);
                client.subscriptions.set(interaction.guildId, subscription);
                client.user?.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });

                subscription.timeout = setTimeout(function () {
                    if (subscription.queue.length == 0 && subscription.audioPlayer.state.status != AudioPlayerStatus.Playing) {
                        try {
                            subscription.voiceConnection.destroy();
                            client.subscriptions.delete(interaction.guildId);
                            interaction.followUp('Left voice channel due to lack of music playing!')
                        } catch (err) { }
                        client.user?.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
                    }
                }, 20000);
            }
        }
        if (!subscription) {
            return await interaction.followUp('Join a voice channel and then try that again!');
        }

        try {
            await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3); // what the fuck is 20e3
        } catch (error) {
            console.warn(error);
            await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
            return;
        }

        if (url.includes('radio')) { // if youtube radio link
            return await interaction.followUp('Youtube Radio mixes are not supported!');
        } else if (url.includes('spotify') && url.includes('show')) { // if youtube radio link
            return await interaction.followUp('Spotify Podcats are not supported yet!');
        } else if (ytdl.validateURL(url) && url.includes('list')) { // if youtube playlist
            const list = await yts({ listId: url.split('&list=')[1] })
            let videos = list.videos.slice(0, 20)
            for (let video in videos) {
                try {
                    const track = await Track.from(`https://www.youtube.com/watch?v=${list.videos[video].videoId}`, interaction, client);
                    subscription.enqueue(track);
                } catch (err) { }
            }
        } else if (url.includes('spotify') && url.includes('list')) { // if spotify playlist
            let playlist = await spotify.request(url.split('?')[0])
            try {
                const playlistEmbed = new MessageEmbed()
                    .setTitle(playlist.name || "Not Found!")
                    .setURL(playlist.external_urls.spotify || "Not Found!")
                    .setAuthor(`${playlist.owner.display_name}`)
                    .setDescription(playlist.description)
                    .setThumbnail(playlist.images[0].url || 'https://i.imgur.com/BUztXex.png')
                    .setTimestamp()
                    .setFooter('Spotify', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png');

                try {
                    let extractColor = await getColorFromURL(playlist.images[0].url || 'https://i.imgur.com/BUztXex.png');
                    playlistEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
                } catch (err) {
                    console.log(err)
                    playlistEmbed.setColor('#ffffff');
                }

                interaction.followUp({ embeds: [playlistEmbed] });
            } catch (err) { console.log(err) }
            if (playlist.tracks) {
                let songs = playlist.tracks.items.slice(0, 20)
                for (let song in songs) {
                    let spotifyInfo = songs[song].track

                    let artists = '';

                    if (spotifyInfo.album.artists.length != 1) {
                        var a: any[] = [];
                        for (let i in spotifyInfo.album.artists) {
                            a[parseInt(i)] = spotifyInfo.album.artists[parseInt(i)].name;
                        }
                        artists = a.join(', ')
                    } else { artists = spotifyInfo.album.artists[0].name; }

                    const url = await (await yts(`${spotifyInfo.name} - ${artists} `)).videos[0].url
                    const track = await Track.from(url, interaction, client);
                    subscription.enqueue(track);
                }

            } else {
                try { return interaction.followUp({ content: 'Content not queued, please try again later!', ephemeral: true }); } catch (err) { }
            }



        } else if (url.includes('spotify') && url.includes('album')) { // if spotify album
            try {
                let album = await spotify.request(url.split('?')[0])

                const albumEmbed = new MessageEmbed()
                    //.setColor(dominentColor)
                    .setTitle(album.name || "Not Found!")
                    .setURL(album.external_urls.spotify || "Not Found!")
                    .setAuthor(`${album.artists[0].name} - ${album.release_date}`)
                    .setThumbnail(album.images[0].url || 'https://i.imgur.com/BUztXex.png')
                    .setTimestamp()
                    .setFooter('Spotify', 'https://cdn.exerra.xyz/files/png/companies/spotify/240px-Spotify_logo_without_text.png');

                try {
                    let extractColor = await getColorFromURL(album.images[0].url || 'https://i.imgur.com/BUztXex.png');
                    albumEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
                } catch (err) {
                    console.log(err)
                    albumEmbed.setColor('#ffffff');
                }

                interaction.followUp({ embeds: [albumEmbed] });

                if (album.tracks) {
                    let songs = album.tracks.items.slice(0, 20)
                    for (let song in songs) {
                        let spotifyInfo = await songs[song]

                        let artists = '';

                        if (spotifyInfo.artists.length != 1) {
                            var a = [];
                            for (let i in spotifyInfo.artists) {
                                a[parseInt(i)] = spotifyInfo.artists[parseInt(i)].name;
                            }
                            artists = a.join(', ')
                        } else { artists = spotifyInfo.artists[0].name; }

                        const url = await (await yts(`${spotifyInfo.name} - ${artists} `)).videos[0].url

                        const track = await Track.from(url, interaction, client);
                        subscription.enqueue(track);
                    }

                } else {
                    try { return interaction.followUp({ content: 'Content not queued, please try again later!', ephemeral: true }); } catch (err) { }
                }
            } catch (err) { console.log(err) }

        } else if (ytdl.validateURL(url) && url.includes('watch')) { // check if youtube song link
            try {
                const track = await Track.from(url, interaction, client);
                subscription.enqueue(track);
            } catch (err) {
                console.log(err)
                return interaction.followUp({ content: 'Content not queued, please try again later!', ephemeral: true });
            }

            await interaction.followUp({ content: 'Queued!', ephemeral: true });

        } else if (url.includes('spotify') && url.includes('tracks')) { // check if spotify song link

            const spotifyInfo = await spotify.request(url.split('?')[0])
            let artists = '';

            if (spotifyInfo.album.artists.length != 1) {
                var a = [];
                for (let i in spotifyInfo.album.artists) {
                    a[parseInt(i)] = spotifyInfo.album.artists[parseInt(i)].name;
                }
                artists = a.join(', ')
            } else { artists = spotifyInfo.album.artists[0].name; }


            const r = await yts(`${spotifyInfo.name} - ${artists} `)
            const videos = r.videos.slice(0, 5)
            let results = new Array;


            await videos.forEach((video: any) => { // type declarations silly champ
                results.push({
                    label: video.title,
                    description: ` - ${video.author.name}`,
                    value: video.url
                })
            });

            if (videos.length == 0) {
                await interaction.followUp({ content: 'Queued:', ephemeral: false });
                return
            }

            const response = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('search')
                    .setPlaceholder('No song selected')
                    .addOptions(results),
            );

            await interaction.followUp({ content: 'Results From Spotify Link!', components: [response], ephemeral: false });

        } else { // If not any of the above just youtube search it
            const r = await yts(url)
            const videos = r.videos.slice(0, 5)

            let results = new Array;

            await videos.forEach((video: any) => { // type declarations silly champ
                results.push({
                    label: video.title,
                    description: ` - ${video.author.name}`,
                    value: video.url
                })
            });

            if (videos.length == 0) {
                await interaction.followUp({ content: 'No Results Found!', ephemeral: false });
                return
            }

            const response = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('search')
                    .setPlaceholder('No song selected')
                    .addOptions(results),
            );

            await interaction.followUp({ content: 'Results From Youtube Search!', components: [response], ephemeral: true });
        }
    }
}