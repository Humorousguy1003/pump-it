import Axios from 'axios';
import { getSession } from 'next-auth/react';
import { Project } from '~/types/projects';
import { ApiClient } from '.';

export const ApiFormClient = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const uploadFile = async (file: any) => {
    const session = await getSession();
    const response = await ApiFormClient.post('/api/image', file, {
        headers: {
            ...(session && { Authorization: 'Bearer ' + session.accessToken }),
        },
    });

    return response.data as string;
};

// Create new project
export const createProject = async (project: any) => {
    const session = await getSession();
    const response = await ApiFormClient.post('/api/projects', project, {
        headers: {
            ...(session && { Authorization: 'Bearer ' + session.accessToken }),
        },
    });

    return response.data as Project;
};

export const helpRequest = async (data: any) => {
    const session = await getSession();
    const response = await ApiFormClient.post('/api/send-mail', data, {
        headers: {
            ...(session && { Authorization: 'Bearer ' + session.accessToken }),
        },
    });

    return response.data;
};

// Add projects to favorite
export const toggleFavoriteProject = async (data: any) => {
    const session = await getSession();
    const response = await ApiClient.post('/api/favorite', data, {
        headers: {
            ...(session && { Authorization: 'Bearer ' + session.accessToken }),
        },
    });

    return response.data;
};
