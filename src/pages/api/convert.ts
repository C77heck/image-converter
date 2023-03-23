// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HttpError } from '@/pages/api/libs/http-error';
import { Quality, SharpService } from '@/pages/api/services/sharp.service';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { v4 } from 'uuid';

type Data = {
    message: 'success' | 'failure';
    payload?: any;
}

export type Base64 = string;

export interface FileData {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string | "image/png";
    webkitRelativePath: string;
    file: Base64; // base64
}

export interface ReqBody {
    files: FileData[];
    quality?: Quality;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        console.log('hitting it');

        const body: ReqBody = req.body;
        const quality = body?.quality || 'high';
        const fileDatas = body.files;

        if (!fileDatas?.length) {
            throw new HttpError({ message: 'No files were attached' });
        }

        for (const fileData of fileDatas) {
            const fileBuffer = Buffer.from(fileData.file, 'base64' as any);
            const uploadName = fileData?.name || v4();
            const name = `${uploadName}.webp`;
            const savePath = `../../${path.resolve()}/Desktop/${name}`;

            await SharpService.resize({ savePath, quality, file: fileBuffer });
        }

        res.json({ message: 'success' });
    } catch (e) {
        res.json({ message: 'failure' });
    }
}
