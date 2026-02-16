import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slogan from "../components/Slogan";
import YellowButton from "../components/YellowButton";

const ProfileComplete = () => {
    const navigate = useNavigate();

    const goToTale = () => {
        navigate("/");
    };

    const goToHome = () => {
        navigate("/");
    };

    return (
        <Wrapper>
            <Container>
                <Slogan />
                <Content>
                    <Title>프로필 설정 완료!</Title>
                    <Description>
                        입력해주신 정보를 바탕으로<br/>
                        이중언어 전래동화를 하나 만들어봤어요.<br/>
                        확인해보시겠어요?
                    </Description>
                    <ButtonContainer>
                        <YellowButton type="button" width={184} height={60} fontSize={28} borderRadius={10} onClick={goToTale}>
                            동화 보기
                        </YellowButton>
                        <YellowButton type="button" width={184} height={60} fontSize={28} borderRadius={10} onClick={goToHome} backgroundColor="#1F1F1F" color="#FFDE21">
                            홈으로 이동
                        </YellowButton>
                    </ButtonContainer>
                </Content>
            </Container>
        </Wrapper>
    );
};

export default ProfileComplete;

const Wrapper = styled.div`
    background: #FFDE21;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
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
    height: 670px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    background: #FFFFFF;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
    gap: 60px;
`;

const Title = styled.div`
    color: #EACD26;
    text-align: center;
    font-size: 44px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    cursor: default;
`;

const Description = styled.div`
    color: #1F1F1F;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: default;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 30px;
`;
