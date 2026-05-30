const TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";
const PROFILE_ID_KEY = "profileId";

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
}

export function getProfileId(): number | null {
    const raw = localStorage.getItem(PROFILE_ID_KEY);
    if (!raw) return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

export function setProfileId(profileId: number) {
    localStorage.setItem(PROFILE_ID_KEY, String(profileId));
}

export function setAuth(token: string, userId?: string) {
    localStorage.setItem(TOKEN_KEY, token);
    if (userId != null) {
        localStorage.setItem(USER_ID_KEY, userId);
    }
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(PROFILE_ID_KEY);
}

export type OAuthCallbackResult =
    | { handled: false }
    | { handled: true; hasProfile: boolean };

export function consumeOAuthCallback(): OAuthCallbackResult {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
        return { handled: false };
    }

    setAuth(token, params.get("userId") ?? undefined);
    const hasProfile = params.get("hasProfile") === "true";

    window.history.replaceState({}, "", window.location.pathname);

    return { handled: true, hasProfile };
}

export function startGoogleLogin() {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) {
        console.error("VITE_API_BASE_URL이 설정되지 않았습니다.");
        return;
    }
    window.location.href = `${base}/oauth2/authorization/google`;
}
