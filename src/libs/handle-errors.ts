export const handleErrors = (catchError: any, clientError?: any) => {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    console.log({ catchError, clientError });
};
