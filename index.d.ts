import { Bot } from 'mineflayer';
export declare function plugin(bot: Bot): void;

declare module 'panoramaImage' {
    export function image(bot: Bot): void;

    export interface panoramaImage {
        takePicture(name: String): Promise<void>;
    }
}

