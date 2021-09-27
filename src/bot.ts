import Discord, { Interaction, GuildMember, Snowflake, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel, Intents } from 'discord.js';
import { AudioPlayerStatus, AudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { Track } from './classes/track';
import { MusicSubscription } from './classes/subscription';
import ytdl from 'ytdl-core';
const yts = require('yt-search');
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import mongoose from 'mongoose';
import * as models from './classes/models';
dotenv.config();

export class customClient extends Discord.Client {
	spotifyCredentials: any;
	subscriptions: any;
	commands: any;
	secondsToHms: any;
	rgbToHex: any;
	db!: mongoose.Connection;
	models!: typeof models;
}

const client = new customClient({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
	allowedMentions: { parse: ['users'] }
});

client.db = mongoose.connection;
if (process.env['MONGODB']) {
	mongoose.connect(process.env['MONGODB']);
}

client.db.on('error', console.error.bind(console, 'connection error:'));
client.models = models;


import { events } from './events/events';
for (const event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute([...args], client));
	} else {
		client.on(event.name, (...args) => event.execute([...args], client));
	}
}

import { commands } from './commands/commands';
client.commands = new Discord.Collection();
for (const command of commands) {
	client.commands.set(command.name, command);
};

client.subscriptions = new Map<Snowflake, MusicSubscription>();
client.spotifyCredentials = { id: process.env.SPOTIFY_ID, secret: process.env.SPOTIFY_SECRET }


client.secondsToHms = function (d: number) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);

	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return hDisplay + mDisplay + sDisplay;
}
function componentToHex(c: number) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

client.rgbToHex = (r: number, g: number, b: number) => {
	let dominentColor = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	let embedColor = parseInt(dominentColor.replace('#', '0x'))
	return embedColor
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu() || !interaction.guildId) return;
	let subscription = client.subscriptions.get(interaction.guildId);

	client.user?.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });

	// Remove the components from the message
	interaction.update({
		content: "Song will now be queued",
		components: []
	})

	let url = interaction.values[0];


	if (!ytdl.validateURL(url)) {
		await interaction.followUp('Could not add that song to the queue');
		return;
	}
	// If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
	// and create a subscription.
	if (!subscription) {
		if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
			const channel = interaction.member.voice.channel;
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
		}
	}

	// If there is no subscription, tell the user they need to join a channel.
	if (!subscription) {
		await interaction.followUp('Join a voice channel and then try that again!');
		return;
	}

	// Make sure the connection is ready before processing the user's request
	try {
		await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3); // what the fuck is 20e3
	} catch (error) {
		console.warn(error);
		await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
		return;
	}

	try {
		// Attempt to create a Track from the user's video URL
		const track = await Track.from(url, interaction, client);
		// Enqueue the track and reply a success message to the user
		subscription.enqueue(track);
		await interaction.followUp(`Enqueued **${track.title}**`);
		console.log(`${track.title} Added to queue`)
	} catch (error) {
		console.warn(error);
		await interaction.reply('Failed to play track, please try again later!');
	}

});

client.on('error', console.warn);

void client.login(process.env.TOKEN);