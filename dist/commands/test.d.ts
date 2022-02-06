import { SlashCommandBuilder } from "@discordjs/builders";
import { customClient } from "../bot";
export declare let test: {
    name: string;
    description: string;
    data: SlashCommandBuilder;
    ephemeral: boolean;
    execute(interaction: any, client: customClient): Promise<void>;
};
//# sourceMappingURL=test.d.ts.map