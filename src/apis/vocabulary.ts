import { apiFetch } from "../lib/api";

export type SaveVocabularyRequest = {
    tokenId: number;
    slideId: number;
    storyId: number;
    word: string;
    translation: string;
    definition: string;
    sourceLanguage: string;
    targetLanguage: string;
};

export type SavedVocabulary = {
    vocabularyId: number;
    word: string;
    normalizedWord: string;
    translation: string;
    definition: string;
    secondaryDefinition?: string;
    sourceLanguage: string;
    targetLanguage: string;
    audioUrl: string;
    storyId: number;
    storyTitle: string;
    slideId: number;
    slideOrder: number;
    tokenId: number;
    isFavorite: boolean;
    learningStatus: string;
    memo?: string;
    lastReviewedAt?: string;
    createdAt: string;
};

type SaveVocabularyResponse = {
    success: boolean;
    data: SavedVocabulary;
    message?: string;
    errorCode?: string;
    timestamp?: string;
};

export function saveVocabulary(body: SaveVocabularyRequest) {
    return apiFetch("/api/vocabulary", {
        method: "POST",
        body: JSON.stringify(body),
    }) as Promise<SaveVocabularyResponse>;
}
