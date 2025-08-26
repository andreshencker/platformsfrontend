// src/types/auth-context.ts
export type UpdateProfileDTO = {
    id: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
};