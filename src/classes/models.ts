import { model, Schema } from "mongoose";

const mongoose = require('mongoose');

interface Playlist {
    author: string;
    tracks: [];
	_id: number;
}

const FavouritesSchema = new Schema<Playlist>({
    author: { type: String, required: true },
    tracks: [],
	_id: Number,
});

export let Favourites = model<Playlist>('Favourites', FavouritesSchema);