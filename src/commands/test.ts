import { SlashCommandBuilder } from "@discordjs/builders";
import { customClient } from "../bot"

export let test = {
    name: 'test',
    description: 'Test',
    data: new SlashCommandBuilder().setName('test').setDescription('test command!'),
    ephemeral: true,
    async execute(interaction: any, client: customClient) {
        interaction.followUp('test')
        const userFavourite = await client.models.Favourites.find({
            _id: interaction.member.id
        })

        if(userFavourite.length == 0){
            let doc = new client.models.Favourites({
                author: interaction.member.user.username,
                tracks: [],
                _id: interaction.member.id,
            })
    
            doc.save();
            interaction.followUp('created')
        }
        else{
            console.log(userFavourite)
            interaction.followUp('found')
        }

    }
}