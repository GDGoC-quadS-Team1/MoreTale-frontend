import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import { saveStory } from "../../apis/stories";
import {
    getStoryInit,
    languageCodeToFlag,
    languageDisplayToFlag,
    type StoryInitData,
} from "../../apis/tale";
import { resolveProfileId } from "../../apis/user";
import {
    clearTaleGenerationSession,
    loadTaleGenerationSession,
    type TaleGenerationSession,
} from "../../lib/taleGenerationSession";
import Flower from "../../assets/images/tale/flower.png";

type CompleteLocationState = {
    profileId?: number;
};

const CompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as CompleteLocationState | null;

    const [generationSession] = useState<TaleGenerationSession | null>(() =>
        loadTaleGenerationSession(),
    );
    const [storyInit, setStoryInit] = useState<StoryInitData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedStoryId, setSavedStoryId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const generatedResult = generationSession?.result;
    const isOnboardingFlow = !generatedResult;

    const displayTitle = generatedResult?.title ?? storyInit?.recommendedTaleTitle ?? "";
    const coverImageUrl = useMemo(() => {
        if (generatedResult?.slides?.length) {
            const firstSlide = [...generatedResult.slides].sort(
                (a, b) => a.order - b.order,
            )[0];
            return firstSlide?.imageUrl?.trim() || null;
        }
        return storyInit?.coverImageUrl ?? null;
    }, [generatedResult, storyInit?.coverImageUrl]);

    const firstFlag = generatedResult
        ? languageCodeToFlag(generatedResult.primaryLanguage)
        : storyInit
          ? languageDisplayToFlag(storyInit.firstLanguageDisplay)
          : undefined;
    const secondFlag = generatedResult
        ? languageCodeToFlag(generatedResult.secondaryLanguage)
        : storyInit
          ? languageDisplayToFlag(storyInit.secondLanguageDisplay)
          : undefined;

    useEffect(() => {
        if (generatedResult) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            const profileId = state?.profileId ?? (await resolveProfileId());
            if (profileId == null) {
                if (!cancelled) {
                    setError("프로필 정보를 찾을 수 없습니다.");
                    setIsLoading(false);
                }
                return;
            }

            try {
                const { data } = await getStoryInit(profileId);
                if (!cancelled) {
                    setStoryInit(data);
                    if (!data.storyId) {
                        setError("생성된 동화를 찾을 수 없습니다. 새 이야기를 만들어 주세요.");
                    } else {
                        setError(null);
                    }
                }
            } catch {
                if (!cancelled) {
                    setError("동화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [generatedResult, state?.profileId]);

    /** 3단계: POST /api/stories — 2단계 결과를 DB에 저장 */
    const persistGeneratedStory = async (): Promise<number> => {
        if (savedStoryId != null) {
            return savedStoryId;
        }

        if (!generationSession?.result) {
            throw new Error("생성된 동화 데이터가 없습니다.");
        }

        const profileId =
            generationSession.profileId ??
            state?.profileId ??
            (await resolveProfileId());
        if (profileId == null) {
            throw new Error("프로필 정보를 찾을 수 없습니다.");
        }

        const slides = [...generationSession.result.slides].sort(
            (a, b) => a.order - b.order,
        );

        const { data } = await saveStory({
            title: generationSession.result.title,
            prompt: generationSession.prompt,
            profileId,
            slides,
        });

        setSavedStoryId(data.storyId);
        return data.storyId;
    };

    const handleSaveToLibrary = async () => {
        if (!generatedResult) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            await persistGeneratedStory();
            clearTaleGenerationSession();
            navigate("/lib");
        } catch {
            setSaveError("도서관에 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReadStory = async () => {
        if (generatedResult) {
            try {
                const storyId = await persistGeneratedStory();
                clearTaleGenerationSession();
                navigate(`/tale/read/${storyId}`);
            } catch {
                setError("이야기를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
            }
            return;
        }

        if (storyInit?.storyId != null) {
            navigate(`/tale/read/${storyInit.storyId}`);
        }
    };

    const canRead =
        !isLoading &&
        !error &&
        (generatedResult != null || storyInit?.storyId != null);

    const canSave = !isLoading && !error && generatedResult != null;

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                <Title>이야기가 다 만들어졌어요!</Title>
                {error && <ErrorText>{error}</ErrorText>}
                <RowContainer>
                    <BookImageContainer>
                        <FlowerImage height={380} src={Flower} alt="" />
                        {coverImageUrl && (
                            <BookImage
                                height={260}
                                src={coverImageUrl}
                                alt={displayTitle}
                            />
                        )}
                    </BookImageContainer>
                    <ColumnContainer>
                        <FlagContainer>
                            {isLoading ? (
                                <FlagPlaceholder />
                            ) : (
                                <>
                                    {firstFlag ? (
                                        <Image height={96} src={firstFlag} alt="" />
                                    ) : (
                                        <LanguageLabel>
                                            {generatedResult?.primaryLanguage ??
                                                storyInit?.firstLanguageDisplay}
                                        </LanguageLabel>
                                    )}
                                    {secondFlag ? (
                                        <Image height={96} src={secondFlag} alt="" />
                                    ) : (
                                        <LanguageLabel>
                                            {generatedResult?.secondaryLanguage ??
                                                storyInit?.secondLanguageDisplay}
                                        </LanguageLabel>
                                    )}
                                </>
                            )}
                        </FlagContainer>
                        <YellowButton
                            type="button"
                            width={320}
                            height={68}
                            fontSize={28}
                            borderRadius={5}
                            onClick={handleReadStory}
                            disabled={!canRead}
                        >
                            이야기 보러 가기
                        </YellowButton>
                        {saveError && <SaveErrorText>{saveError}</SaveErrorText>}
                        {!isOnboardingFlow && (
                            <YellowButton
                                type="button"
                                width={320}
                                height={68}
                                fontSize={28}
                                borderRadius={5}
                                backgroundColor={"#515050"}
                                color={"#FFDE21"}
                                onClick={handleSaveToLibrary}
                                disabled={!canSave || isSaving}
                            >
                                {isSaving ? "저장 중..." : "도서관에 넣기"}
                            </YellowButton>
                        )}
                    </ColumnContainer>
                </RowContainer>
            </Container>
        </Wrapper>
    );
};

export default CompletePage;

const Wrapper = styled.div`
    background: #FFDE21;
    width: 100%;
    min-width: 1200px;
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
`;

const SaveErrorText = styled.p`
    margin: 0;
    color: #F02828;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    max-width: 320px;
    line-height: 1.4;
`;

const Image = styled.img`
    height: ${(props) => props.height}px;
    border: 1px solid #A0A0A0;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const BookImageContainer = styled.div`
    position: relative;
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FlowerImage = styled.img`
    height: ${(props) => props.height}px;
`;

const BookImage = styled(Image)`
    position: absolute;
    z-index: 1;
    margin-top: -140px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 100px;
`;

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const FlagContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 33px;
    margin-bottom: 20px;
    min-height: 96px;
`;

const FlagPlaceholder = styled.div`
    width: 225px;
    height: 96px;
`;

const LanguageLabel = styled.span`
    color: #1F1F1F;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    min-width: 80px;
`;
