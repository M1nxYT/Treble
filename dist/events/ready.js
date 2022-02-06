"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = void 0;
const voice_1 = require("@discordjs/voice");
var ConsoleGrid = require("console-grid");
const CGS = ConsoleGrid.Style;
var grid = new ConsoleGrid();
const port = 3100;
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
exports.ready = {
    name: 'ready',
    once: true,
    async execute(args, client) {
        var _a;
        (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`music in 0 servers`, { type: "LISTENING", });
        for (let guild of client.guilds.cache) {
            let owner = await guild[1].fetchOwner();
            let guildRow = {
                name: CGS.green(`Ready in ${guild[1].name} `),
                value: CGS.blue(`${owner.user.tag}`),
            };
            readyData.rows.push(guildRow);
        }
        if (client.db.readyState == 1) {
            let dbRow = {
                name: CGS.green(`Bot Database Connected `)
            };
            extrasData.rows.push(dbRow);
        }
        client.app.listen(port, () => {
            let expressRow = {
                name: CGS.green(`Bot Dashboard accessible at `) + CGS.blue(`http://localhost:${port}`)
            };
            extrasData.rows.push(expressRow);
            grid.render(readyData);
            grid.render(extrasData);
        });
        client.app.get('*', async (req, res) => {
            let jsonObject = new Array();
            client.subscriptions.forEach((value, key) => {
                if (value.audioPlayer.state.status === voice_1.AudioPlayerStatus.Playing) {
                    let sub = {
                        id: key,
                        nowplaying: value.audioPlayer.state.resource.metadata,
                        queue: value.queue,
                        loopEnabled: value.isLooped
                    };
                    jsonObject.push(sub);
                }
                else {
                    let sub = {
                        id: key,
                        nowplaying: 'Treble is currently not playing or paused in this server.',
                        queue: value.queue,
                        loopEnabled: value.isLooped
                    };
                    jsonObject.push(sub);
                }
            });
            res.json(jsonObject);
        });
    }
};
//# sourceMappingURL=ready.js.map