import type { User } from "./user";
import type { RegisterDTO } from "./register";
import type { LoginDTO } from "./login";

export type AuthContextValue = {
    user: User | null;
    token: string | null;
    loading: boolean;

    register: (dto: RegisterDTO) => Promise<void>;
    login: (dto: LoginDTO) => Promise<void>;
    logout: () => void;
};