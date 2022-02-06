import { CommandInteraction } from "discord.js";
import { customClient } from "../bot";
export declare let status: {
    name: string;
    description: string;
    data: any;
    ephemeral: boolean;
    execute(interaction: CommandInteraction, client: customClient): Promise<void>;
};
//# sourceMappingURL=statusrefresh.d.ts.map