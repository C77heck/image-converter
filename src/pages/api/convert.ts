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

export interface ReqBody {
    files: RawAttachment[];
    quality?: Quality;
    types: string;
    saveLocation: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        const body: ReqBody = req.body;
        const quality = body?.quality || 'high';
        const fileDatas = body.files;
        const saveLocation = body.saveLocation;

        if (!fileDatas?.length) {
            throw new HttpError({ message: 'No files were attached' });
        }

        for (const fileData of fileDatas) {
            const fileBuffer = Buffer.from(fileData.base64, 'base64' as any);
            const uploadName = fileData?.name || v4();
            const name = `${uploadName}.webp`;
            const location = `${saveLocation}/${name}`;
            await SharpService.resize({ quality, file: fileBuffer, saveLocation: location });
        }

        res.json({ message: 'success' });
    } catch (e) {
        res.json({ e, message: 'failure' });
    }
}
