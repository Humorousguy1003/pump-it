import { getSession } from 'next-auth/react';
import { atom, selector } from 'recoil';
import { ApiClient } from '~/api';

import {
    CreatePageResponse,
    ProjectsResponse,
    SingleProjectResponse,
} from '~/types/projects';
import { getAuthHeader, handleToken } from '~/utils';
import { filterState } from '../filters';

export const currentProjectIdState = atom({
    key: 'projectId',
    default: '',
});

export const projectsState = selector({
    key: 'projects',
    get: async ({ get }) => {
        const filters = get(filterState);
        const session = await getSession();
        const url =
            '/api/projects?page=' +
            filters.page +
            '&perPage=' +
            filters.pageSize +
            (filters.categoryId ? '&categoryId=' + filters.categoryId : '') +
            (filters.searchTerm ? '&searchTerm=' + filters.searchTerm : '') +
            (filters.raiseAmount ? '&raiseAmount=' + filters.raiseAmount : '') +
            (filters.chainId ? '&chainId=' + filters.chainId : '') +
            (filters.status ? '&status=' + filters.status : '');

        const response = await ApiClient.get(url, {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        });

        return response.data as ProjectsResponse;
    },
});

export const investedProjectsState = selector({
    key: 'investedProjects',
    get: async ({ get }) => {
        const filters = get(filterState);
        const session = await getSession();
        const url =
            '/api/projects?page=' +
            filters.page +
            '&perPage=' +
            filters.pageSize +
            (filters.categoryId ? '&categoryId=' + filters.categoryId : '') +
            (filters.searchTerm ? '&searchTerm=' + filters.searchTerm : '') +
            (filters.raiseAmount ? '&raiseAmount=' + filters.raiseAmount : '') +
            (filters.chainId ? '&chainId=' + filters.chainId : '') +
            (filters.status ? '&status=' + filters.status : '') +
            (session?.user ? '&invested=' + 'true' : '');

        const response = await ApiClient.get(url, {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        });

        return response.data as ProjectsResponse;
    },
});

export const favoriteProjectsState = selector({
    key: 'favoriteProjects',
    get: async ({ get }) => {
        const filters = get(filterState);
        const session = await getSession();
        const url =
            '/api/favorite?page=' +
            filters.page +
            '&perPage=' +
            filters.pageSize +
            (filters.categoryId ? '&categoryId=' + filters.categoryId : '') +
            (filters.searchTerm ? '&searchTerm=' + filters.searchTerm : '') +
            (filters.raiseAmount ? '&raiseAmount=' + filters.raiseAmount : '') +
            (filters.chainId ? '&chainId=' + filters.chainId : '') +
            (filters.status ? '&status=' + filters.status : '');

        const response = await ApiClient.get(url, {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        });

        return response.data as ProjectsResponse;
    },
});

export const singleProjectState = selector({
    key: 'singleProject',
    get: async ({ get }) => {
        const projectId = get(currentProjectIdState);
        const session = await getSession();
        const response = await ApiClient.get('/api/projects/' + projectId, {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        });

        return response.data as SingleProjectResponse;
    },
});

export const createProjectState = selector({
    key: 'createProject',
    get: async ({}) => {
        const session = await getSession();
        const response = await ApiClient.get('/api/projects/create', {
            headers: {
                ...(session && {
                    Authorization: 'Bearer ' + session.accessToken,
                }),
            },
        }).then((res) => {
            handleToken(res.data.status);
            return res;
        });

        return response.data as CreatePageResponse;
    },
});
