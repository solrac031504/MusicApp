/*
This file defines all of the database objects
*/

// General object interface with common fields
interface Entity {
    id: number;
    name: string;
    isActive: boolean;
    description: string;
}

/* ************************************************* */
/* ************* Music-related Objects ************* */
/* ************************************************* */

// Individual artists (the people)
export interface Artist extends Omit<Entity, 'description'> {
    groups?: Group[];
}

// Groups of artists or stage names
export interface Group extends Omit<Entity, 'description'> {
    artists?: Artist[];
}

// Musical genre
export interface Genre extends Omit<Entity, 'isActive'> {
    hierarchy: string[]; // maybe? idk let me think abt it
}

// Individual producers
export interface Producer extends Omit<Entity, 'description'> {
    producerGroups?: ProducerGroup[];
}

// Groups of producers or stage names
export interface ProducerGroup extends Omit<Entity, 'description'> { }

// E.g., album, mixtape, ep, etc.
export interface Project extends Omit<Entity, 'description' | 'isActive'> {
    group: Group;
    scene: Scene;
    projectType: ProjectType;
    releaseDate: Date;
    rating: number;
}

export interface ProjectType extends Omit<Entity, 'description' | 'isActive'> { }

export interface Scene extends Omit<Entity, 'isActive'> {
    isGeographic: boolean;
}

export interface Song extends Omit<Entity, 'description' | 'isActive'> {
    group: Group;
    project: Project;
    producerGroup: ProducerGroup;
    genre: Genre;
    scene: Scene;
    service: StreamingService;
    duration: number;
    rating: number;
    isAdded: boolean;
    isLocalFile: boolean;
}

export interface StreamingService extends Omit<Entity, 'description' | 'isActive'> { }