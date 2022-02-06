"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const fs = require('fs');
const rest = new REST().setToken(process.env.TOKEN);
const commands_1 = require("./commands/commands");
// Place your client and guild ids here
const clientId = '879049766426787850';
const commands = [];
let command;
for (command of commands_1.commands) {
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
})();
//# sourceMappingURL=deploy.js.map