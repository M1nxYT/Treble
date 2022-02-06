"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favourites = void 0;
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
const FavouritesSchema = new mongoose_1.Schema({
    author: { type: String, required: true },
    tracks: [],
    _id: Number,
});
exports.Favourites = (0, mongoose_1.model)('Favourites', FavouritesSchema);
//# sourceMappingURL=models.js.map