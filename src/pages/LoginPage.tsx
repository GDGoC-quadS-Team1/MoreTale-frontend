import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slogan from "../components/Slogan";
import LogoYellow from "../assets/images/logo/logo-yellow.svg";
import LogoBee from "../assets/images/logo/logo-bee.png";
import GoogleIcon from "../assets/images/logo/google.svg";
import { consumeOAuthCallback, startGoogleLogin } from "../lib/auth";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const result = consumeOAuthCallback();
        if (!result.handled) return;

        navigate(result.hasProfile ? "/home" : "/onboarding", { replace: true });
    }, [navigate]);

    const handleLogin = () => {
        startGoogleLogin();
    };

    return (
        <Wrapper>
            <Container>
                <Slogan />
                <Content>
                    <LeftContainer>
                        <WelcomeText>WELCOME!</WelcomeText>
                        <SubText>
                            <LogoYellowImg src={LogoYellow} alt="" />
                            <DescriptionText>에 어서오세요.</DescriptionText>
                        </SubText>
                        <DescriptionText>
                            지금 바로 아이의 언어와 마음을 키우는<br />이중언어 동화를 만들어 보세요.
                        </DescriptionText>
                    </LeftContainer>
                    <RightContainer>
                        <LogoContainer>
                            <LogoBeeImg src={LogoBee} alt="MORE TALE" />
                        </LogoContainer>
                        <GoogleButton type="button" onClick={handleLogin}>
                            <GoogleIconImg src={GoogleIcon} alt="Google" />
                            Sign up with Google
                        </GoogleButton>
                    </RightContainer>
                </Content>
            </Container>
        </Wrapper>
    );
};

export default LoginPage;

const Wrapper = styled.div`
    background: #FFDE21;
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
    padding: 30px 100px 0 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const RightContainer = styled.div`
    background: #FFFFFF;
    flex: 1;
    min-width: 0;
    height: 600px;
    padding: 30px 100px 0 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const WelcomeText = styled.div`
    color: #FFFFFF;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    cursor: default;
`;

const SubText = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 20px;
    margin: 36px 0;
`;

const DescriptionText = styled.div`
    color: #FFFFFF;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    margin-bottom: 4px;
    cursor: default;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 115px;
`;

const LogoYellowImg = styled.img`
    width: 90px;    
    height: auto;
    display: block;
`;

const LogoBeeImg = styled.img`
    width: 340px;
    height: auto;
    display: block;
`;

const GoogleButton = styled.button`
    width: 354px;
    height: 64px;
    background: #000000;
    color: #FFFFFF;
    border: none;
    padding: 14px 18px;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 56px;
    margin-bottom: 80px;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.01);
    }
`;

const GoogleIconImg = styled.img`
    width: 32px;
    height: 32px;
    display: block;
`;
