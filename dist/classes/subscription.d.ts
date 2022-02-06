import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { Track } from './track';
export declare class MusicSubscription {
    readonly voiceConnection: VoiceConnection;
    readonly audioPlayer: AudioPlayer;
    isLooped: boolean;
    queue: Track[];
    queueLock: boolean;
    readyLock: boolean;
    constructor(voiceConnection: VoiceConnection);
    /**
     * Adds a new Track to the queue.
     *
     * @param track The track to add to the queue
     */
    enqueue(track: Track): void;
    /**
     * Stops audio playback and empties the queue
     */
    stop(): void;
    /**
     * Attempts to play a Track from the queue
     */
    private processQueue;
}
//# sourceMappingURL=subscription.d.ts.map