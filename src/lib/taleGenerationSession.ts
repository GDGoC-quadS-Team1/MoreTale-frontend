import type { StoryGenerateResult } from "../apis/tale";

const STORAGE_KEY = "taleGenerationSession";

export type TaleGenerationSession = {
    jobId: string;
    profileId: number;
    prompt: string;
    generationStartedAt: number;
    result?: StoryGenerateResult;
};

export function saveTaleGenerationSession(session: TaleGenerationSession) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadTaleGenerationSession(): TaleGenerationSession | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as TaleGenerationSession;
        if (!parsed.jobId) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export function clearTaleGenerationSession() {
    sessionStorage.removeItem(STORAGE_KEY);
}
