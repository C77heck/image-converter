import sharp from 'sharp';

export type Quality = 'high' | 'medium' | 'low';

export interface ISharpService {
    resize: (options: { file: Buffer, savePath: string, quality: Quality }) => Promise<void>;
}

export const SharpService: ISharpService = {
    resize: async ({ quality, savePath, file }) => {
        try {
            switch (quality) {
                case 'low':
                    await sharp(file)
                        .webp({ quality: 40 })
                        .toFile(savePath);
                    break;
                case 'medium':
                    await sharp(file)
                        .webp({ quality: 80 })
                        .toFile(savePath);
                    break;
                case 'high':
                    await sharp(file)
                        .webp({ quality: 100 })
                        .toFile(savePath);
                    break;
                default:
                    await sharp(file)
                        .webp({ quality: 100 })
                        .toFile(savePath);
                    break;
            }
        } catch (e) {
            throw e;
        }
    }
};
