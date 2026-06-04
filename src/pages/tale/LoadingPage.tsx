import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import LoadingImage from "../../assets/images/tale/loading.png";
import { generateStory, getGenerationJobResult } from "../../apis/stories";
import { getMyPage } from "../../apis/user";
import {
    buildGenerateStoryRequest,
    getStoryInit,
} from "../../apis/tale";
import { setProfileId } from "../../lib/auth";
import {
    loadTaleGenerationSession,
    saveTaleGenerationSession,
    type TaleGenerationSession,
} from "../../lib/taleGenerationSession";

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_DURATION_MS = 10 * 60 * 1000;

const LoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const initialSession = loadTaleGenerationSession();
        if (!initialSession?.prompt) {
            navigate("/tale/prompt", { replace: true });
            return;
        }

        if (!initialSession.primaryLanguage || !initialSession.secondaryLanguage) {
            navigate("/tale/language", {
                replace: true,
                state: { prompt: initialSession.prompt },
            });
            return;
        }

        let cancelled = false;
        let session: TaleGenerationSession = initialSession;

        const goToLanguageWithError = (message: string) => {
            navigate("/tale/language", {
                replace: true,
                state: {
                    prompt: session.prompt,
                    generationError: message,
                },
            });
        };

        /** 1단계: POST /api/stories/generate */
        const startGeneration = async (): Promise<string | null> => {
            if (session.jobId) {
                return session.jobId;
            }

            const { data: myPage } = await getMyPage();
            const profile = myPage.profiles[0];
            if (!profile) {
                goToLanguageWithError("로그인 후 다시 시도해 주세요.");
                return null;
            }

            setProfileId(profile.profileId);

            const { data: init } = await getStoryInit(profile.profileId);
            const body = buildGenerateStoryRequest(
                profile,
                init,
                session.prompt,
                session.primaryLanguage,
                session.secondaryLanguage,
            );

            const { data: job } = await generateStory(body);

            session = {
                ...session,
                jobId: job.jobId,
                profileId: profile.profileId,
            };
            saveTaleGenerationSession(session);
            return job.jobId;
        };

        /** 2단계: GET .../generation-jobs/{jobId}/result (409면 재시도) */
        const pollResult = async (jobId: string) => {
            const startedAt = session.generationStartedAt;

            while (!cancelled) {
                if (Date.now() - startedAt > MAX_POLL_DURATION_MS) {
                    goToLanguageWithError(
                        "동화 생성 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
                    );
                    return;
                }

                try {
                    const result = await getGenerationJobResult(jobId);

                    if (result?.slides.length) {
                        saveTaleGenerationSession({
                            ...session,
                            result,
                        });
                        navigate("/tale/complete", {
                            state: { profileId: session.profileId },
                            replace: true,
                        });
                        return;
                    }
                } catch {
                    goToLanguageWithError(
                        "동화 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
                    );
                    return;
                }

                await new Promise((resolve) =>
                    window.setTimeout(resolve, POLL_INTERVAL_MS),
                );
            }
        };

        (async () => {
            try {
                const jobId = await startGeneration();
                if (!jobId || cancelled) return;
                await pollResult(jobId);
            } catch {
                if (!cancelled) {
                    goToLanguageWithError(
                        "동화 생성을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.",
                    );
                }
            }
        })();

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
