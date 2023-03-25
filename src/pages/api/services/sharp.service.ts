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

export class SharpService {
    public async toMobileSize({ saveLocation, file, originalWidth, originalHeight }: SharpMobileOptions) {
        console.log('toMobileSize');
        await sharp(file)
            .resize({ width: originalWidth / 2, height: originalHeight / 2 })
            .webp({ quality: 100 })
            .toFile(saveLocation);
    }

    public async toThumbnail({ saveLocation, file }: SharpOptions) {
        console.log('toThumbnail');
        await sharp(file)
            .resize({ width: 100, height: 100 })
            .webp({ quality: 100 })
            .toFile(saveLocation);
    }

    public async convert({ quality, saveLocation, file }: SharpOptions) {
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
