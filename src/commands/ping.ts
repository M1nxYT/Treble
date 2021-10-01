import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { customClient } from "../bot";
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let ping = {
    name: 'ping',
    description: 'Ping Pong!',
    data: new SlashCommandBuilder().setName('ping').setDescription('Check the bot\'s ping'),
    ephemeral: false,
    deferReply: false,
    
    async execute(interaction: CommandInteraction, client: customClient) {
        interaction.reply({content: `Current Ping: ${Math.round(client.ws.ping)}ms`})
    }
}