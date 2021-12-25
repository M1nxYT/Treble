import { getInfo } from 'ytdl-core';
import Discord, { MessageEmbed } from 'discord.js';
import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { raw as ytdl } from 'youtube-dl-exec';
const { getColorFromURL } = require('color-thief-node'); // get color from image url
import { customClient } from '../bot';

export interface TrackData {
	url: string;
	title: string;
	details: any;
	onStart: () => void;
	onFinish: () => void;
	onError: (error: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */


export class Track implements TrackData {
	public readonly url: string;
	public readonly title: string;
	public readonly details: any;
	public readonly onStart: () => void;
	public readonly onFinish: () => void;
	public readonly onError: (error: Error) => void;

	private constructor({ url, title, details, onStart, onFinish, onError }: TrackData) {
		this.url = url;
		this.title = title;
		this.details = details;
		this.onStart = onStart;
		this.onFinish = onFinish;
		this.onError = onError;
	}

	/**
	 * Creates an AudioResource from this Track.
	 */
	public createAudioResource(): Promise<AudioResource<Track>> {
		return new Promise((resolve, reject) => {
			const process = ytdl(
				this.url,
				{
					// @ts-ignore
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] },
			);
			if (!process.stdout) {
				reject(new Error('No stdout'));
				return;
			}
			const stream = process.stdout;
			const onError = (error: Error) => {
				if (!process.killed) process.kill();
				stream.resume();
				reject(error);
			};
			process
				.once('spawn', () => {
					demuxProbe(stream)
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
	}

	/**
	 * Creates a Track from a video URL and lifecycle callback methods.
	 *
	 * @param url The URL of the video
	 * @param interaction the interaction
	 * @param client the client
	 * @returns The created Track
	 */
	public static async from(url: string, interaction: any, client: customClient): Promise<Track> {
		const info = await getInfo(url);

		let methods = {
            async onStart() {
                let subscription = client.subscriptions.get(interaction.guildId);

				clearTimeout(subscription.timeout);

                if(!subscription){try { return await interaction.followUp({ content: `An error occurred, Try queue that song again!`, ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }}
                if(!subscription.audioPlayer){try { return await interaction.followUp({ content: `An error occurred, Try queue that song again!`, ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }}
                let song = (subscription.audioPlayer.state.resource).metadata.details

                let imageForColor = song.thumbnails.filter((thumbnail: { url: string | string[]; }) => thumbnail.url.includes('.jpg'))

                try {

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
                        //.addField('Dislikes', song.dislikes.toString() || "Not Found!", true)
                        .addField('Rating', Math.floor(song.averageRating / 5 * 100).toString() + '%' || "Not Found!", true)
                        .setFooter('Youtube', 'https://i.imgur.com/v2zMp3T.png');

					try {
						let extractColor = await getColorFromURL(imageForColor[imageForColor.length - 1].url.split('?')[0]);
						nowPlayingEmbed.setColor(client.rgbToHex(extractColor[0], extractColor[1], extractColor[2]));
					} catch (err) {
						console.log(err)
						nowPlayingEmbed.setColor('#ffffff');
					}

                    await interaction.followUp({ content: 'Now Playing!', embeds: [nowPlayingEmbed], ephemeral: false })

                } catch (err) { console.log(err) }
            },
            async onFinish() {
                let subscription = client.subscriptions.get(interaction.guildId);
                if(!subscription){try { return await interaction.followUp({ content: `An error occurred`, ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }}
                if(!subscription.audioPlayer){try { return await interaction.followUp({ content: `An error occurred`, ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }}
                if (subscription.queue.length == 0 && interaction.guildId && subscription.voiceConnection) {
                    try {
                        subscription.voiceConnection.destroy();
                        client.subscriptions.delete(interaction.guildId);
                    } catch (err) { }
                    client.user?.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
                    try { await interaction.followUp({ content: `Left channel, no songs left in queue!`, ephemeral: true }) } catch (err) { console.log(err) }
                } else {
                    try { await interaction.followUp({ content: 'Now finished!', ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }
                }
            },
            async onError(error: any) {
                console.warn(error);
                try { await interaction.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn) } catch (err) { console.log(err) }
            },
        }
		// The methods are wrapped so that we can ensure that they are only called once.
		const wrappedMethods = {
			onStart() {
				wrappedMethods.onStart = noop;
				methods.onStart();
			},
			onFinish() {
				wrappedMethods.onFinish = noop;
				methods.onFinish();
			},
			onError(error: Error) {
				wrappedMethods.onError = noop;
				methods.onError(error);
			},
		};

		return new Track({
			title: info.videoDetails.title,
			details: info.videoDetails,
			url,
			...wrappedMethods,
		});
	}
}
