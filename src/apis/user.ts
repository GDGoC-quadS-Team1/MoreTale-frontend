import { apiFetch } from "../lib/api";

export type UserResponse = {
    userId: number;
    email: string;
    nickname: string;
    role: string;
    createdAt: string;
};

export function getCurrentUser() {
    return apiFetch("/api/users/me") as Promise<{ data: UserResponse }>;
}
