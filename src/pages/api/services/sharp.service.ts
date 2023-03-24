import sharp from 'sharp';

export type Quality = 'high' | 'medium' | 'low';

export interface ISharpService {
    resize: (options: { file: Buffer, saveLocation: string, quality: Quality }) => Promise<void>;
}

export const SharpService: ISharpService = {
    resize: async ({ quality, saveLocation, file }) => {
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
