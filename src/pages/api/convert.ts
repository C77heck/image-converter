// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RawAttachment } from '@/components/file-upload/file-uploader';
import { HttpError } from '@/pages/api/libs/http-error';
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
        const body: ReqBody = req.body;
        const quality = body?.quality || 'high';
        const files = body.files;
        const types = body.types;
        const saveLocation = body.saveLocation;

        if (!files?.length) {
            throw new HttpError({ message: 'No files were attached' });
        }
        console.log('starting');

        for (const file of files) {
            console.log('starting', file.name);
            const uploadName = file?.name || v4();
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
                        await SharpService.convert({ ...sharpOptions, saveLocation: sameSize });
                        await SharpService.toThumbnail({ ...sharpOptions, saveLocation: thumbnailLocation });
                        await SharpService.toMobileSize({ ...sharpOptions, originalWidth, originalHeight, saveLocation: mobileLocation });
                        break;
                    case 'same-size':
                        await SharpService.convert({ ...sharpOptions, saveLocation: sameSize });
                        break;
                    case 'mobile-types':
                        await SharpService.toMobileSize({ ...sharpOptions, originalWidth, originalHeight, saveLocation: mobileLocation });
                        break;
                    case 'thumbnail':
                        await SharpService.toThumbnail({ ...sharpOptions, saveLocation: thumbnailLocation });
                        break;
                    default:

                }
            }
        }

        res.json({ message: 'success' });
    } catch (e) {
        res.json({ e, message: 'failure' });
    }
}
