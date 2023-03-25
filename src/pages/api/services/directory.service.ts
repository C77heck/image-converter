import * as fs from 'fs';

export class DirectoryService {
    public ensureDirectoryExistence(filePath) {
        if (fs.existsSync(filePath)) {
            return true;
        }
        fs.mkdirSync(filePath);
    }
};
