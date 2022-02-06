import { CommandInteraction } from "discord.js";
import { customClient } from "../bot";
export declare let ping: {
    name: string;
    description: string;
    data: any;
    ephemeral: boolean;
    execute(interaction: CommandInteraction, client: customClient): Promise<void>;
};
//# sourceMappingURL=ping.d.ts.map