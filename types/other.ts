export interface Filter {
    searchTerm: string | null;
    status: string;
    chainId: number | string;
    raiseAmount: number | string;
    categoryId: number | string | null;
    pageSize: number;
    page: number;
}

export type HttpHeaders = {
    [key: string]: string;
};

export type RequestConfig = {
    headers: HttpHeaders;
};
export class ApiConfiguration {
    accessToken?: string;
}
