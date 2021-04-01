import { Bot } from 'mineflayer';
export declare function plugin(bot: Bot): void;

declare module 'panoramaImage' {
    import ReadableStream = NodeJS.ReadableStream;

    export function image(bot: Bot): void;

    export interface moduleImage {
        takePicture(name: String): Promise<void>;
        takePanoramaPictures(): Promise<ReadableStream>
    }
}

