import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import LoadingImage from "../../assets/images/tale/loading.png";

const LoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/tale/complete");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Wrapper>
            <Header />
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
    gap: 32px;
    padding-bottom: 100px;
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
