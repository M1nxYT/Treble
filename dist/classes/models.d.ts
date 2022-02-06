/// <reference types="mongoose" />
interface Playlist {
    author: string;
    tracks: [];
    _id: number;
}
export declare let Favourites: import("mongoose").Model<Playlist, {}, {}, {}>;
export {};
//# sourceMappingURL=models.d.ts.map