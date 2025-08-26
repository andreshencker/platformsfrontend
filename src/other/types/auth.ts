import type { Role } from './auth';

export interface UpdateProfile {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    secondLastName?: string;
}

export interface CreateUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    secondLastName?: string;
    role?: Role;
}