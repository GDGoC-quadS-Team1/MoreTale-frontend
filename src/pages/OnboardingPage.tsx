import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    buildCreateProfileRequest,
    createUserProfile,
    validateSignUpForm,
    type SignUpFormState,
} from "../apis/user";
import { consumeOAuthCallback, setProfileId } from "../lib/auth";
import styled from "styled-components";
import Slogan from "../components/Slogan";
import ProfileForm from "../components/profile/ProfileForm";
import LogoYellow from "../assets/images/logo/logo-yellow.svg";

const OnboardingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const result = consumeOAuthCallback();
        if (result.handled && result.hasProfile) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleComplete = async (formState: SignUpFormState) => {
        const validationError = validateSignUpForm(formState);
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const body = buildCreateProfileRequest(formState);
            const { data } = await createUserProfile(body);
            setProfileId(data.profileId);
            navigate("/profile-complete");
        } catch {
            setSubmitError("프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Wrapper>
            <Container>
                <Slogan />
                <Content>
                    <LeftContainer>
                        <LogoYellowImg src={LogoYellow} alt="" />
                        <TextContainer>
                            <DescriptionText>구글 로그인에 성공했어요!</DescriptionText>
                            <DescriptionText>이제 더 좋은 이야기를 위해 여러분에 대해서 알려주세요.</DescriptionText>
                        </TextContainer>
                    </LeftContainer>
                    <RightContainer>
                        <ProfileForm
                            onComplete={handleComplete}
                            isSubmitting={isSubmitting}
                            submitError={submitError}
                        />
                    </RightContainer>
                </Content>
            </Container>
        </Wrapper>
    );
};

export default OnboardingPage;

const Wrapper = styled.div`
    background: #FFDE21;
    position: fixed;
    width: 100%;
    min-width: 1200px;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    box-sizing: border-box;
`;

const Container = styled.div`
    width: 100%;
    min-width: 966px;
    max-width: 1104px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
`;

const Content = styled.div`
    width: 100%;
    max-width: 1104px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
`;

const LeftContainer = styled.div`
    background: #1F1F1F;
    flex: 1;
    min-width: 0;
    height: 600px;
    padding: 30px 40px 40px 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const RightContainer = styled.div`
    background: #FFFFFF;
    flex: 1.13;
    min-width: 0;
    height: 600px;
    padding: 30px 80px 40px 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
`;

const LogoYellowImg = styled.img`
    width: 102px;    
    height: auto;
    display: block;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: 375px;
    width: 100%;
`;

const DescriptionText = styled.div`
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 500;
    line-height: 26px;
    text-align: right;
    cursor: default;
`;
