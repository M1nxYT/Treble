import Discord, { CommandInteraction } from 'discord.js';
import { customClient } from '../bot';

export let interactionCreate = {
    name: 'interactionCreate',
    once: false,
    async execute(args: any[], client: customClient) {
        let interaction: CommandInteraction = args[0];
        if (!interaction.isCommand() || !interaction.guildId) return;
        const command = client.commands.get(interaction.commandName);

        if (command) {
            if (command.deferReply == false) {
                command.execute(interaction, client);
            } else {
                interaction.deferReply({ ephemeral: command.ephemeral ? command.ephemeral : false });
                command.execute(interaction, client);
            }
        }
        else {
            interaction.deferReply();
            interaction.followUp('That command could not be loaded or found!')
        }
    }
}