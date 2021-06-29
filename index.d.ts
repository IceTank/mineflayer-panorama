import { Bot } from 'mineflayer';
export declare function plugin(bot: Bot): void;
import { Vec3 } from 'vec3';

declare module 'panoramaImage' {
    import ReadableStream = NodeJS.ReadableStream;

    export function image(bot: Bot): void;

    export interface moduleImage {
        takePanoramaPictures(): Promise<ReadableStream>
    }
}

declare module 'image' {
    export function image(bot: Bot): void;

    export interface image {
        takePicture(point: Vec3, direction: Vec3): Promise<void>;
    }
}

