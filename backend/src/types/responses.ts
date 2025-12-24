import { Genre } from '../types/entities';

export interface LoginResponse {
    authenticated: boolean;
    loginExpiration?: Date;
    admin?: boolean;
    error?: string;
}

// Tack on error message to Genre objects
export interface GenreResponse extends Genre {
    error?: string;
}