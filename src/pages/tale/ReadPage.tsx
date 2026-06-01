import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import { getStoryDetail, type StoryDetail } from "../../apis/stories";
import { languageCodeToFlag } from "../../apis/tale";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import Finish from "../../assets/images/tale/finish.png";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";
import ArrowRightIcon from "../../assets/images/tale/arrow-right.svg";
import SpeakerIcon from "../../assets/images/tale/speaker.svg";
import BookmarkIcon from "../../assets/images/tale/bookmark.svg";
import LibraryIcon from "../../assets/images/icon/library.svg";
import SettingIcon from "../../assets/images/icon/setting.svg";

type ReadLocationState = {
    startFromLast?: boolean;
    storyId?: number;
};

const ReadPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { storyId: storyIdParam } = useParams<{ storyId: string }>();
    const locationState = location.state as ReadLocationState | null;

    const storyId =
        (storyIdParam ? Number(storyIdParam) : undefined) ??
        locationState?.storyId;

    const [story, setStory] = useState<StoryDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showFinishScreen, setShowFinishScreen] = useState(false);

    const audioPrimaryRef = useRef<HTMLAudioElement | null>(null);
    const audioSecondaryRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (storyId == null || Number.isNaN(storyId)) {
            setError("동화 정보를 찾을 수 없습니다.");
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const { data } = await getStoryDetail(storyId);
                if (!cancelled) {
                    const sortedSlides = [...data.slides].sort((a, b) => a.order - b.order);
                    const storySlides = sortedSlides.slice(1);
                    setStory({ ...data, slides: sortedSlides });
                    setError(null);
                    setShowFinishScreen(false);
                    setCurrentSlide(
                        locationState?.startFromLast && storySlides.length > 0
                            ? storySlides.length - 1
                            : 0,
                    );
                }
            } catch {
                if (!cancelled) {
                    setError("동화를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
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
    }, [storyId, locationState?.startFromLast]);

    const storySlides = useMemo(() => {
        if (!story?.slides.length) return [];
        return [...story.slides].sort((a, b) => a.order - b.order).slice(1);
    }, [story?.slides]);

    const slide = storySlides[currentSlide];
    const isFirstSlide = currentSlide === 0;
    const isLastSlide =
        storySlides.length > 0 && currentSlide === storySlides.length - 1;

    const primaryFlag = story ? languageCodeToFlag(story.primaryLanguage) : undefined;
    const secondaryFlag = story ? languageCodeToFlag(story.secondaryLanguage) : undefined;

    const handleLeftClick = () => {
        if (showFinishScreen) {
            setShowFinishScreen(false);
            setCurrentSlide(storySlides.length - 1);
            return;
        }
        if (isFirstSlide) return;
        setCurrentSlide((prev) => prev - 1);
    };

    const handleRightClick = () => {
        if (showFinishScreen) return;
        if (isLastSlide) {
            setShowFinishScreen(true);
            return;
        }
        setCurrentSlide((prev) => prev + 1);
    };

    const playPrimary = () => {
        if (audioPrimaryRef.current) {
            audioPrimaryRef.current.currentTime = 0;
            audioPrimaryRef.current.play();
        }
    };

    const playSecondary = () => {
        if (audioSecondaryRef.current) {
            audioSecondaryRef.current.currentTime = 0;
            audioSecondaryRef.current.play();
        }
    };

    const leftDisabled = showFinishScreen ? false : isFirstSlide;
    const rightDisabled = showFinishScreen;
    const pageLabel = showFinishScreen
        ? `${storySlides.length} / ${storySlides.length} 쪽`
        : `${currentSlide + 1} / ${storySlides.length} 쪽`;

    if (isLoading) {
        return (
            <Wrapper>
                <Header activeMenu="tale" />
                <Container>
                    <StatusText>동화를 불러오는 중이에요...</StatusText>
                </Container>
            </Wrapper>
        );
    }

    if (error || !story || storySlides.length === 0) {
        return (
            <Wrapper>
                <Header activeMenu="tale" />
                <Container>
                    <StatusText>{error ?? "동화를 불러올 수 없습니다."}</StatusText>
                </Container>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            {!showFinishScreen && slide && (
                <>
                    <audio
                        key={`primary-${slide.slideId}`}
                        ref={audioPrimaryRef}
                        src={slide.audioUrlKr}
                        preload="metadata"
                    />
                    <audio
                        key={`secondary-${slide.slideId}`}
                        ref={audioSecondaryRef}
                        src={slide.audioUrlNative}
                        preload="metadata"
                    />
                </>
            )}
            <Header activeMenu="tale" />
            <Container>
                <InfoContainer>
                    <LeftContainer>
                        <Title>{story.title}</Title>
                        <Icon src={PencilIcon} alt="" />
                    </LeftContainer>
                    <RightContainer>
                        <PageIndicator>{pageLabel}</PageIndicator>
                        <IconButton type="button"><Icon src={LibraryIcon} alt="" /></IconButton>
                        <IconButton type="button"><Icon src={SettingIcon} alt="" /></IconButton>
                    </RightContainer>
                </InfoContainer>

                <BookContainer>
                    {!showFinishScreen && <Bookmark src={BookmarkIcon} alt="" />}
                    <NavButton
                        $position="left"
                        type="button"
                        aria-label={showFinishScreen ? "마지막 페이지" : "이전 페이지"}
                        onClick={handleLeftClick}
                        disabled={leftDisabled}
                    >
                        <Image height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>
                    <NavButton
                        $position="right"
                        type="button"
                        aria-label="다음 페이지"
                        onClick={handleRightClick}
                        disabled={rightDisabled}
                    >
                        <Image height={26} src={ArrowRightIcon} alt="" />
                    </NavButton>

                    {showFinishScreen ? (
                        <FinishViewport>
                            <FinishBody>
                                <FinishText>
                                    &lt;{story.title}&gt;을 다 읽었어요!<br />
                                    오늘의 꿀스티커를 받아요!
                                </FinishText>
                                <ImageContainer>
                                    <HoneyImg src={Finish} alt="" />
                                </ImageContainer>
                                <ButtonGroup>
                                    <YellowButton type="button" onClick={() => navigate("/voca")}>
                                        단어장
                                    </YellowButton>
                                    <YellowButton type="button" onClick={() => navigate("/quiz")}>
                                        퀴즈 풀기
                                    </YellowButton>
                                </ButtonGroup>
                            </FinishBody>
                        </FinishViewport>
                    ) : (
                        slide && (
                            <>
                                <LeftSection>
                                    <PageImage src={slide.imageUrl} alt="" />
                                </LeftSection>
                                <RightSection>
                                    <TextContainer>
                                        {primaryFlag ? (
                                            <Flag src={primaryFlag} alt="" />
                                        ) : (
                                            <FlagPlaceholder>{story.primaryLanguage}</FlagPlaceholder>
                                        )}
                                        <Lang>
                                            <LangText>{slide.textKr}</LangText>
                                            <SpeakerButton type="button" aria-label="" onClick={playPrimary}>
                                                <Image height={36} src={SpeakerIcon} alt="" />
                                            </SpeakerButton>
                                        </Lang>
                                    </TextContainer>
                                    <TextContainer>
                                        {secondaryFlag ? (
                                            <Flag src={secondaryFlag} alt="" />
                                        ) : (
                                            <FlagPlaceholder>{story.secondaryLanguage}</FlagPlaceholder>
                                        )}
                                        <Lang>
                                            <LangText>{slide.textNative}</LangText>
                                            <SpeakerButton type="button" aria-label="" onClick={playSecondary}>
                                                <Image height={36} src={SpeakerIcon} alt="" />
                                            </SpeakerButton>
                                        </Lang>
                                    </TextContainer>
                                </RightSection>
                            </>
                        )
                    )}
                </BookContainer>
            </Container>
        </Wrapper>
    );
};

export default ReadPage;

const Wrapper = styled.div`
    background: #FFDE21;
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
`;

const Container = styled.div`
    background: #F2F2F2;
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 60px;
    box-sizing: border-box;
    overflow: auto;
`;

const StatusText = styled.p`
    margin: 0;
    color: #424242;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const RightContainer = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Title = styled.div`
    color: #1F1F1F;
    text-align: center;
    font-size: 40px;
    font-style: normal;
    font-weight: 800;
    line-height: 45px;
    cursor: default;
`;

const PageIndicator = styled.div`
    border-radius: 5px;
    border: 1px solid #424242;
    padding: 6px 12px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    color: #424242;
    background: #FFFFFF;
    margin-right: 4px;
`;

const IconButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
`;

const Image = styled.img`
    height: ${props => props.height}px;
`;

const Icon = styled.img`
    width: 29px;
    height: 29px;
`;

const InfoContainer = styled.div`
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    align-self: flex-start;
    z-index: 1;
    margin-bottom: 20px;
`;

const BookContainer = styled.div`
    width: 100%;
    position: relative;
    background: #FFFFFF;
    border-radius: 20px;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    overflow: visible;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    min-height: 0;
`;

const LeftSection = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0 24px 32px;
`;

const RightSection = styled.div`
    flex: 1.5;
    padding: 24px 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    min-width: 0;
    gap: 80px;
`;

const Bookmark = styled.img`
    position: absolute;
    top: -10px;
    right: 38px;
    width: 40px;
    height: 68px;
    z-index: 100;
    pointer-events: none;
`;

const NavButton = styled.button<{ $position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    ${props => props.$position === "left" ? "left: -28px;" : "right: -28px;"}
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 0.3px solid #808080;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    padding: 0;
    z-index: 10;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const FinishViewport = styled.div`
    flex: 1;
    width: 100%;
    min-width: 0;
    overflow: auto;
    border-radius: 20px;
`;

const FinishBody = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 80px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const FinishText = styled.div`
    color: #1F1F1F;
    font-size: 30px;
    font-weight: 700;
    font-style: normal;
    line-height: 45px;
    text-align: center;
    cursor: default;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 60px;
`;

const HoneyImg = styled.img`
    height: 220px;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const YellowButton = styled.button`
    width: 180px;
    padding: 8px 0;
    color: #424242;
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    border-radius: 20px;
    background: #FFDE21;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    border: none;
    cursor: pointer;
`;

const PageImage = styled.img`
    width: 100%;
    max-width: 580px;
    height: 100%;
    max-height: 580px;
    object-fit: contain;
    border-radius: 16px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
`;

const Flag = styled.img`
    width: 65px;
    height: 43px;
`;

const FlagPlaceholder = styled.div`
    width: 65px;
    min-height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #424242;
    text-align: center;
`;

const Lang = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
`;

const LangText = styled.div`
    font-family: "Ownglyph corncorn";
    color: #1F1F1F;
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: 45px;
`;

const SpeakerButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;
