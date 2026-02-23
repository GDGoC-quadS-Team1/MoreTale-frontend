import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import IntroImage from "../../assets/images/tale/intro.png";

const IntroPage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header />
            <Container>
                <Title>어떤 이야기를 만들어볼까요?</Title>
                <Image src={IntroImage} height={282} alt="" />
                <YellowButton type="button" width={223} height={71} fontSize={33} borderRadius={5} onClick={() => navigate("/tale/prompt")}>
                    동화 만들기
                </YellowButton>
            </Container>
        </Wrapper>
    );
};

export default IntroPage;

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
    gap: 72px;
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
    height: ${props => props.height}px;
`;
