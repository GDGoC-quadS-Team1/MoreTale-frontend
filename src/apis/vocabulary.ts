import { apiFetch } from "../lib/api";

const LOG = "[Vocabulary API]";

function logRequest(method: string, path: string, body?: unknown) {
    console.log(`${LOG} → ${method} ${path}`, body ?? "");
}

function logResponse(method: string, path: string, data: unknown) {
    console.log(`${LOG} ← ${method} ${path}`, data);
}

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

export type VocabularyItem = {
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

export type VocabularyPageData = {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    content: VocabularyItem[];
    number: number;
    numberOfElements: number;
    empty: boolean;
};

type VocabularyListResponse = {
    success: boolean;
    data: VocabularyPageData;
    message?: string;
    errorCode?: string;
    timestamp?: string;
};

type SaveVocabularyResponse = {
    success: boolean;
    data: VocabularyItem;
    message?: string;
    errorCode?: string;
    timestamp?: string;
};

export type VocabularySortKey = "created-desc" | "created-asc" | "word-asc";

export const VOCABULARY_SORT_PARAM: Record<VocabularySortKey, string> = {
    "created-desc": "createdAt,desc",
    "created-asc": "createdAt,asc",
    "word-asc": "word,asc",
};

export async function getVocabulary(params: {
    page: number;
    size: number;
    sort?: VocabularySortKey;
    storyId?: number;
    favorite?: boolean;
    keyword?: string;
}): Promise<VocabularyListResponse> {
    const query = new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
        sort: VOCABULARY_SORT_PARAM[params.sort ?? "created-desc"],
    });

    if (params.storyId != null) {
        query.set("storyId", String(params.storyId));
    }
    if (params.favorite) {
        query.set("favorite", "true");
    }
    const keyword = params.keyword?.trim();
    if (keyword) {
        query.set("keyword", keyword);
    }

    const path = `/api/vocabulary?${query}`;
    logRequest("GET", path);

    const response = await apiFetch(path) as VocabularyListResponse;
    logResponse("GET", path, response);
    return response;
}

export function saveVocabulary(body: SaveVocabularyRequest) {
    const path = "/api/vocabulary";
    logRequest("POST", path, body);

    return apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
    }).then((data) => {
        logResponse("POST", path, data);
        return data as SaveVocabularyResponse;
    });
}

/** @deprecated use VocabularyItem */
export type SavedVocabulary = VocabularyItem;
