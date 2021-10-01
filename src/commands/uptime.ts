import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { customClient } from "../bot";
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let uptime = {
    name: 'uptime',
    description: 'Display Uptime!',
    data: new SlashCommandBuilder().setName('uptime').setDescription('Display Uptime!'),
    ephemeral: false,
    
    async execute(interaction: CommandInteraction, client: customClient) {
        interaction.followUp({content: `Current Uptime: ${client.secondsToHms(Math.floor(process.uptime()))}`})
    }
}