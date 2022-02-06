"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
const ready_1 = require("./ready");
const messageCreate_1 = require("./messageCreate");
const interactionCreate_1 = require("./interactionCreate");
exports.events = [
    ready_1.ready,
    messageCreate_1.messageCreate,
    interactionCreate_1.interactionCreate
];
//# sourceMappingURL=events.js.map