import Discord, { Options } from 'discord.js';
import { customClient } from '../bot';

const express = require('express')
const app = express()
const port = 3000

var ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
var grid = new ConsoleGrid();

let readyData = {
    option: {
        sortField: "name",
        border: {
            h: '─',
            v: '│',
            top_left: '┌',
            top_mid: '┬',
            top_right: '┐',
            mid_left: '├',
            mid_mid: '┼',
            mid_right: '┤',
            bottom_left: '└',
            bottom_mid: '┴',
            bottom_right: '┘'
        },
        hideHeaders: true,
    },
    columns: [{
        id: "name",
        name: "Name",
        type: "string",
        maxWidth: 100
    }, {
        id: "value",
        name: "Value",
        type: "string",
        maxWidth: 30,
    }],
    rows: new Array()
};

let extrasData = {
    option: {
        sortField: "name",
        border: {
            h: '─',
            v: '│',
            top_left: '┌',
            top_mid: '┬',
            top_right: '┐',
            mid_left: '├',
            mid_mid: '┼',
            mid_right: '┤',
            bottom_left: '└',
            bottom_mid: '┴',
            bottom_right: '┘'
        },
        hideHeaders: true,
    },
    columns: [{
        id: "name",
        name: "Name",
        type: "string",
        maxWidth: 100
    }],
    rows: new Array()
};

export let ready = {
    name: 'ready',
    once: true,
    async execute(args: any[], client: customClient) {
        client.user?.setActivity(`music in 0 servers`, { type: "LISTENING", });

        for (let guild of client.guilds.cache) {
            let owner = await guild[1].fetchOwner()
            let guildRow = {
                name: CGS.green(`Ready in ${guild[1].name} `),
                value: CGS.blue(`${owner.user.tag}`),
            };
            readyData.rows.push(guildRow);
        }

        app.get('*', (req: any, res: any) => {
            res.send('Hello World!')
        })

        if (client.db.readyState == 1) {
            let dbRow = {
                name: CGS.green(`Bot Database Connected `)
            };
            extrasData.rows.push(dbRow);
        }

        app.listen(port, () => {
            let expressRow = {
                name: CGS.green(`Bot Dashboard accessible at `) + CGS.blue(`http://localhost:${port}`)
            };
            extrasData.rows.push(expressRow);
            grid.render(readyData);
            grid.render(extrasData);
        })
    }
}



