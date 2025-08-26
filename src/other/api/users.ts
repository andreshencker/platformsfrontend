// src/api/users.ts
import http from "@/lib/http";

export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
};

export type UpdateProfileDTO = Partial<
    Omit<UserProfile, "id" | "email">
>;

/** GET /users/me */
export async function getMe() {
    const { data } = await http.get<UserProfile>("/users/me");
    return data;
}

/** PATCH /users/me */
export async function updateMe(body: UpdateProfileDTO) {
    const { data } = await http.patch<UserProfile>("/users/me", body);
    return data;
}