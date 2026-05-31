import { apiFetch } from "../lib/api";
import type {
    AgeGroup,
    FamilyStructure,
    ProficiencyLevel,
    StoryPreference,
} from "./user";
import KoreaFlag from "../assets/images/tale/flag/korea.png";
import EnglishFlag from "../assets/images/tale/flag/english.png";
import JapanFlag from "../assets/images/tale/flag/japan.png";
import ChinaFlag from "../assets/images/tale/flag/china.png";
import SpainFlag from "../assets/images/tale/flag/spain.png";
import VietnamFlag from "../assets/images/tale/flag/vietnam.png";

export type StoryInitData = {
    profileId: number;
    childName: string;
    firstLanguageDisplay: string;
    secondLanguageDisplay: string;
    ageGroup: AgeGroup;
    childAge: number;
    firstLanguageProficiency: ProficiencyLevel;
    secondLanguageProficiency: ProficiencyLevel;
    firstLanguageListening: ProficiencyLevel;
    firstLanguageSpeaking: ProficiencyLevel;
    secondLanguageListening: ProficiencyLevel;
    secondLanguageSpeaking: ProficiencyLevel;
    storyPreference: StoryPreference;
    customStoryPreference?: string;
    familyStructure: FamilyStructure;
    customFamilyStructure?: string;
    recommendedTaleTitle: string;
    storyId: number;
    coverImageUrl: string | null;
};

type StoryInitResponse = {
    success: boolean;
    data: StoryInitData;
};

export const LANGUAGE_OPTIONS = [
    "한국어",
    "영어",
    "일본어",
    "중국어",
    "스페인어",
    "베트남어",
] as const;

export type LanguageDisplay = (typeof LANGUAGE_OPTIONS)[number];

export const LANGUAGE_UI: Record<
    LanguageDisplay,
    { nativeLabel: string; changeLabel: string }
> = {
    한국어: { nativeLabel: "한국어", changeLabel: "변경" },
    영어: { nativeLabel: "English", changeLabel: "Change" },
    일본어: { nativeLabel: "日本語", changeLabel: "変更" },
    중국어: { nativeLabel: "中文", changeLabel: "更改" },
    스페인어: { nativeLabel: "Español", changeLabel: "Cambiar" },
    베트남어: { nativeLabel: "Tiếng Việt", changeLabel: "Thay đổi" },
};

const FLAG_BY_LANGUAGE_DISPLAY: Record<string, string> = {
    한국어: KoreaFlag,
    영어: EnglishFlag,
    일본어: JapanFlag,
    日本語: JapanFlag,
    중국어: ChinaFlag,
    스페인어: SpainFlag,
    베트남어: VietnamFlag,
    KO: KoreaFlag,
    EN: EnglishFlag,
    JA: JapanFlag,
    ZH: ChinaFlag,
    ES: SpainFlag,
    VI: VietnamFlag,
    ko: KoreaFlag,
    en: EnglishFlag,
    ja: JapanFlag,
    zh: ChinaFlag,
    es: SpainFlag,
    vi: VietnamFlag,
};

export function languageDisplayToFlag(display: string): string | undefined {
    return FLAG_BY_LANGUAGE_DISPLAY[display.trim()];
}

export function languageCodeToFlag(code: string): string | undefined {
    const normalized = code.trim();
    return (
        FLAG_BY_LANGUAGE_DISPLAY[normalized] ??
        FLAG_BY_LANGUAGE_DISPLAY[normalized.toLowerCase()] ??
        FLAG_BY_LANGUAGE_DISPLAY[normalized.toUpperCase()]
    );
}

export function getStoryInit(profileId: number) {
    const query = new URLSearchParams({ profileId: String(profileId) });
    return apiFetch(`/api/stories/init?${query}`) as Promise<StoryInitResponse>;
}
