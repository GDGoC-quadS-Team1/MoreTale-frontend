import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";
import ArrowRightIcon from "../../assets/images/tale/arrow-right.svg";
import QuizScoreImg from "../../assets/images/quiz-score.png";

type QuizOption = {
    kanji: string;
    furigana: string;
    koreanReading: string;
};

type QuizQuestion = {
    prompt: string;
    points: number;
    options: QuizOption[];
    correctIndex: number;
};

const BOOK_TITLE = "달을 따러 간 소년";

const COLOR_CORRECT = "#87C98A";
const COLOR_WRONG = "#ED9192";
const OPTION_DEFAULT = "#FFF6C7";
const OPTION_SELECTED = "#FEE762";

// 퀴즈 더미 데이터
const QUESTIONS: QuizQuestion[] = [
    {
        prompt: "소년이 달을 따러 간 이유는 무엇인가요?",
        points: 10,
        options: [
            { kanji: "遊び", furigana: "あそび", koreanReading: "아소비" },
            { kanji: "願い", furigana: "ねがい", koreanReading: "네가이" },
            { kanji: "約束", furigana: "やくそく", koreanReading: "야쿠소쿠" },
            { kanji: "夢", furigana: "ゆめ", koreanReading: "유메" },
        ],
        correctIndex: 1,
    },
    {
        prompt: "달로 가는 길에 소년이 만난 것은 무엇인가요?",
        points: 10,
        options: [
            { kanji: "風", furigana: "かぜ", koreanReading: "카제" },
            { kanji: "雲", furigana: "くも", koreanReading: "쿠모" },
            { kanji: "鳥", furigana: "とり", koreanReading: "도리" },
            { kanji: "花", furigana: "はな", koreanReading: "하나" },
        ],
        correctIndex: 2,
    },
    {
        prompt: "달에 도착했을 때 가장 먼저 본 것은 무엇인가요?",
        points: 15,
        options: [
            { kanji: "光", furigana: "ひかり", koreanReading: "히카리" },
            { kanji: "影", furigana: "かげ", koreanReading: "카게" },
            { kanji: "海", furigana: "うみ", koreanReading: "우미" },
            { kanji: "森", furigana: "もり", koreanReading: "모리" },
        ],
        correctIndex: 0,
    },
    {
        prompt: "소년이 달에서 가장 좋아한 시간은 언제였나요?",
        points: 15,
        options: [
            { kanji: "朝", furigana: "あさ", koreanReading: "아사" },
            { kanji: "昼", furigana: "ひる", koreanReading: "히루" },
            { kanji: "夕", furigana: "ゆう", koreanReading: "유우" },
            { kanji: "夜", furigana: "よる", koreanReading: "요루" },
        ],
        correctIndex: 3,
    },
    {
        prompt: "소년은 달에 앉아 무엇과 친구가 되었나요?",
        points: 20,
        options: [
            { kanji: "星", furigana: "ほし", koreanReading: "호시" },
            { kanji: "空", furigana: "そら", koreanReading: "소라" },
            { kanji: "少女", furigana: "しょうじょ", koreanReading: "쇼-죠" },
            { kanji: "夜", furigana: "よる", koreanReading: "요루" },
        ],
        correctIndex: 0,
    },
    {
        prompt: "이야기의 마지막에 소년은 무엇을 가져왔나요?",
        points: 30,
        options: [
            { kanji: "砂", furigana: "すな", koreanReading: "스나" },
            { kanji: "欠片", furigana: "かけら", koreanReading: "카케라" },
            { kanji: "温もり", furigana: "ぬくもり", koreanReading: "누쿠모리" },
            { kanji: "約束", furigana: "やくそく", koreanReading: "야쿠소쿠" },
        ],
        correctIndex: 2,
    },
];

const QuizPlayPage = () => {
    const navigate = useNavigate();
    const total = QUESTIONS.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selections, setSelections] = useState<(number | null)[]>(() => Array.from({ length: total }, () => null));
    const [submitted, setSubmitted] = useState(false);
    const [showResultScreen, setShowResultScreen] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);

    const allAnswered = useMemo(() => selections.every((s) => s !== null), [selections]);

    const correctness = useMemo(() => {
        return selections.map((choice, i) =>
            choice === null ? null : choice === QUESTIONS[i].correctIndex,
        );
    }, [selections]);

    const totalScore = useMemo(() => {
        return QUESTIONS.reduce((sum, q, i) => {
            if (correctness[i]) return sum + q.points;
            return sum;
        }, 0);
    }, [correctness]);

    const getOptionBackground = (slideIdx: number, idx: number): string => {
        const chosen = selections[slideIdx] === idx;
        if (!reviewMode || !submitted) {
            return chosen ? OPTION_SELECTED : OPTION_DEFAULT;
        }
        const sel = selections[slideIdx];
        const cor = QUESTIONS[slideIdx].correctIndex;
        if (sel === null) return OPTION_DEFAULT;
        const gotRight = sel === cor;
        if (gotRight) {
            return chosen ? COLOR_CORRECT : OPTION_DEFAULT;
        }
        if (idx === sel) return COLOR_WRONG;
        if (idx === cor) return COLOR_CORRECT;
        return OPTION_DEFAULT;
    };

    const selectOption = (optionIndex: number) => {
        if (submitted) return;
        setSelections((prev) => {
            const next = [...prev];
            next[currentIndex] = optionIndex;
            return next;
        });
    };

    const isFirstSlide = currentIndex === 0;
    const isLastSlide = currentIndex === total - 1;

    const handleLeftClick = () => {
        if (showResultScreen) {
            setShowResultScreen(false);
            setCurrentIndex(total - 1);
            return;
        }
        if (isFirstSlide) return;
        setCurrentIndex((prev) => prev - 1);
    };

    const handleRightClick = () => {
        if (showResultScreen) return;
        if (isLastSlide) {
            if (allAnswered) {
                setSubmitted(true);
                setShowResultScreen(true);
            }
            return;
        }
        setCurrentIndex((prev) => prev + 1);
    };

    const handleWrongReviewClick = () => {
        setShowResultScreen(false);
        setReviewMode(true);
        setCurrentIndex(0);
    };

    const progressCells = QUESTIONS.map((_, i) => {
        const num = i + 1;
        if (submitted && correctness[i] !== null) {
            return { num, variant: correctness[i] ? ("correct" as const) : ("wrong" as const) };
        }
        return { num, variant: "neutral" as const };
    });

    const leftDisabled = showResultScreen ? false : isFirstSlide;
    const rightDisabled = showResultScreen ? true : isLastSlide ? !allAnswered : false;

    return (
        <Wrapper>
            <Header activeMenu="quiz" />
            <Container>
                <InfoContainer>
                    <LeftContainer>
                        <Title>{BOOK_TITLE}</Title>
                        <PencilIconImg src={PencilIcon} alt="" />
                    </LeftContainer>
                    <RightContainer>
                        <ProgressNumber>
                            {progressCells.map((cell) => (
                                <ProgressBox key={cell.num} role="listitem" $variant={cell.variant}>
                                    {cell.num}
                                </ProgressBox>
                            ))}
                        </ProgressNumber>
                    </RightContainer>
                </InfoContainer>

                <BookContainer>
                    <NavButton
                        $position="left"
                        type="button"
                        aria-label={showResultScreen ? "퀴즈" : "이전 문항"}
                        onClick={handleLeftClick}
                        disabled={leftDisabled}
                    >
                        <NavIcon height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>
                    <NavButton
                        $position="right"
                        type="button"
                        aria-label="다음 문항"
                        onClick={handleRightClick}
                        disabled={rightDisabled}
                    >
                        <NavIcon height={26} src={ArrowRightIcon} alt="" />
                    </NavButton>

                    {showResultScreen ? (
                        <ResultViewport>
                            <ResultBody>
                                <ResultText>
                                    &lt;{BOOK_TITLE}&gt; 퀴즈를 모두 풀었어요!
                                    <br />
                                    틀린 문제를 다시 보거나, 다른 퀴즈에 도전해보세요
                                </ResultText>
                                <ScoreContainer>
                                    <ScoreBackgroundImg src={QuizScoreImg} alt="" />
                                    <ScoreValue>{totalScore} 점</ScoreValue>
                                </ScoreContainer>
                                <ResultButtonRow>
                                    <YellowButton onClick={handleWrongReviewClick}>
                                        오답 보기
                                    </YellowButton>
                                    <YellowButton onClick={() => navigate("/quiz")}>
                                        퀴즈 홈으로
                                    </YellowButton>
                                </ResultButtonRow>
                            </ResultBody>
                        </ResultViewport>
                    ) : (
                        <SlideViewport>
                            <SlideTrack $count={total} $index={currentIndex}>
                                {QUESTIONS.map((q, slideIdx) => (
                                    <SlidePane key={slideIdx} $count={total} $inactive={slideIdx !== currentIndex}>
                                        <QuizContainer>
                                            <QuestionText>
                                                {slideIdx + 1}. {q.prompt} ({q.points}점)
                                            </QuestionText>
                                            <OptionsGrid>
                                                {q.options.map((opt, idx) => {
                                                    const chosen = selections[slideIdx] === idx;
                                                    const bg = getOptionBackground(slideIdx, idx);
                                                    return (
                                                        <OptionButton
                                                            key={idx}
                                                            type="button"
                                                            $bg={bg}
                                                            onClick={() => {
                                                                if (slideIdx !== currentIndex) return;
                                                                selectOption(idx);
                                                            }}
                                                            disabled={submitted}
                                                            aria-pressed={chosen}
                                                        >
                                                            <RubyWrap>
                                                                <ruby>
                                                                    {opt.kanji}
                                                                    <rt>{opt.furigana}</rt>
                                                                </ruby>
                                                            </RubyWrap>
                                                            <KoreanWord>{opt.koreanReading}</KoreanWord>
                                                        </OptionButton>
                                                    );
                                                })}
                                            </OptionsGrid>
                                        </QuizContainer>
                                    </SlidePane>
                                ))}
                            </SlideTrack>
                        </SlideViewport>
                    )}
                </BookContainer>
            </Container>
        </Wrapper>
    );
};

export default QuizPlayPage;

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
    background: #F2F2F2;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 60px;
    box-sizing: border-box;
    overflow: auto;
    gap: 28px;
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

const PencilIconImg = styled.img`
    width: 29px;
    height: auto;
    display: block;
`;

const InfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    align-self: flex-start;
    z-index: 1;
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

const NavButton = styled.button<{ $position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    ${(props) => (props.$position === "left" ? "left: -28px;" : "right: -28px;")}
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

const NavIcon = styled.img`
    height: ${(props) => props.height}px;
`;

const ResultViewport = styled.div`
    flex: 1;
    width: 100%;
    min-width: 0;
    overflow: auto;
    border-radius: 20px;
`;

const ResultBody = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const ResultText = styled.p`
    margin: 0;
    color: #000000;
    font-size: 28px;
    font-weight: 700;
    line-height: 50px;
    text-align: center;
    cursor: default;
`;

const ScoreContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ScoreBackgroundImg = styled.img`
    width: 400px;
    height: auto;
    display: block;
`;

const ScoreValue = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-54%, -70%);
    color: #424242;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-size: clamp(80px, 5vw, 44px);
    font-weight: 800;
    letter-spacing: -2.55px;
    pointer-events: none;
`;

const ResultButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const SlideViewport = styled.div`
    flex: 1;
    width: 100%;
    overflow: hidden;
`;

const SlideTrack = styled.div<{ $count: number; $index: number }>`
    display: flex;
    flex-direction: row;
    width: ${({ $count }) => $count * 100}%;
    height: 100%;
    transform: translateX(-${({ $index, $count }) => ($index * 100) / $count}%);
    transition: transform 0.35s ease;
`;

const SlidePane = styled.div<{ $count: number; $inactive: boolean }>`
    flex: 0 0 ${({ $count }) => 100 / $count}%;
    width: ${({ $count }) => 100 / $count}%;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    justify-content: center;
    min-height: 0;
    ${({ $inactive }) =>
        $inactive &&
        `
        pointer-events: none;
        user-select: none;
    `}
`;

const QuizContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 60px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;
`;

const QuestionText = styled.p`
    margin: 0;
    color: #000000;
    font-size: 32px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    cursor: default;
`;

const ProgressNumber = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
`;

const ProgressBox = styled.div<{ $variant: "neutral" | "correct" | "wrong" }>`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 800;
    box-sizing: border-box;
    border: none;

    ${({ $variant }) =>
        $variant === "neutral" &&
        `
        background: #FFFFFF;
        color: #1F1F1F;
    `}
    ${({ $variant }) =>
        $variant === "correct" &&
        `
        background: ${COLOR_CORRECT};
        color: #1F1F1F;
    `}
    ${({ $variant }) =>
        $variant === "wrong" &&
        `
        background: ${COLOR_WRONG};
        color: #1F1F1F;
    `}
`;

const OptionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
`;

const OptionButton = styled.button<{ $bg: string }>`
    min-height: 140px;
    border-radius: 10px;
    border: none;
    background: ${({ $bg }) => $bg};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
    box-sizing: border-box;
    box-shadow: 2px 3px 8px 0 rgba(0, 0, 0, 0.15);
    cursor: pointer;

    &:disabled {
        cursor: default;
        opacity: 1;
    }

    &:hover:not(:disabled) {
        filter: brightness(0.98);
    }
`;

const RubyWrap = styled.span`
    font-size: 48px;
    font-weight: 800;
    color: #1F1F1F;
    line-height: 45px;

    ruby {
        ruby-align: center;
    }

    rt {
        font-size: 12px;
        font-weight: 600;
        color: #424242;
        margin-bottom: 4px;
    }
`;

const KoreanWord = styled.span`
    font-size: 32px;
    font-weight: 800;
    color: #505050;
`;

const YellowButton = styled.button`
    min-width: 180px;
    padding: 8px 30px;
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
