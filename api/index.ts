// import Axios from 'axios';

import Axios from 'axios';

export const ApiClient = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
