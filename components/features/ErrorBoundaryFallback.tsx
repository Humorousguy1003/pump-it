import { useEffect } from 'react';
import { useAuth } from '~/utils/hooks';
import Fallback from './Fallback';

const ErrorBoundaryFallback = () => {
    const { logout } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/',
    });
    // useEffect(() => {
    //     logout();
    // }, []);

    return <Fallback />;
};

export default ErrorBoundaryFallback;
