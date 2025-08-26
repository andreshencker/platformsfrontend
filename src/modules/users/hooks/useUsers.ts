import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listUsers, updateUserRole, createAdmin } from '../api/users';
import type { UsersListParams, UpdateUserRoleDto, CreateAdminDto } from '../types/user';

export function useUsersList(params: UsersListParams) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => listUsers(params),
        keepPreviousData: true,
    });
}

export function useUpdateUserRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserRoleDto }) => updateUserRole(id, dto),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useCreateAdmin() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateAdminDto) => createAdmin(dto),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['users'] });
        },
    });
}