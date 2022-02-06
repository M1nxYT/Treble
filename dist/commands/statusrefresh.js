"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const { SlashCommandBuilder } = require('@discordjs/builders'); // discord js slash command builder
exports.status = {
    name: 'status',
    description: 'Check Status!',
    data: new SlashCommandBuilder().setName('status').setDescription('Check Status!'),
    ephemeral: false,
    async execute(interaction, client) {
        var _a;
        (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`music in ${client.subscriptions.size} servers`, { type: "LISTENING", });
        interaction.followUp({ content: `Current Status: Playing music in ${client.subscriptions.size} servers` });
    }
};
//# sourceMappingURL=statusrefresh.js.map