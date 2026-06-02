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

export function getQuizByStoryId(storyId: number) {
    const query = new URLSearchParams({ storyId: String(storyId) });
    return apiFetch(`/api/quiz?${query}`) as Promise<QuizResponse>;
}
