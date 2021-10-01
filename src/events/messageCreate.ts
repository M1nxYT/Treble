import Discord, { Message } from 'discord.js';
import { customClient } from '../bot';

export let messageCreate = {
    name: 'messageCreate',
    once: false,
    async execute(args: any[], client: customClient) {
        let message: Message = args[0];
        if (!message.guild) return;

        let whitelist = ['719292655963734056', '293903980935774208']
        const commands = [];

        for(let commandName of client.commands){
            let command = client.commands.get(commandName[0])
            if(command.data){
                commands.push(command.data.toJSON());
            }
        }

        if (message.content.toLowerCase() === '!deploy') {
            for(let id in whitelist){
                if(message.author.id === whitelist[id]){
                    await message.guild.commands.set(commands);
                    await message.reply('Deployed!');
                }
            }
        }
        if(message.content.toLowerCase() === '!fix' && message.guild.ownerId === message.author.id) {
            await message.guild.commands.set([]);
            await message.reply('Commands should be fixed, if not dm Minxter');
        }
    }
}