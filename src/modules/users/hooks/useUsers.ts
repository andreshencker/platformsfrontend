// src/modules/users/hooks/users.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers, updateUserRole, createAdmin } from "../api/users";
import type {
    ListUsersParams,        // <-- usa el mismo nombre que en API
    UpdateUserRoleDto,
    CreateAdminDto,
} from "../types/types";

// Lista paginada de usuarios
export function useUsersList(params: ListUsersParams = {}) {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => listUsers(params),
        keepPreviousData: true,
    });
}

// Alias opcional para que puedas seguir importando `useUsers`
export const useUsers = useUsersList;

export function useUpdateUserRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserRoleDto }) =>
            updateUserRole(id, dto),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useCreateAdmin() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateAdminDto) => createAdmin(dto),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["users"] });
        },
    });
}