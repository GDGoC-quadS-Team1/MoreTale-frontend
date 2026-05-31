import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import { getStoryDetail, saveStory } from "../../apis/stories";
import {
    getStoryInit,
    languageDisplayToFlag,
    type StoryInitData,
} from "../../apis/tale";
import { getProfileId } from "../../lib/auth";
import Flower from "../../assets/images/tale/flower.png";

type CompleteLocationState = {
    profileId?: number;
};

const CompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as CompleteLocationState | null;

    const [storyInit, setStoryInit] = useState<StoryInitData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const profileId = state?.profileId ?? getProfileId();
        if (profileId == null) {
            setError("프로필 정보를 찾을 수 없습니다.");
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const { data } = await getStoryInit(profileId);
                if (!cancelled) {
                    setStoryInit(data);
                    setError(null);
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
    }, [state?.profileId]);

    const firstFlag = storyInit
        ? languageDisplayToFlag(storyInit.firstLanguageDisplay)
        : undefined;
    const secondFlag = storyInit
        ? languageDisplayToFlag(storyInit.secondLanguageDisplay)
        : undefined;

    const handleSaveToLibrary = async () => {
        if (!storyInit?.storyId) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            const { data } = await getStoryDetail(storyInit.storyId);
            const slides = [...data.slides]
                .sort((a, b) => a.order - b.order)
                .map(
                    ({
                        order,
                        imageUrl,
                        textKr,
                        textNative,
                        audioUrlKr,
                        audioUrlNative,
                    }) => ({
                        order,
                        imageUrl,
                        textKr,
                        textNative,
                        audioUrlKr,
                        audioUrlNative,
                    }),
                );

            await saveStory({
                title: data.title,
                prompt: data.prompt,
                profileId: storyInit.profileId,
                slides,
            });
            navigate("/lib");
        } catch {
            setSaveError("도서관에 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                <Title>이야기가 다 만들어졌어요!</Title>
                {error && <ErrorText>{error}</ErrorText>}
                <RowContainer>
                    <BookImageContainer>
                        <FlowerImage height={380} src={Flower} alt="" />
                        {storyInit?.coverImageUrl && (
                            <BookImage
                                height={260}
                                src={storyInit.coverImageUrl}
                                alt={storyInit.recommendedTaleTitle ?? ""}
                            />
                        )}
                        {storyInit?.recommendedTaleTitle && (
                            <TaleTitle>{storyInit.recommendedTaleTitle}</TaleTitle>
                        )}
                    </BookImageContainer>
                    <ColumnContainer>
                        <FlagContainer>
                            {isLoading ? (
                                <FlagPlaceholder />
                            ) : (
                                <>
                                    {firstFlag ? (
                                        <Image
                                            height={96}
                                            src={firstFlag}
                                            alt={storyInit?.firstLanguageDisplay ?? ""}
                                        />
                                    ) : (
                                        <LanguageLabel>
                                            {storyInit?.firstLanguageDisplay}
                                        </LanguageLabel>
                                    )}
                                    {secondFlag ? (
                                        <Image
                                            height={96}
                                            src={secondFlag}
                                            alt={storyInit?.secondLanguageDisplay ?? ""}
                                        />
                                    ) : (
                                        <LanguageLabel>
                                            {storyInit?.secondLanguageDisplay}
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
                            onClick={() => {
                                if (storyInit?.storyId != null) {
                                    navigate(`/tale/read/${storyInit.storyId}`);
                                }
                            }}
                            disabled={isLoading || !!error || storyInit?.storyId == null}
                        >
                            이야기 보러 가기
                        </YellowButton>
                        {saveError && <SaveErrorText>{saveError}</SaveErrorText>}
                        <YellowButton
                            type="button"
                            width={320}
                            height={68}
                            fontSize={28}
                            borderRadius={5}
                            backgroundColor={"#515050"}
                            color={"#FFDE21"}
                            onClick={handleSaveToLibrary}
                            disabled={
                                isLoading ||
                                isSaving ||
                                !!error ||
                                storyInit?.storyId == null
                            }
                        >
                            {isSaving ? "저장 중..." : "도서관에 넣기"}
                        </YellowButton>
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
    width: 540px;
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

const TaleTitle = styled.p`
    position: absolute;
    z-index: 2;
    margin: 120px 0 0;
    max-width: 280px;
    color: #1F1F1F;
    font-size: 22px;
    font-weight: 800;
    text-align: center;
    line-height: 1.3;
    pointer-events: none;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 150px;
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
    padding-top: 16px;
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
