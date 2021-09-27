const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const fs = require('fs');
const rest = new REST().setToken(process.env.TOKEN);
import { commands as slashcommands } from './commands/commands';

// Place your client and guild ids here
const clientId = '879049766426787850';
const commands = [];
let command: any;

for (command of slashcommands) {
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), { body: commands },);

        console.log('Successfully reloaded application (/) commands.');

    } catch (error) {
        console.error(error);
    }
})();