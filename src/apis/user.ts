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

export type MyPageAccountInfo = {
    userId: number;
    email: string;
    nickname: string;
    provider: string;
    createdAt: string;
};

export type MyPageProfile = {
    profileId: number;
    userId: number;
    nickname: string;
    childName: string;
    childAge: number;
    ageGroup: AgeGroup;
    firstLanguage: LanguageCode;
    customFirstLanguage?: string;
    firstLanguageDisplay: string;
    secondLanguage: LanguageCode;
    customSecondLanguage?: string;
    secondLanguageDisplay: string;
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
    createdAt: string;
    updatedAt: string;
};

export type MyPageUsageStatus = {
    honeyJarCount: number;
    canGenerateFreeStory: boolean;
    remainingHoneyJarForFree: number;
    totalStoriesCreated: number;
};

export type MyPageRecentStory = {
    storyId: number;
    title: string;
    childName: string;
    primaryLanguage: string;
    secondaryLanguage: string;
    thumbnailUrl: string;
    isPublic: boolean;
    createdAt: string;
};

export type MyPageData = {
    accountInfo: MyPageAccountInfo;
    profiles: MyPageProfile[];
    usageStatus: MyPageUsageStatus;
    recentStories: MyPageRecentStory[];
};

const PROFICIENCY_STAGE_LABEL: Record<ProficiencyLevel, string> = {
    EGG: "이제 막 배우는 알",
    LARVA: "조금 알아듣는 애벌레",
    PUPA: "어느 정도 익숙한 번데기",
    BEE: "혼자서도 읽는 꿀벌",
};

const STORY_PREFERENCE_TAG: Record<Exclude<StoryPreference, "CUSTOM">, string> = {
    WARM_HUG: "#포근포근_안아주는_이야기",
    FUN_ADVENTURE: "#신나는_모험_이야기",
    DAILY_LIFE: "#오늘_하루를_닮은_이야기",
};

/** 무료 동화 1회 생성에 필요한 꿀단지 수 */
export const HONEY_JARS_PER_STORY = 10;

/** 무료 생성까지 모은 꿀단지 수 (UI 진행률용) */
export function getHoneyProgressCollected(usage: MyPageUsageStatus): number {
    return Math.min(
        HONEY_JARS_PER_STORY,
        Math.max(0, HONEY_JARS_PER_STORY - usage.remainingHoneyJarForFree),
    );
}

export function getHoneyWarehouseDisplay(usage: MyPageUsageStatus) {
    return {
        honeyJarCount: usage.honeyJarCount,
        filledJars: getHoneyProgressCollected(usage),
        totalCount: HONEY_JARS_PER_STORY,
        remainingForFree: usage.remainingHoneyJarForFree,
        canGenerateFreeStory: usage.canGenerateFreeStory,
    };
}

/** 가입 시 제공되는 무료 동화 생성 횟수 (꿀 창고와 별개) */
export const FREE_STORY_QUOTA = 5;

export function getUsageStatusDisplay(usage: MyPageUsageStatus) {
    const freeStoriesUsed = Math.min(usage.totalStoriesCreated, FREE_STORY_QUOTA);
    const remainingFreeStories = Math.max(FREE_STORY_QUOTA - freeStoriesUsed, 0);

    return {
        totalStoriesCreated: usage.totalStoriesCreated,
        freeStoriesUsed,
        freeStoryQuota: FREE_STORY_QUOTA,
        remainingFreeStories,
        usageProgress: freeStoriesUsed / FREE_STORY_QUOTA,
        canGenerateFreeStory: usage.canGenerateFreeStory,
    };
}

export function formatLanguageProficiencyLine(
    languageDisplay: string,
    proficiency: ProficiencyLevel,
): string {
    return `${languageDisplay} | ${PROFICIENCY_STAGE_LABEL[proficiency]} 단계`;
}

export function formatGuardianLanguageLine(profile: MyPageProfile): string {
    const guardianLang = profile.secondLanguageDisplay;
    const childLang = profile.firstLanguageDisplay;

    switch (profile.familyStructure) {
        case "TWO_PARENTS":
            return `엄마 (${guardianLang}), 아빠 (${childLang})`;
        case "ONE_PARENT":
            return `보호자 (${guardianLang})`;
        case "CUSTOM":
            return profile.customFamilyStructure?.trim() || guardianLang;
        case "SECRET":
            return "가족 구성 비공개";
        case "EXTENDED_FAMILY":
        default:
            return `가족 (${guardianLang})`;
    }
}

export function formatStoryPreferenceTag(profile: MyPageProfile): string {
    if (profile.storyPreference === "CUSTOM") {
        const custom = profile.customStoryPreference?.trim();
        if (!custom) return "#맞춤_이야기";
        return custom.startsWith("#") ? custom : `#${custom.replace(/\s+/g, "_")}`;
    }
    return STORY_PREFERENCE_TAG[profile.storyPreference];
}

export function buildMyPageInfoRows(profile: MyPageProfile) {
    return [
        {
            label: "사용 언어",
            lines: [
                formatLanguageProficiencyLine(
                    profile.firstLanguageDisplay,
                    profile.firstLanguageProficiency,
                ),
                formatLanguageProficiencyLine(
                    profile.secondLanguageDisplay,
                    profile.secondLanguageProficiency,
                ),
            ],
            variant: "default" as const,
        },
        {
            label: "보호자 언어",
            lines: [formatGuardianLanguageLine(profile)],
            variant: "default" as const,
        },
        {
            label: "듣고 싶은 이야기",
            lines: [formatStoryPreferenceTag(profile)],
            variant: "tag" as const,
        },
    ];
}

export function getMyPage() {
    return apiFetch("/api/users/mypage") as Promise<{ data: MyPageData }>;
}

export function deleteUser() {
    return apiFetch("/api/users/delete", {
        method: "DELETE",
    }) as Promise<{ success: boolean; data: Record<string, never>; message: string }>;
}
