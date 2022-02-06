"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uptime = void 0;
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.uptime = {
    name: 'uptime',
    description: 'Display Uptime!',
    data: new SlashCommandBuilder().setName('uptime').setDescription('Display Uptime!'),
    ephemeral: false,
    async execute(interaction, client) {
        interaction.followUp({ content: `Current Uptime: ${client.secondsToHms(Math.floor(process.uptime()))}` });
    }
};
//# sourceMappingURL=uptime.js.map