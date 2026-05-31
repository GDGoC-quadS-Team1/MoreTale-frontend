import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import LoadingImage from "../../assets/images/tale/loading.png";
import {
    getGenerationJobResult,
    getGenerationJobStatus,
    isGenerationJobFailed,
} from "../../apis/tale";
import {
    loadTaleGenerationSession,
    saveTaleGenerationSession,
} from "../../lib/taleGenerationSession";

const POLL_INTERVAL_MS = 2500;
const MIN_POLL_MS_BEFORE_FAIL_REDIRECT = 10_000;

const LoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const session = loadTaleGenerationSession();
        if (!session?.jobId) {
            navigate(session?.prompt ? "/tale/language" : "/tale/prompt", {
                replace: true,
                state: session?.prompt ? { prompt: session.prompt } : undefined,
            });
            return;
        }

        let cancelled = false;

        const goToLanguageWithError = (message: string) => {
            navigate("/tale/language", {
                replace: true,
                state: {
                    prompt: session.prompt,
                    generationError: message,
                },
            });
        };

        const poll = async () => {
            if (cancelled) return;

            try {
                const { data: job } = await getGenerationJobStatus(session.jobId);

                const elapsed = Date.now() - session.generationStartedAt;
                if (
                    isGenerationJobFailed(job.status) &&
                    elapsed >= MIN_POLL_MS_BEFORE_FAIL_REDIRECT
                ) {
                    goToLanguageWithError(
                        "동화 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
                    );
                    return;
                }

                const resultResponse = await getGenerationJobResult(session.jobId);
                if (resultResponse?.data?.slides?.length) {
                    saveTaleGenerationSession({
                        ...session,
                        result: resultResponse.data,
                    });
                    navigate("/tale/complete", {
                        state: { profileId: session.profileId },
                        replace: true,
                    });
                    return;
                }
            } catch {
                // 작업 완료 전까지 폴링 유지
            }

            if (!cancelled) {
                window.setTimeout(poll, POLL_INTERVAL_MS);
            }
        };

        poll();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                <DotContainer>
                    <Dot color="#FEEE95" $delay={0} />
                    <Dot color="#FFDE21" $delay={0.15} />
                    <Dot color="#E3C207" $delay={0.3} />
                </DotContainer>
                <Title>이야기가 자라는 중이에요</Title>
                <Image src={LoadingImage} alt="" />
            </Container>
        </Wrapper>
    );
};

export default LoadingPage;

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
    gap: 32px;
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

const Image = styled.img`
    height: 410px;
`;

const DotContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;

const bounce = keyframes`
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.8;
    }
    40% {
        transform: scale(1.2);
        opacity: 1;
    }
`;

const Dot = styled.div<{ color: string; $delay: number }>`
    width: 17px;
    height: 17px;
    background: ${props => props.color};
    border-radius: 50%;
    animation: ${bounce} 1s ease-in-out infinite;
    animation-delay: ${props => props.$delay}s;
`;
