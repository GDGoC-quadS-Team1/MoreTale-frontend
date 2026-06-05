import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import { getStoryDetail, type StoryDetail, type StoryToken } from "../../apis/stories";
import { saveVocabulary } from "../../apis/vocabulary";
import {
    completeStory,
    languageCodeToFlag,
    type StoryCompleteResponse,
} from "../../apis/tale";
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

type TextSegment =
    | { kind: "text"; value: string }
    | { kind: "token"; token: StoryToken };

function buildTextSegments(
    text: string,
    tokens: StoryToken[],
    getMatchText: (token: StoryToken) => string = (token) => token.text,
): TextSegment[] {
    const highlightTokens = tokens.filter((token) => token.highlight);
    if (!text || highlightTokens.length === 0) {
        return [{ kind: "text", value: text }];
    }

    const matches = highlightTokens
        .map((token) => {
            const matchText = getMatchText(token);
            if (!matchText) return null;
            const start = text.indexOf(matchText);
            if (start === -1) return null;
            return { start, end: start + matchText.length, token };
        })
        .filter((match): match is NonNullable<typeof match> => match != null)
        .sort((a, b) => a.start - b.start);

    const segments: TextSegment[] = [];
    let cursor = 0;

    for (const match of matches) {
        if (match.start < cursor) continue;
        if (match.start > cursor) {
            segments.push({ kind: "text", value: text.slice(cursor, match.start) });
        }
        segments.push({ kind: "token", token: match.token });
        cursor = match.end;
    }

    if (cursor < text.length) {
        segments.push({ kind: "text", value: text.slice(cursor) });
    }

    return segments.length > 0 ? segments : [{ kind: "text", value: text }];
}

const WORD_POPOVER_GAP = 8;
const WORD_POPOVER_ESTIMATED_HEIGHT = 200;

type WordPopoverPlacement = "top" | "bottom";
type WordPopoverContext = "kr" | "native";

function getWordPopoverPlacement(rect: DOMRect): WordPopoverPlacement {
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove >= WORD_POPOVER_ESTIMATED_HEIGHT + WORD_POPOVER_GAP) {
        return "top";
    }
    if (spaceBelow >= WORD_POPOVER_ESTIMATED_HEIGHT + WORD_POPOVER_GAP) {
        return "bottom";
    }
    return spaceBelow > spaceAbove ? "bottom" : "top";
}

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
    const [showCompleteNotice, setShowCompleteNotice] = useState(false);
    const completeRequestSentRef = useRef(false);

    const audioPrimaryRef = useRef<HTMLAudioElement | null>(null);
    const audioSecondaryRef = useRef<HTMLAudioElement | null>(null);
    const wordPopoverCloseTimerRef = useRef<number | null>(null);
    const activeWordAnchorRef = useRef<HTMLElement | null>(null);
    const wordAudioRef = useRef<HTMLAudioElement | null>(null);
    const [openTokenId, setOpenTokenId] = useState<number | null>(null);
    const [openTokenContext, setOpenTokenContext] = useState<WordPopoverContext | null>(
        null,
    );
    const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);
    const [popoverPlacement, setPopoverPlacement] =
        useState<WordPopoverPlacement>("top");
    const [bookmarkedTokenIds, setBookmarkedTokenIds] = useState<number[]>([]);
    const [savingTokenIds, setSavingTokenIds] = useState<number[]>([]);

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
                    setShowCompleteNotice(false);
                    completeRequestSentRef.current = false;
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
            setShowCompleteNotice(false);
            setCurrentSlide(storySlides.length - 1);
            return;
        }
        if (isFirstSlide) return;
        setCurrentSlide((prev) => prev - 1);
    };

    const handleRightClick = async () => {
        if (showFinishScreen) return;
        if (isLastSlide) {
            const shouldCallCompleteApi = !completeRequestSentRef.current;
            setShowFinishScreen(true);
            setShowCompleteNotice(false);
            if (shouldCallCompleteApi) {
                completeRequestSentRef.current = true;
                const completeStoryId = story?.storyId ?? storyId;
                if (completeStoryId != null) {
                    try {
                        const response: StoryCompleteResponse = await completeStory(
                            completeStoryId,
                        );
                        const rewardGranted =
                            response.success && response.data.earnedHoneyJars > 0;
                        setShowCompleteNotice(rewardGranted);
                    } catch {
                        // '오늘의 꿀스티커를 받아요!' 문구 최초 1회만 출력
                        setShowCompleteNotice(false);
                    }
                }
            }
            return;
        }
        setCurrentSlide((prev) => prev + 1);
    };

    const stopAllTts = () => {
        if (audioPrimaryRef.current) {
            audioPrimaryRef.current.pause();
            audioPrimaryRef.current.currentTime = 0;
        }
        if (audioSecondaryRef.current) {
            audioSecondaryRef.current.pause();
            audioSecondaryRef.current.currentTime = 0;
        }
        if (wordAudioRef.current) {
            wordAudioRef.current.pause();
            wordAudioRef.current.currentTime = 0;
            wordAudioRef.current = null;
        }
    };

    const playPrimary = () => {
        stopAllTts();
        if (audioPrimaryRef.current) {
            void audioPrimaryRef.current.play();
        }
    };

    const playSecondary = () => {
        stopAllTts();
        if (audioSecondaryRef.current) {
            void audioSecondaryRef.current.play();
        }
    };

    const clearWordPopoverCloseTimer = () => {
        if (wordPopoverCloseTimerRef.current != null) {
            window.clearTimeout(wordPopoverCloseTimerRef.current);
            wordPopoverCloseTimerRef.current = null;
        }
    };

    const updatePopoverAnchor = () => {
        const anchor = activeWordAnchorRef.current;
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        setPopoverAnchor(rect);
        setPopoverPlacement(getWordPopoverPlacement(rect));
    };

    const handleWordMouseEnter = (
        tokenId: number,
        anchor: HTMLElement,
        context: WordPopoverContext,
    ) => {
        clearWordPopoverCloseTimer();
        activeWordAnchorRef.current = anchor;
        setOpenTokenId(tokenId);
        setOpenTokenContext(context);
        updatePopoverAnchor();
    };

    const handleWordMouseLeave = () => {
        clearWordPopoverCloseTimer();
        wordPopoverCloseTimerRef.current = window.setTimeout(() => {
            setOpenTokenId(null);
            setOpenTokenContext(null);
            setPopoverAnchor(null);
            activeWordAnchorRef.current = null;
            wordPopoverCloseTimerRef.current = null;
        }, 140);
    };

    const handleWordPopoverMouseEnter = () => {
        clearWordPopoverCloseTimer();
    };

    const handleTokenAudioPlay = (audioUrl: string) => {
        if (!audioUrl) return;

        stopAllTts();

        const audio = new Audio(audioUrl);
        wordAudioRef.current = audio;
        void audio.play();
    };

    const handleTokenBookmark = async (tokenId: number) => {
        if (bookmarkedTokenIds.includes(tokenId)) {
            setBookmarkedTokenIds((prev) => prev.filter((id) => id !== tokenId));
            return;
        }

        if (!story || !slide || savingTokenIds.includes(tokenId)) return;

        const token = slide.tokens.find((t) => t.id === tokenId);
        if (!token) return;

        setSavingTokenIds((prev) => [...prev, tokenId]);
        try {
            const response = await saveVocabulary({
                tokenId: token.id,
                slideId: slide.slideId,
                storyId: story.storyId,
                word: token.text,
                translation: token.translation,
                definition: token.definition,
                sourceLanguage: token.sourceLanguage,
                targetLanguage: token.targetLanguage,
            });
            if (response.success) {
                setBookmarkedTokenIds((prev) =>
                    prev.includes(tokenId) ? prev : [...prev, tokenId],
                );
            }
        } catch {
            // 저장 실패 시 UI 상태는 유지
        } finally {
            setSavingTokenIds((prev) => prev.filter((id) => id !== tokenId));
        }
    };

    const openToken = useMemo(() => {
        if (openTokenId == null || !slide) return null;
        return slide.tokens.find((token) => token.id === openTokenId) ?? null;
    }, [openTokenId, slide]);

    useEffect(() => {
        if (openTokenId == null) return;

        const syncPopoverPosition = () => updatePopoverAnchor();

        window.addEventListener("scroll", syncPopoverPosition, true);
        window.addEventListener("resize", syncPopoverPosition);

        return () => {
            window.removeEventListener("scroll", syncPopoverPosition, true);
            window.removeEventListener("resize", syncPopoverPosition);
        };
    }, [openTokenId]);

    useEffect(() => {
        stopAllTts();
        setOpenTokenId(null);
        setOpenTokenContext(null);
        setPopoverAnchor(null);
        activeWordAnchorRef.current = null;
        setBookmarkedTokenIds([]);
        setSavingTokenIds([]);
        clearWordPopoverCloseTimer();
    }, [slide?.slideId]);

    useEffect(
        () => () => {
            clearWordPopoverCloseTimer();
            stopAllTts();
        },
        [],
    );

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
                                    {showCompleteNotice ? "오늘의 꿀스티커를 받아요!" : ""}
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
                                            <LangText>
                                                {buildTextSegments(slide.textKr, slide.tokens).map(
                                                    (segment, index) =>
                                                        segment.kind === "text" ? (
                                                            <span key={`text-${index}`}>
                                                                {segment.value}
                                                            </span>
                                                        ) : (
                                                            <WordWrapper
                                                                key={segment.token.id}
                                                                onMouseEnter={(event) =>
                                                                    handleWordMouseEnter(
                                                                        segment.token.id,
                                                                        event.currentTarget,
                                                                        "kr",
                                                                    )
                                                                }
                                                                onMouseLeave={handleWordMouseLeave}
                                                            >
                                                                <WordHighlight>
                                                                    {segment.token.text}
                                                                </WordHighlight>
                                                            </WordWrapper>
                                                        ),
                                                )}
                                            </LangText>
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
                                            <LangText>
                                                {buildTextSegments(
                                                    slide.textNative,
                                                    slide.tokens,
                                                    (token) => token.translation,
                                                ).map((segment, index) =>
                                                    segment.kind === "text" ? (
                                                        <span key={`native-text-${index}`}>
                                                            {segment.value}
                                                        </span>
                                                    ) : (
                                                        <WordWrapper
                                                            key={`native-token-${segment.token.id}`}
                                                            onMouseEnter={(event) =>
                                                                handleWordMouseEnter(
                                                                    segment.token.id,
                                                                    event.currentTarget,
                                                                    "native",
                                                                )
                                                            }
                                                            onMouseLeave={handleWordMouseLeave}
                                                        >
                                                            <WordHighlight>
                                                                {segment.token.translation}
                                                            </WordHighlight>
                                                        </WordWrapper>
                                                    ),
                                                )}
                                            </LangText>
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
            {openToken &&
                openTokenContext &&
                popoverAnchor &&
                createPortal(
                    <WordPopoverFloating
                        $left={popoverAnchor.left + popoverAnchor.width / 2}
                        $top={
                            popoverPlacement === "top"
                                ? popoverAnchor.top - WORD_POPOVER_GAP
                                : popoverAnchor.bottom + WORD_POPOVER_GAP
                        }
                        $placement={popoverPlacement}
                        onMouseEnter={handleWordPopoverMouseEnter}
                        onMouseLeave={handleWordMouseLeave}
                    >
                        <PopoverWord>
                            {openTokenContext === "kr"
                                ? openToken.text
                                : openToken.translation}
                        </PopoverWord>
                        <PopoverMeta>
                            번역:{" "}
                            {openTokenContext === "kr"
                                ? openToken.translation
                                : openToken.text}
                        </PopoverMeta>
                        <PopoverDefinition>
                            {openTokenContext === "kr"
                                ? openToken.definition
                                : openToken.secondaryDefinition}
                        </PopoverDefinition>
                        <PopoverActions>
                            <PopoverIconButton
                                type="button"
                                onClick={() => handleTokenAudioPlay(openToken.audioUrl)}
                            >
                                <Image height={18} src={SpeakerIcon} alt="" />
                            </PopoverIconButton>
                            <PopoverBookmarkButton
                                type="button"
                                $active={bookmarkedTokenIds.includes(openToken.id)}
                                disabled={savingTokenIds.includes(openToken.id)}
                                onClick={() => void handleTokenBookmark(openToken.id)}
                            >
                                {savingTokenIds.includes(openToken.id)
                                    ? "저장 중..."
                                    : bookmarkedTokenIds.includes(openToken.id)
                                      ? "저장됨"
                                      : "단어 저장"}
                            </PopoverBookmarkButton>
                        </PopoverActions>
                    </WordPopoverFloating>,
                    document.body,
                )}
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
    border: 1px solid #A0A0A0;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
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

const WordWrapper = styled.span`
    position: relative;
    display: inline-block;
`;

const WordHighlight = styled.span`
    transition: background-color 0.15s ease-in-out;
    border-radius: 6px;
    padding: 0 2px;
    cursor: pointer;

    &:hover {
        background: #FFF2A6;
    }
`;

const WordPopoverFloating = styled.div<{
    $left: number;
    $top: number;
    $placement: WordPopoverPlacement;
}>`
    position: fixed;
    left: ${(props) => props.$left}px;
    top: ${(props) => props.$top}px;
    transform: ${(props) =>
        props.$placement === "top"
            ? "translate(-50%, -100%)"
            : "translateX(-50%)"};
    min-width: 200px;
    padding: 16px;
    border-radius: 12px;
    background: #FFFFFF;
    border: 1px solid #DFDFDF;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    pointer-events: auto;
`;

const PopoverWord = styled.p`
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.5;
    margin-bottom: 12px;
`;

const PopoverMeta = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #202020;
    line-height: 1.2;
    margin-bottom: 12px;
`;

const PopoverDefinition = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #505050;
    line-height: 1.2;
    margin-bottom: 20px;
`;

const PopoverActions = styled.div`
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const PopoverIconButton = styled.button`
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 50%;
    background: #EFEFEF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PopoverBookmarkButton = styled.button<{ $active: boolean }>`
    border: none;
    border-radius: 8px;
    background: ${props => (props.$active ? "#FFDE21" : "#EFEFEF")};
    color: #1F1F1F;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 10px;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;
