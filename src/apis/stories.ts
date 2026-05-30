import { apiFetch } from "../lib/api";

export type StoryToken = {
    id: number;
    text: string;
    highlight: boolean;
    translation: string;
    definition: string;
    audioUrl: string;
    sourceLanguage: string;
    targetLanguage: string;
};

export type StorySlide = {
    slideId: number;
    order: number;
    imageUrl: string;
    textKr: string;
    textNative: string;
    audioUrlKr: string;
    audioUrlNative: string;
    tokens: StoryToken[];
};

export type StoryDetail = {
    storyId: number;
    title: string;
    prompt: string;
    childName: string;
    primaryLanguage: string;
    secondaryLanguage: string;
    isPublic: boolean;
    createdAt: string;
    slides: StorySlide[];
};

type StoryDetailResponse = {
    success: boolean;
    data: StoryDetail;
};

export function getStoryDetail(storyId: number) {
    return apiFetch(`/api/stories/${storyId}`) as Promise<StoryDetailResponse>;
}
