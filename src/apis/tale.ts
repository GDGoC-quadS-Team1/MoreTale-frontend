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
};

type StoryInitResponse = {
    success: boolean;
    data: StoryInitData;
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
};

export function languageDisplayToFlag(display: string): string | undefined {
    return FLAG_BY_LANGUAGE_DISPLAY[display.trim()];
}

export function getStoryInit(profileId: number) {
    const query = new URLSearchParams({ profileId: String(profileId) });
    return apiFetch(`/api/stories/init?${query}`) as Promise<StoryInitResponse>;
}
