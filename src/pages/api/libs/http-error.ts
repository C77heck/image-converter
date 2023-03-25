export class HttpError extends Error {
    public message: string;
    public code: number;
    public payload?: any;

    public constructor({ message, code, payload }: { message?: string; code?: number, payload?: any }) {
        super();
        this.code = code || 500;
        this.message = message || 'Something went wrong';
        this.payload = this.handleErrorPayload(payload);
    }

    private handleErrorPayload(payload: any) {
        try {
            const payloadType = typeof payload;

            switch (payloadType) {
                case 'string':
                    return payload;
                case 'number':
                    return payload;
                case 'object':
                    return JSON.stringify(payload);
                default:
                    return null;
            }
        } catch (e) {
            return null;
        }
    }
}
