export interface Project {
    id?: number;
    name: string;
    symbol: string;
    tokenAddress: string | null;
    contractAddress: string;
    description: string;
    website: string;
    discord: string;
    twitter: string;
    instagram: string;
    medium: string;
    telegram: string;
    start_date: string | null;
    end_date: string | null;
    lock_time: string;
    chain_id: number | null;
    soft_cap: string;
    hard_cap: string;
    equity_type: string;
    equity_value: number | null;
    logo: string | null;
    banner: string | null;
    category_id: number | null;
    user_id?: number;
    favorite_users: any[];
}

export interface ProjectsResponse {
    totalCount: number;
    projects: Project[];
}

export interface SingleProjectResponse {
    project: Project;
    related: Project[];
}

export interface HomePageResponse {
    categories: Category[];
    projects: Project[];
}

export interface CreatePageResponse {
    categories: Category[];
}

export interface Category {
    id: number;
    name: string;
    image: string;
}
