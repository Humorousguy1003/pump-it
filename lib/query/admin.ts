import { ApiClient } from '~/api';

export const getUser = async ({
    email,
    password,
}: {
    email?: string;
    password?: string;
}) => {
    return await ApiClient.post('/api/login', { email, password })
        .then((res) => {
            return res.data.user;
        })
        .catch((error: any) => {
            console.log('error', error);
            return null;
        });
};
