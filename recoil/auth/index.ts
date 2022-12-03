import { atom } from 'recoil';

export const authAtom = atom({
    key: 'auth',
    // get initial state from local storage to enable user to stay logged in
    default: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null,
});

export const usersAtom = atom({
    key: 'users',
    default: null,
});
