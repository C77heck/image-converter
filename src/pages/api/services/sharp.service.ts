import sharp from 'sharp';

export type Quality = 'high' | 'medium' | 'low';

export interface SharpOptions {
    file: Buffer,
    saveLocation: string,
    quality: Quality
};

export interface SharpMobileOptions extends SharpOptions {
    originalWidth: number;
    originalHeight: number;
}

export interface ISharpService {
    convert: (options: SharpOptions) => Promise<void>;
    toThumbnail: (options: SharpOptions) => Promise<void>;
    toMobileSize: (options: SharpMobileOptions) => Promise<void>;
}

export const SharpService: ISharpService = {
    toMobileSize: async ({ saveLocation, file, originalWidth, originalHeight }) => {
        console.log('toMobileSize');
        await sharp(file)
            .resize({ width: originalWidth / 2, height: originalHeight / 2 })
            .webp({ quality: 100 })
            .toFile(saveLocation);
    },
    toThumbnail: async ({ quality, saveLocation, file }) => {
        console.log('toThumbnail');
        await sharp(file)
            .resize({ width: 100, height: 100 })
            .webp({ quality: 100 })
            .toFile(saveLocation);
    },
    convert: async ({ quality, saveLocation, file }) => {
        console.log('convert');
        try {
            switch (quality) {
                case 'low':
                    await sharp(file)
                        .webp({ quality: 40 })
                        .toFile(saveLocation);
                    break;
                case 'medium':
                    await sharp(file)
                        .webp({ quality: 80 })
                        .toFile(saveLocation);
                    break;
                case 'high':
                    await sharp(file)
                        .webp({ quality: 100 })
                        .toFile(saveLocation);
                    break;
                default:
                    await sharp(file)
                        .webp({ quality: 100 })
                        .toFile(saveLocation);
                    break;
            }
        } catch (e) {
            throw e;
        }
    }
};
