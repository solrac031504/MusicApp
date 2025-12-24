import { Genre } from '../types/entities';

export interface LoginRequest {
    username: string;
    password: string;
    originFrom: string;
}

// General single object requests are made with the id
export interface ObjectRequest {
    id: number;
}

// Request object to update a genre
export interface GenreUpdateRequest extends Omit<Genre, 'hierarchy'> {
    username: string;
}