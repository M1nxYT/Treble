"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const builders_1 = require("@discordjs/builders");
exports.test = {
    name: 'test',
    description: 'Test',
    data: new builders_1.SlashCommandBuilder().setName('test').setDescription('test command!'),
    ephemeral: true,
    async execute(interaction, client) {
        interaction.followUp('test');
        const userFavourite = await client.models.Favourites.find({
            _id: interaction.member.id
        });
        if (userFavourite.length == 0) {
            let doc = new client.models.Favourites({
                author: interaction.member.user.username,
                tracks: [],
                _id: interaction.member.id,
            });
            doc.save();
            interaction.followUp('created');
        }
        else {
            console.log(userFavourite);
            interaction.followUp('found');
        }
    }
};
//# sourceMappingURL=test.js.map