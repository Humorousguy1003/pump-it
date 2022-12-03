import { getSession } from 'next-auth/react';
import { selector } from 'recoil';

import { ApiClient } from '~/api';
import { HomePageResponse } from '~/types/projects';
import { updateIDState } from '../other';

export const homePageState = selector({
    key: 'homePage',
    get: async ({ get }) => {
        get(updateIDState);
        const session = await getSession();
        const response = await ApiClient.get('/api/home', {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        });

        return response.data as HomePageResponse;
    },
});
