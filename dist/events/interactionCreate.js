"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionCreate = void 0;
exports.interactionCreate = {
    name: 'interactionCreate',
    once: false,
    async execute(args, client) {
        let interaction = args[0];
        if (!interaction.isCommand() || !interaction.guildId)
            return;
        const command = client.commands.get(interaction.commandName);
        if (command) {
            if (command.deferReply == false) {
                command.execute(interaction, client);
            }
            else {
                interaction.deferReply({ ephemeral: command.ephemeral ? command.ephemeral : false });
                command.execute(interaction, client);
            }
        }
        else {
            interaction.deferReply();
            interaction.followUp('That command could not be loaded or found!');
        }
    }
};
//# sourceMappingURL=interactionCreate.js.map