import { apiFetch } from "../lib/api";

export type LibraryStoryItem = {
    storyId: number;
    title: string;
    thumbnail: string;
    primaryLanguage: string;
    secondaryLanguage: string;
    isPublic: boolean;
    createdAt: string;
    slideCount: number;
};

export type LibraryPageData = {
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    size: number;
    content: LibraryStoryItem[];
    number: number;
    numberOfElements: number;
    empty: boolean;
};

type LibraryListResponse = {
    success: boolean;
    data: LibraryPageData;
};

export type LibrarySortKey = "created-desc" | "created-asc" | "title-asc";

export const LIBRARY_SORT_PARAM: Record<LibrarySortKey, string> = {
    "created-desc": "createdAt,desc",
    "created-asc": "createdAt,asc",
    "title-asc": "title,asc",
};

export function getLibraryStories(params: {
    page: number;
    size: number;
    sort: LibrarySortKey;
}) {
    const query = new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
        sort: LIBRARY_SORT_PARAM[params.sort],
    });
    return apiFetch(`/api/library?${query}`) as Promise<LibraryListResponse>;
}
