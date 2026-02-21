import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Image1 from "../assets/images/home/1.png";
import Image2 from "../assets/images/home/2.png";
import Image3 from "../assets/images/home/3.png";

const SLIDE_STEPS = [
    {
        title: <>More Language, <br/>More Tale! <br/>나만의 동화책</>,
        subtitle: <>지금 바로 아이의 언어와 마음을 키우는<br/>이중언어 동화를 만들어 보세요.</>,
        image: Image1,
        imageHeight: 360,
        buttonText: <>동화<br/>만들기</>,
        wrapperBackground: "#FFDE21",
        buttonBackground: "#FFFFFF",
    },
    {
        title: <>우리 아이의 <br/>세계를 기록하는 <br/>이야기 책장</>,
        subtitle: <>언어를 넘나드는<br/> 이야기들이 머무는 아이만의 도서관</>,
        image: Image2,
        imageHeight: 380,
        buttonText: <>도서관<br/>바로가기</>,
        wrapperBackground: "#ECE6DE",
        buttonBackground: "#FFDE21",
    },
    {
        title: <>동화 속 이야기를<br/> 기억해볼까요? <br/>동화 퀴즈 한 판!</>,
        subtitle: <>짧은 퀴즈로 동화를 재미있게 복습해요.<br/>퀴즈를 풀고 꿀스티커를 받아보아요!</>,
        image: Image3,
        imageHeight: 368,
        buttonText: <>퀴즈<br/>바로가기</>,
        wrapperBackground: "#FFFFFF",
        buttonBackground: "#FFDE21",
    },
];

const HomePage = () => {
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(0);
    const step = SLIDE_STEPS[currentStep];

    const goPrev = () => setCurrentStep((s) => (s <= 0 ? s : s - 1));
    const goNext = () => setCurrentStep((s) => (s >= 2 ? s : s + 1));

    return (
        <Wrapper $bg={step.wrapperBackground}>
            <Container>
                <Header />
                <Content>
                    <TextContainer>
                        <Title>{step.title}</Title>
                        <Subtitle>{step.subtitle}</Subtitle>
                    </TextContainer>
                    <ImageContainer>
                        <Image src={step.image} height={step.imageHeight} alt="" />
                    </ImageContainer>
                </Content>
                <BottomContainer>
                    <BlackBackground />
                    <BottomContent>
                        <SlideContainer>
                            <SlideBar>
                                <ActiveSegment $step={currentStep} />
                            </SlideBar>
                            <NavButtons>
                                <NavButton type="button" onClick={goPrev} aria-label="이전">&lt;</NavButton>
                                <NavButton type="button" onClick={goNext} aria-label="다음">&gt;</NavButton>
                            </NavButtons>
                        </SlideContainer>
                        <Button
                            type="button"
                            $bg={step.buttonBackground}
                            onClick={() => currentStep === 0 && navigate("/tale/intro")}
                        >
                            {step.buttonText}
                        </Button>
                    </BottomContent>
                </BottomContainer>
                <BottomBackground />
            </Container>
        </Wrapper>
    );
};

export default HomePage;

const Wrapper = styled.div<{ $bg?: string }>`
    background: ${({ $bg }) => $bg ?? "#FFDE21"};
    transition: background 0.3s ease;
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
    width: 100%;
    max-width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: visible;
`;

const Content = styled.div`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding: 20px 72px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 40px;
`;

const Title = styled.div`
    color: #000000;
    font-family: Paperlogy;
    font-size: 70px;
    font-style: normal;
    font-weight: 900;
    line-height: 95px;
    text-align: left;
`;

const Subtitle = styled.div`
    color: #1F1F1F;
    font-family: "Pretendard Variable";
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px;
    text-align: left;
    margin-bottom: 8px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-shrink: 0;
    padding-right: 24px;
`;

const Image = styled.img`
    height: ${props => props.height}px;
`;

const BUTTON_SIZE = 200;

const BottomContainer = styled.div`
    width: 100%;
    margin-top: auto;
    height: 200px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0 72px 0 72px;
    box-sizing: border-box;
`;

const BlackBackground = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${BUTTON_SIZE / 2}px;
    background: #1F1F1F;
    z-index: 0;
`;

const BottomContent = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    box-sizing: border-box;
`;

const SlideContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
`;

const SlideBar = styled.div`
    width: 300px;
    height: 1.5px;
    background: #FFDE21;
    border-radius: 3px;
    position: relative;
`;

const ActiveSegment = styled.div<{ $step: number }>`
    position: absolute;
    left: ${({ $step }) => (($step + 0.5) / 3) * 100}%;
    width: 100px;
    height: 5px;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #FFDE21;
    transition: left 0.25s ease;
`;

const NavButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const NavButton = styled.button`
    color: #FFDE21;
    font-family: GyeonggiTitle;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
`;

const Button = styled.button<{ $bg?: string }>`
    width: ${BUTTON_SIZE}px;
    height: ${BUTTON_SIZE}px;
    padding: 0;
    border: 4px solid #1F1F1F;
    border-radius: 50%;
    background: ${({ $bg }) => $bg ?? "#FFFFFF"};
    transition: background 0.3s ease;
    cursor: pointer;
    color: #1F1F1F;
    text-align: center;
    font-family: Paperlogy;
    font-size: 35px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    flex-shrink: 0;
`;

const BottomBackground = styled.div`
    height: 60px;
    background: #1F1F1F;
`;
