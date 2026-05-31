import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import { getMyPage } from "../../apis/user";
import {
    buildGenerateStoryRequest,
    generateStory,
    getStoryInit,
    LANGUAGE_OPTIONS,
    LANGUAGE_UI,
    languageDisplayToFlag,
    type LanguageDisplay,
    type TaleFlowLocationState,
} from "../../apis/tale";
import { setProfileId } from "../../lib/auth";
import {
    loadTaleGenerationSession,
    saveTaleGenerationSession,
} from "../../lib/taleGenerationSession";

type LanguageSlot = "first" | "second";

function isLanguageDisplay(value: string): value is LanguageDisplay {
    return (LANGUAGE_OPTIONS as readonly string[]).includes(value);
}

function getLanguageUi(language: string) {
    if (isLanguageDisplay(language)) {
        return LANGUAGE_UI[language];
    }
    return { nativeLabel: language, changeLabel: "변경" };
}

const LanguagePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const flowState = location.state as TaleFlowLocationState | null;
    const session = loadTaleGenerationSession();
    const prompt =
        flowState?.prompt?.trim() ?? session?.prompt?.trim() ?? "";

    const [firstLanguage, setFirstLanguage] = useState<LanguageDisplay>("한국어");
    const [secondLanguage, setSecondLanguage] = useState<LanguageDisplay>("영어");
    const [editingSlot, setEditingSlot] = useState<LanguageSlot | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (flowState?.generationError) {
            setError(flowState.generationError);
        }
    }, [flowState?.generationError]);

    useEffect(() => {
        if (!prompt) {
            navigate("/tale/prompt", { replace: true });
        }
    }, [prompt, navigate]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { data } = await getMyPage();
                const profile = data.profiles[0];
                if (!cancelled && profile) {
                    let nextFirst: LanguageDisplay = firstLanguage;
                    let nextSecond: LanguageDisplay = secondLanguage;

                    if (isLanguageDisplay(profile.firstLanguageDisplay)) {
                        nextFirst = profile.firstLanguageDisplay;
                    }
                    if (isLanguageDisplay(profile.secondLanguageDisplay)) {
                        nextSecond = profile.secondLanguageDisplay;
                    }

                    if (nextFirst === nextSecond) {
                        const alternative = LANGUAGE_OPTIONS.find((lang) => lang !== nextFirst);
                        if (alternative) {
                            nextSecond = alternative;
                        }
                    }

                    setFirstLanguage(nextFirst);
                    setSecondLanguage(nextSecond);
                }
            } catch {
                // 프로필을 불러오지 못하면 기본값
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const getAvailableOptions = (slot: LanguageSlot) => {
        const excluded = slot === "first" ? secondLanguage : firstLanguage;
        return LANGUAGE_OPTIONS.filter((lang) => lang !== excluded);
    };

    const handleStartGeneration = async () => {
        if (!prompt || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { data: myPage } = await getMyPage();
            const profile = myPage.profiles[0];
            if (!profile) {
                setError("로그인 후 다시 시도해 주세요.");
                return;
            }

            setProfileId(profile.profileId);

            const { data: init } = await getStoryInit(profile.profileId);
            const body = buildGenerateStoryRequest(
                profile,
                init,
                prompt,
                firstLanguage,
                secondLanguage,
            );

            const { data: job } = await generateStory(body);

            saveTaleGenerationSession({
                jobId: job.jobId,
                profileId: profile.profileId,
                prompt,
                generationStartedAt: Date.now(),
            });

            navigate("/tale/loading");
        } catch {
            setError("동화 생성을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderLanguageItem = (
        language: LanguageDisplay,
        slot: LanguageSlot,
        onSelect: (lang: LanguageDisplay) => void,
    ) => {
        const ui = getLanguageUi(language);
        const flag = languageDisplayToFlag(language);
        const availableOptions = getAvailableOptions(slot);

        return (
            <LanguageItem>
                <FlagImage src={flag} alt={ui.nativeLabel} />
                <LanguageText>{ui.nativeLabel}</LanguageText>
                <ChangeButton
                    type="button"
                    onClick={() => setEditingSlot(editingSlot === slot ? null : slot)}
                >
                    {ui.changeLabel}
                </ChangeButton>
                {editingSlot === slot && (
                    <LanguagePicker>
                        {availableOptions.map((lang) => {
                            const optionUi = LANGUAGE_UI[lang];
                            const optionFlag = languageDisplayToFlag(lang);

                            return (
                                <PickerItem
                                    key={lang}
                                    type="button"
                                    $selected={lang === language}
                                    onClick={() => {
                                        onSelect(lang);
                                        setEditingSlot(null);
                                    }}
                                >
                                    {optionFlag ? (
                                        <PickerFlag src={optionFlag} alt={optionUi.nativeLabel} />
                                    ) : (
                                        <PickerFlagPlaceholder />
                                    )}
                                    <PickerLabel>{optionUi.nativeLabel}</PickerLabel>
                                </PickerItem>
                            );
                        })}
                    </LanguagePicker>
                )}
            </LanguageItem>
        );
    };

    if (!prompt) {
        return null;
    }

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                <Title>두 가지 언어로<br/>이야기를 만들어볼게요!</Title>
                <LanguageContainer>
                    {renderLanguageItem(firstLanguage, "first", setFirstLanguage)}
                    {renderLanguageItem(secondLanguage, "second", setSecondLanguage)}
                </LanguageContainer>
                {error && <ErrorText>{error}</ErrorText>}
                <YellowButton
                    type="button"
                    width={158}
                    height={63}
                    fontSize={30}
                    borderRadius={5}
                    onClick={handleStartGeneration}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "준비 중..." : "좋아요!"}
                </YellowButton>
            </Container>
        </Wrapper>
    );
};

export default LanguagePage;

const Wrapper = styled.div`
    background: #FFDE21;
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const Container = styled.div`
    background: #FFFFFF;
    width: 100%;
    max-width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 72px;
    padding: 20px 0;
`;

const Title = styled.div`
    color: #1F1F1F;
    text-align: center;
    font-size: 35px;
    font-style: normal;
    font-weight: 800;
    line-height: 45px;
    cursor: default;
`;

const ErrorText = styled.p`
    margin: -48px 0 0;
    color: #F02828;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    max-width: 640px;
    line-height: 1.4;
`;

const FlagImage = styled.img`
    width: 320px;
    height: 214px;
    object-fit: cover;
    border: 1px solid #A0A0A0;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const LanguageContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 170px;
`;

const LanguageItem = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const LanguageText = styled.div`
    color: #1F1F1F;
    font-size: 33px;
    font-style: normal;
    font-weight: 700;
    line-height: 45px;
    text-align: center;
    cursor: default;
`;

const ChangeButton = styled.button`
    width: 100px;
    height: 32px;
    background: #CFCFCF;
    border: none;
    border-radius: 30px;
    color: #1F1F1F;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    cursor: pointer;
`;

const LanguagePicker = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 220px;
    max-height: 140px;
    padding: 12px;
    background: #FFFFFF;
    border: 1px solid #A0A0A0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    overscroll-behavior: contain;
`;

const PickerItem = styled.button<{ $selected: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    background: ${({ $selected }) => ($selected ? "#ffde21" : "#f5f5f5")};
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
        background: ${({ $selected }) => ($selected ? "#ffde21" : "#ececec")};
    }
`;

const PickerFlag = styled.img`
    width: 48px;
    height: 32px;
    object-fit: cover;
    border: 1px solid #d0d0d0;
    flex-shrink: 0;
`;

const PickerFlagPlaceholder = styled.div`
    width: 48px;
    height: 32px;
    border: 1px solid #d0d0d0;
    flex-shrink: 0;
    background: #f0f0f0;
`;

const PickerLabel = styled.span`
    color: #1f1f1f;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
`;
