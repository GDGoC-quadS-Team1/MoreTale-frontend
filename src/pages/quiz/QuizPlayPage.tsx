import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";
import ArrowRightIcon from "../../assets/images/tale/arrow-right.svg";
import QuizScoreImg from "../../assets/images/quiz-score.png";
import {
    getQuizByStoryId,
    submitQuiz,
    type QuizQuestionDto,
    type QuizSubmitData,
} from "../../apis/quiz";

type QuizOption = {
    label: string;
    value: string;
};

type QuizQuestion = {
    questionId: number;
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
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

function mapQuizQuestions(questions: QuizQuestionDto[]): QuizQuestion[] {
    return questions.map((q) => {
        if (q.questionType === "TRUE_FALSE") {
            return {
                questionId: q.questionId,
                questionType: q.questionType,
                prompt: q.questionText,
                points: 10,
                options: [
                    { label: "", value: "TRUE" },
                    { label: "", value: "FALSE" },
                ],
                correctIndex: -1,
            };
        }

        const sortedOptions = q.options
            .slice()
            .sort((a, b) => a.optionOrder - b.optionOrder);

        const correctOrder = Number(q.correctAnswer);
        const correctIndex = !Number.isNaN(correctOrder)
            ? sortedOptions.findIndex((opt) => opt.optionOrder === correctOrder)
            : -1;

        return {
            questionId: q.questionId,
            questionType: q.questionType,
            prompt: q.questionText,
            points: 10,
            options: sortedOptions.map((opt) => ({
                label: opt.optionText,
                value: String(opt.optionOrder),
            })),
            correctIndex: correctIndex >= 0 ? correctIndex : -1,
        };
    });
}

const QuizPlayPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const storyIdFromQuery = Number(searchParams.get("storyId"));
    const storyIdFromState = Number((location.state as { storyId?: number } | null)?.storyId);
    const storyId = Number.isFinite(storyIdFromQuery) && storyIdFromQuery > 0
        ? storyIdFromQuery
        : Number.isFinite(storyIdFromState) && storyIdFromState > 0
            ? storyIdFromState
            : null;

    const [bookTitle] = useState(
        (location.state as { title?: string } | null)?.title ?? BOOK_TITLE,
    );
    const [quizId, setQuizId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const total = questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selections, setSelections] = useState<(number | null)[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [showResultScreen, setShowResultScreen] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [submitResult, setSubmitResult] = useState<QuizSubmitData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (total === 0) {
            setSelections([]);
            return;
        }
        setSelections(Array.from({ length: total }, () => null));
        setCurrentIndex(0);
        setSubmitted(false);
        setShowResultScreen(false);
        setReviewMode(false);
        setSubmitResult(null);
        setIsSubmitting(false);
        setSubmitError(null);
    }, [total]);

    useEffect(() => {
        if (storyId == null) {
            setError("storyId가 없어 퀴즈를 불러올 수 없습니다.");
            setLoading(false);
            return;
        }

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await getQuizByStoryId(storyId);
                setQuizId(data.quizId);
                setQuestions(mapQuizQuestions(data.questions));
            } catch {
                setError("퀴즈를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        void fetchQuiz();
    }, [storyId]);

    const allAnswered = useMemo(() => selections.every((s) => s !== null), [selections]);

    const answerResultMap = useMemo(() => {
        return new Map(submitResult?.answerResults.map((result) => [result.questionId, result]) ?? []);
    }, [submitResult]);

    const correctness = useMemo(() => {
        if (!submitted) {
            return Array.from({ length: total }, () => null);
        }
        return questions.map((question) => {
            const result = answerResultMap.get(question.questionId);
            return typeof result?.isCorrect === "boolean" ? result.isCorrect : null;
        });
    }, [submitted, total, questions, answerResultMap]);

    const totalScore = useMemo(() => {
        return submitResult?.score ?? 0;
    }, [submitResult]);

    const getCorrectIndex = (slideIdx: number): number => {
        const question = questions[slideIdx];
        if (!question) return -1;
        const result = answerResultMap.get(question.questionId);
        if (!result?.correctAnswer) return -1;
        return question.options.findIndex((option) => option.value === result.correctAnswer);
    };

    const getOptionBackground = (slideIdx: number, idx: number): string => {
        const chosen = selections[slideIdx] === idx;
        if (!reviewMode || !submitted) {
            return chosen ? OPTION_SELECTED : OPTION_DEFAULT;
        }
        const sel = selections[slideIdx];
        const cor = getCorrectIndex(slideIdx);
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
        if (submitted || isSubmitting) return;
        setSelections((prev) => {
            const next = [...prev];
            next[currentIndex] = optionIndex;
            return next;
        });
    };

    const submitAnswers = async () => {
        if (quizId == null) {
            setSubmitError("퀴즈 ID를 찾지 못해 제출할 수 없습니다.");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const answers = questions.map((question, questionIndex) => {
                const selectedIndex = selections[questionIndex];
                const selectedOption = selectedIndex != null ? question.options[selectedIndex] : null;
                return {
                    questionId: question.questionId,
                    submittedAnswer: selectedOption?.value ?? "",
                };
            });

            const { data } = await submitQuiz({
                quizId,
                answers,
            });

            setSubmitResult(data);
            setSubmitted(true);
            setShowResultScreen(true);
            setReviewMode(false);
        } catch {
            setSubmitError("퀴즈 제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
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
        if (showResultScreen || isSubmitting) return;
        if (isLastSlide) {
            if (allAnswered) {
                void submitAnswers();
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

    const progressCells = questions.map((_, i) => {
        const num = i + 1;
        if (submitted && correctness[i] !== null) {
            return { num, variant: correctness[i] ? ("correct" as const) : ("wrong" as const) };
        }
        return { num, variant: "neutral" as const };
    });

    const leftDisabled = showResultScreen ? false : isFirstSlide;
    const rightDisabled = showResultScreen ? true : isLastSlide ? !allAnswered || isSubmitting : false;

    return (
        <Wrapper>
            <Header activeMenu="quiz" />
            <Container>
                <InfoContainer>
                    <LeftContainer>
                        <Title>{bookTitle}</Title>
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

                    {loading ? (
                        <StatusMessage>퀴즈를 불러오는 중...</StatusMessage>
                    ) : error ? (
                        <StatusMessage>{error}</StatusMessage>
                    ) : total === 0 ? (
                        <StatusMessage>퀴즈 문항이 없습니다.</StatusMessage>
                    ) : showResultScreen ? (
                        <ResultViewport>
                            <ResultBody>
                                <ResultText>
                                    &lt;{bookTitle}&gt; 퀴즈를 모두 풀었어요!
                                    <br />
                                    문제를 다시 보거나, 다른 퀴즈에 도전해보세요
                                </ResultText>
                                <ScoreContainer>
                                    <ScoreBackgroundImg src={QuizScoreImg} alt="" />
                                    <ScoreValue>{totalScore} 점</ScoreValue>
                                </ScoreContainer>
                                <ResultButtonRow>
                                    <YellowButton onClick={handleWrongReviewClick}>
                                        다시 보기
                                    </YellowButton>
                                    <YellowButton onClick={() => navigate("/quiz")}>
                                        퀴즈 홈으로
                                    </YellowButton>
                                </ResultButtonRow>
                                {submitError && <SubmitErrorText>{submitError}</SubmitErrorText>}
                            </ResultBody>
                        </ResultViewport>
                    ) : (
                        <SlideViewport>
                            <SlideTrack $count={total} $index={currentIndex}>
                                {questions.map((q, slideIdx) => (
                                    <SlidePane key={q.questionId} $count={total} $inactive={slideIdx !== currentIndex}>
                                        <QuizContainer>
                                            <QuestionText>
                                                {slideIdx + 1}. {q.prompt}
                                            </QuestionText>
                                            {q.questionType === "TRUE_FALSE" ? (
                                                <TrueFalseGrid>
                                                    {q.options.map((opt, idx) => {
                                                        const chosen = selections[slideIdx] === idx;
                                                        const bg = getOptionBackground(slideIdx, idx);
                                                        return (
                                                            <TrueFalseButton
                                                                key={idx}
                                                                type="button"
                                                                $bg={bg}
                                                                onClick={() => {
                                                                    if (slideIdx !== currentIndex) return;
                                                                    selectOption(idx);
                                                                }}
                                                                disabled={submitted || isSubmitting}
                                                                aria-pressed={chosen}
                                                            >
                                                                <TrueFalseBadge>{idx === 0 ? "O" : "X"}</TrueFalseBadge>
                                                                <OptionText>{opt.label}</OptionText>
                                                            </TrueFalseButton>
                                                        );
                                                    })}
                                                </TrueFalseGrid>
                                            ) : (
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
                                                                disabled={submitted || isSubmitting}
                                                                aria-pressed={chosen}
                                                            >
                                                                <OptionText>{opt.label}</OptionText>
                                                            </OptionButton>
                                                        );
                                                    })}
                                                </OptionsGrid>
                                            )}
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
    min-width: 1200px;
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
    align-items: center;
    gap: 48px;
`;

const QuestionText = styled.p`
    margin: 0;
    align-self: flex-start;
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
    min-width: 380px;
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

const OptionText = styled.span`
    font-size: 28px;
    font-weight: 800;
    color: #505050;
    text-align: center;
`;

const TrueFalseGrid = styled.div`
    display: flex;
    flex-direction: row;
    gap: 40px;
`;

const TrueFalseButton = styled(OptionButton)`
    min-height: 180px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
`;

const TrueFalseBadge = styled.span`
    color: #424242;
    font-size: 60px;
    font-weight: 800;
`;

const StatusMessage = styled.div`
    width: 100%;
    text-align: center;
    color: #424242;
    font-size: 24px;
    font-weight: 700;
`;

const SubmitErrorText = styled.div`
    color: #D14343;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
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
