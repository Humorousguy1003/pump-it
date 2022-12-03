import { Project } from '~/types/projects';

export const getProjectStatus = (project: Project) => {
    const now = new Date();
    const startDate = new Date(project.start_date as string);
    const endDate = new Date(project.end_date as string);

    if (now <= startDate && now < endDate) return 'Coming Soon';
    if (now >= startDate && now < endDate) return 'Sale Live';
    if (now >= startDate && now > endDate) return 'Sale Ended';
};

export const getTimeDiff = (endDate: string) => {
    const start = new Date().getTime();
    const end = new Date(endDate).getTime();

    var diff = end - start;
    const weeks = Math.floor(diff / 1000 / 7 / 24 / 60 / 60);
    diff -= weeks * 1000 * 7 * 24 * 60 * 60;
    const dd = Math.floor(diff / 1000 / 24 / 60 / 60);
    diff -= dd * 1000 * 24 * 60 * 60;
    const hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;
    const mm = Math.floor(diff / 1000 / 60);
    diff -= mm * 1000 * 60;
    const ss = Math.floor(diff / 1000);

    return {
        weeks: weeks,
        days: dd,
        hours: hh,
        minutes: mm,
        seconds: ss,
    };
};

export const getProjectSymbol = (symbol: string) => {
    return symbol.substring(0, 1) === '$' ? symbol : '$' + symbol;
};

export const getAuthHeader = () => {
    return typeof window !== 'undefined' && localStorage.getItem('user')
        ? {
              Authorization:
                  'Bearer ' +
                  JSON.parse(localStorage.getItem('user') as string).token,
          }
        : {};
};

export const getAuthToken = () => {
    return typeof window !== 'undefined' && localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string).token
        : null;
};

export const handleServiceError = (error: any) => {
    console.log(error);
};

export const handleToken = (status: null | string) => {
    const isTokenIssue =
        status === 'Token is Invalid' ||
        status === 'Token is Expired' ||
        status === 'Authorization Token not found';
    if (isTokenIssue && typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.replace('/login');
    }

    return isTokenIssue;
};
