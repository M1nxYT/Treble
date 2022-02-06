"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.ping = {
    name: 'ping',
    description: 'Ping Pong!',
    data: new SlashCommandBuilder().setName('ping').setDescription('Check the bot\'s ping'),
    ephemeral: false,
    async execute(interaction, client) {
        interaction.followUp({ content: `Current Ping: ${Math.round(client.ws.ping)}ms` });
    }
};
//# sourceMappingURL=ping.js.map