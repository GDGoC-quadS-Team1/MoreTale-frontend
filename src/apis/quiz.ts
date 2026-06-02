import { apiFetch } from "../lib/api";

export type QuizOptionDto = {
    optionOrder: number;
    optionText: string;
};

export type QuizQuestionDto = {
    questionId: number;
    questionOrder: number;
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
    evaluationType: string;
    questionText: string;
    options: QuizOptionDto[];
    correctAnswer: string;
    explanation: string;
};

export type QuizData = {
    quizId: number;
    storyId: number;
    language: string;
    difficulty: string;
    totalQuestions: number;
    questions: QuizQuestionDto[];
};

type QuizResponse = {
    success: boolean;
    data: QuizData;
    message?: string;
    errorCode?: string;
    timestamp?: string;
};

export type QuizSubmitAnswerPayload = {
    questionId: number;
    submittedAnswer: string;
};

export type QuizSubmitRequest = {
    quizId: number;
    answers: QuizSubmitAnswerPayload[];
};

export type HoneyJarRewardDto = {
    earnedHoneyJars: number;
    currentHoneyJarCount: number;
    canGenerateFree: boolean;
    autoUsedForFreeGeneration: boolean;
    rewardMessage: string;
};

export type QuizAnswerResultDto = {
    questionId: number;
    questionOrder: number;
    questionText: string;
    submittedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
};

export type QuizSubmitData = {
    resultId: number;
    score: number;
    totalQuestions: number;
    correctCount: number;
    isPerfect: boolean;
    honeyJarReward: HoneyJarRewardDto;
    answerResults: QuizAnswerResultDto[];
    resultMessage: string;
};

type QuizSubmitResponse = {
    success: boolean;
    data: QuizSubmitData;
    message?: string;
    errorCode?: string;
    timestamp?: string;
};

export function getQuizByStoryId(storyId: number) {
    const query = new URLSearchParams({ storyId: String(storyId) });
    return apiFetch(`/api/quiz?${query}`) as Promise<QuizResponse>;
}

export function submitQuiz(request: QuizSubmitRequest) {
    return apiFetch("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify(request),
    }) as Promise<QuizSubmitResponse>;
}
