import { apiFetch } from "../lib/api";

export type UserResponse = {
    userId: number;
    email: string;
    nickname: string;
    role: string;
    createdAt: string;
};

export type AgeGroup =
    | "AGE_0_2"
    | "AGE_3_4"
    | "AGE_5_6"
    | "AGE_7_8"
    | "AGE_9_10"
    | "AGE_10_PLUS";

export type LanguageCode = "KO" | "EN" | "JA" | "ZH" | "ES" | "VI" | "OTHER";

export type ProficiencyLevel = "EGG" | "LARVA" | "PUPA" | "BEE";

export type FamilyStructure =
    | "ONE_PARENT"
    | "TWO_PARENTS"
    | "EXTENDED_FAMILY"
    | "SECRET"
    | "CUSTOM";

export type StoryPreference = "WARM_HUG" | "FUN_ADVENTURE" | "DAILY_LIFE" | "CUSTOM";

export type CreateProfileRequest = {
    childName: string;
    ageGroup: AgeGroup;
    firstLanguage: LanguageCode;
    customFirstLanguage?: string;
    secondLanguage: LanguageCode;
    customSecondLanguage?: string;
    firstLanguageProficiency: ProficiencyLevel;
    secondLanguageProficiency: ProficiencyLevel;
    firstLanguageListening: ProficiencyLevel;
    firstLanguageSpeaking: ProficiencyLevel;
    secondLanguageListening: ProficiencyLevel;
    secondLanguageSpeaking: ProficiencyLevel;
    familyStructure: FamilyStructure;
    customFamilyStructure?: string;
    storyPreference: StoryPreference;
    customStoryPreference?: string;
    childNationality?: string;
    parentCountry?: string;
};

const LANGUAGE_META: Record<string, { code: LanguageCode; country: string }> = {
    한국어: { code: "KO", country: "KR" },
    영어: { code: "EN", country: "US" },
    일본어: { code: "JA", country: "JP" },
    중국어: { code: "ZH", country: "CN" },
    스페인어: { code: "ES", country: "ES" },
    베트남어: { code: "VI", country: "VN" },
};

const STORY_PREFERENCE_MAP: Record<string, StoryPreference> = {
    "포근포근 안아주는 이야기": "WARM_HUG",
    "신나는 모험 이야기": "FUN_ADVENTURE",
    "오늘 하루를 닮은 이야기": "DAILY_LIFE",
};

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
    EGG: 0,
    LARVA: 1,
    PUPA: 2,
    BEE: 3,
};

export function ageToAgeGroup(age: number): AgeGroup {
    const n = Math.min(18, Math.max(0, Math.round(age)));
    if (n <= 2) return "AGE_0_2";
    if (n <= 4) return "AGE_3_4";
    if (n <= 6) return "AGE_5_6";
    if (n <= 8) return "AGE_7_8";
    if (n <= 10) return "AGE_9_10";
    return "AGE_10_PLUS";
}

export function uiProficiencyToApi(key: string | null): ProficiencyLevel | undefined {
    if (!key) return undefined;
    const map: Record<string, ProficiencyLevel> = {
        egg: "EGG",
        larva: "LARVA",
        pupa: "PUPA",
        bee: "BEE",
    };
    return map[key];
}

function parseLanguage(input: string): {
    code: LanguageCode;
    custom?: string;
    country?: string;
} {
    const trimmed = input.trim();
    const meta = LANGUAGE_META[trimmed];
    if (meta) return { code: meta.code, country: meta.country };
    if (trimmed === "기타") {
        return { code: "OTHER" };
    }
    if (!trimmed) {
        return { code: "OTHER" };
    }
    return { code: "OTHER", custom: trimmed };
}

function overallProficiency(
    listening: ProficiencyLevel,
    speaking: ProficiencyLevel
): ProficiencyLevel {
    return PROFICIENCY_RANK[listening] >= PROFICIENCY_RANK[speaking]
        ? listening
        : speaking;
}

function mapFamilyStructure(
    livingWith: string[],
    livingWithOther: string
): Pick<CreateProfileRequest, "familyStructure" | "customFamilyStructure"> {
    const customFamily = livingWithOther.trim();
    if (customFamily) {
        return { familyStructure: "CUSTOM", customFamilyStructure: customFamily };
    }

    const selected = new Set(livingWith);
    if (selected.has("엄마") && selected.has("아빠") && selected.size === 2) {
        return { familyStructure: "TWO_PARENTS" };
    }
    if (
        (selected.has("엄마") || selected.has("아빠")) &&
        !selected.has("할아버지") &&
        !selected.has("할머니") &&
        !selected.has("형제자매") &&
        selected.size === 1
    ) {
        return { familyStructure: "ONE_PARENT" };
    }

    return { familyStructure: "EXTENDED_FAMILY" };
}

export type SignUpFormState = {
    name: string;
    age: string;
    livingWith: string[];
    livingWithOther: string;
    protagonistLanguages: string;
    guardianLanguages: string;
    listeningLevel: string | null;
    speakingLevel: string | null;
    listeningLevel2: string | null;
    speakingLevel2: string | null;
    storyPreference: string | null;
    storyPreferenceOther: string;
};

export function validateSignUpForm(form: SignUpFormState): string | null {
    if (!form.name.trim()) return "이름을 입력해주세요.";
    if (!form.protagonistLanguages.trim()) return "주인공의 사용 언어를 입력해주세요.";
    if (!form.guardianLanguages.trim()) return "보호자의 사용 언어를 입력해주세요.";

    const firstLang = parseLanguage(form.protagonistLanguages);
    const secondLang = parseLanguage(form.guardianLanguages);
    if (firstLang.code === "OTHER" && !firstLang.custom) {
        return "제1언어를 직접 입력해주세요.";
    }
    if (secondLang.code === "OTHER" && !secondLang.custom) {
        return "제2언어를 직접 입력해주세요.";
    }

    if (!form.listeningLevel || !form.speakingLevel) {
        return "첫 번째 말의 듣기·말하기 수준을 선택해주세요.";
    }
    if (!form.listeningLevel2 || !form.speakingLevel2) {
        return "두 번째 말의 듣기·말하기 수준을 선택해주세요.";
    }

    if (!form.storyPreference && !form.storyPreferenceOther.trim()) {
        return "좋아하는 이야기를 선택하거나 입력해주세요.";
    }

    const customFamily = form.livingWithOther.trim();
    if (form.livingWith.length === 0 && !customFamily) {
        return "누구와 함께 사는지 선택하거나 입력해주세요.";
    }
    if (customFamily && customFamily.length > 200) {
        return "가족 구조 직접 입력은 200자 이하여야 합니다.";
    }

    return null;
}

export function buildCreateProfileRequest(form: SignUpFormState): CreateProfileRequest {
    const firstLang = parseLanguage(form.protagonistLanguages);
    const secondLang = parseLanguage(form.guardianLanguages);

    const firstListening = uiProficiencyToApi(form.listeningLevel)!;
    const firstSpeaking = uiProficiencyToApi(form.speakingLevel)!;
    const secondListening = uiProficiencyToApi(form.listeningLevel2)!;
    const secondSpeaking = uiProficiencyToApi(form.speakingLevel2)!;

    const storyOther = form.storyPreferenceOther.trim();
    let storyPreference: StoryPreference = "FUN_ADVENTURE";
    let customStoryPreference: string | undefined;
    if (storyOther) {
        storyPreference = "CUSTOM";
        customStoryPreference = storyOther;
    } else if (form.storyPreference) {
        storyPreference = STORY_PREFERENCE_MAP[form.storyPreference] ?? "CUSTOM";
        if (storyPreference === "CUSTOM") {
            customStoryPreference = form.storyPreference;
        }
    }

    const body: CreateProfileRequest = {
        childName: form.name.trim(),
        ageGroup: ageToAgeGroup(Number(form.age)),
        firstLanguage: firstLang.code,
        secondLanguage: secondLang.code,
        firstLanguageListening: firstListening,
        firstLanguageSpeaking: firstSpeaking,
        firstLanguageProficiency: overallProficiency(firstListening, firstSpeaking),
        secondLanguageListening: secondListening,
        secondLanguageSpeaking: secondSpeaking,
        secondLanguageProficiency: overallProficiency(secondListening, secondSpeaking),
        ...mapFamilyStructure(form.livingWith, form.livingWithOther),
        storyPreference,
    };

    if (firstLang.custom) body.customFirstLanguage = firstLang.custom;
    if (secondLang.custom) body.customSecondLanguage = secondLang.custom;
    if (customStoryPreference) body.customStoryPreference = customStoryPreference;
    if (firstLang.country) body.childNationality = firstLang.country;
    if (secondLang.country) body.parentCountry = secondLang.country;

    return body;
}

export function getCurrentUser() {
    return apiFetch("/api/users/me") as Promise<{ data: UserResponse }>;
}

export type CreateProfileResponse = {
    profileId: number;
};

export function createUserProfile(body: CreateProfileRequest) {
    return apiFetch("/api/users/profile", {
        method: "POST",
        body: JSON.stringify(body),
    }) as Promise<{ data: CreateProfileResponse }>;
}
