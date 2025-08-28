// src/modules/users/types/types.ts
export type UserRole = "admin" | "client";

export type User = {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    avatarUrl?: string | null;
};

export type ListUsersParams = {
    q?: string;
    sort?: "created-desc" | "name-asc";
};

export type CreateUserDto = {
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    role: Exclude<UserRole, "client">; // admin puede crear “admin” u otros no-client
    password: string;
    isActive?: boolean;
};

export type UpdateUserDto = Partial<
    Omit<CreateUserDto, "password" | "role"> & { role: UserRole }
>;

export type UpdateUserRoleDto = { role: UserRole };