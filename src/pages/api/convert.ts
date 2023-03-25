// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RawAttachment } from '@/components/file-upload/file-uploader';
import { HttpError } from '@/pages/api/libs/http-error';
import { DirectoryService } from '@/pages/api/services/directory.service';
import { Quality, SharpService } from '@/pages/api/services/sharp.service';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';

type Data = {
    message: 'success' | 'failure';
    payload?: any;
}

export type Base64 = string;
export type ConvertTypes = 'all' | 'thumbnail' | 'same-size' | 'mobile-types';

export interface ReqBody {
    files: RawAttachment[];
    quality?: Quality;
    types: ConvertTypes[];
    saveLocation: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        if (!req?.body?.files?.length) {
            throw new HttpError({ message: 'No files were attached' });
        }

        const directoryService = new DirectoryService();
        const sharpService = new SharpService();
        const body: ReqBody = req.body;
        const quality = body?.quality || 'high';
        const files = body?.files;
        const types = body?.types;
        const saveLocation = body.saveLocation;

        directoryService.ensureDirectoryExistence(body.saveLocation);

        for (const file of files) {
            console.log('starting', file.name);
            const uploadName = getFileNameWithoutExtension(file);
            const originalWidth = file.originalWidth;
            const originalHeight = file.originalHeight;
            const sameSize = `${saveLocation}/${uploadName}.webp`;
            const thumbnailLocation = `${saveLocation}/${uploadName}-thumbnail.webp`;
            const mobileLocation = `${saveLocation}/${uploadName}-mobile.webp`;
            const sharpOptions = { quality, file: Buffer.from(file.base64, 'base64' as any), };

            for (const type of types) {
                console.log('starting', file.name, type);

                switch (type) {
                    case 'all':
                        await sharpService.convert({ ...sharpOptions, saveLocation: sameSize });
                        await sharpService.toThumbnail({ ...sharpOptions, saveLocation: thumbnailLocation });
                        await sharpService.toMobileSize({ ...sharpOptions, originalWidth, originalHeight, saveLocation: mobileLocation });
                        break;
                    case 'same-size':
                        await sharpService.convert({ ...sharpOptions, saveLocation: sameSize });
                        break;
                    case 'mobile-types':
                        await sharpService.toMobileSize({ ...sharpOptions, originalWidth, originalHeight, saveLocation: mobileLocation });
                        break;
                    case 'thumbnail':
                        await sharpService.toThumbnail({ ...sharpOptions, saveLocation: thumbnailLocation });
                        break;
                    default:

                }
            }
        }

        res.status(201).json({ message: 'success' });
    } catch (e) {
        res.status(500).json({ e, message: 'failure' });
    }
}

function getFileNameWithoutExtension(file: RawAttachment): string {
    if (!file?.name) {
        return v4();
    }
    const types = {
        'image/png': '.png',
        'image/jpg': '.jpg',
        'image/jpeg': '.jpeg',
        'image/webp': '.webp',
    };

    const fileType = file?.type || 'image/png';

    return file?.name?.replace(types[fileType], '');
}
