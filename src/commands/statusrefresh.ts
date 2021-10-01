import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { customClient } from "../bot";
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder

export let status = {
    name: 'status',
    description: 'Check Status!',
    data: new SlashCommandBuilder().setName('status').setDescription('Check Status!'),
    ephemeral: false,
    
    async execute(interaction: CommandInteraction, client: customClient) {
        client.user?.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
        interaction.followUp({content: `Current Status: Playing music in ${client.subscriptions.size} servers`})
    }
}