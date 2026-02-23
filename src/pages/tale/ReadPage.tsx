import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import Book from "../../assets/images/tale/book.png";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import Korea from "../../assets/images/tale/flag/korea.png";
import Japan from "../../assets/images/tale/flag/japan.png";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";
import ArrowRightIcon from "../../assets/images/tale/arrow-right.svg";
import SpeakerIcon from "../../assets/images/tale/speaker.svg";
import BookmarkIcon from "../../assets/images/tale/bookmark.svg";
// mid-demo source
import Image01 from "../../assets/mid-demo/illustrations/page_01.png";
import Image02 from "../../assets/mid-demo/illustrations/page_02.png";
import audio01Primary from "../../assets/mid-demo/audio/01_korean/page_01_primary.wav";
import audio02Primary from "../../assets/mid-demo/audio/01_korean/page_02_primary.wav";
import audio01Secondary from "../../assets/mid-demo/audio/02_japanese/page_01_secondary.wav";
import audio02Secondary from "../../assets/mid-demo/audio/02_japanese/page_02_secondary.wav";

const SLIDES = [
    {
        image: Image01,
        text_primary: "깊은 밤, 언제나 빛나던 달이 오늘은 보이지 않았어요. 하늘은 온통 깜깜했죠. 모두가 고개를 갸웃거렸답니다.",
        text_secondary: "深い夜、いつも輝いていた月が、今日は見えませんでした。空は真っ暗でした。みんなが首をかしげました。",
        audio_primary: audio01Primary,
        audio_secondary: audio01Secondary,
    },
    {
        image: Image02,
        text_primary: "저 멀리 달나라에 사는 달토끼 달리도 깜짝 놀랐어요. 밤마다 떡을 찧어야 하는데, 달빛이 없으니 아무것도 보이지 않았거든요.",
        text_secondary: "遠い月の国に住む月うさぎのダリもびっくりしました。毎晩お餅をつかなければならないのに、月の光がないと何も見えなかったからです。",
        audio_primary: audio02Primary,
        audio_secondary: audio02Secondary,
    },
];

const ReadPage = () => {
    const navigate = useNavigate();
    
    const [currentSlide, setCurrentSlide] = useState(0);
    const audioPrimaryRef = useRef<HTMLAudioElement | null>(null);
    const audioSecondaryRef = useRef<HTMLAudioElement | null>(null);

    const slide = SLIDES[currentSlide];
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === SLIDES.length - 1;

    const handleLeftClick = () => {
        if (isLastSlide) {
            navigate("/tale/finish");
        } else if (isFirstSlide) {
            navigate(-1);
        } else {
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const handleRightClick = () => {
        if (isLastSlide) {
            navigate("/tale/finish");
        } else {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const playPrimary = () => {
        if (audioPrimaryRef.current) {
            audioPrimaryRef.current.currentTime = 0;
            audioPrimaryRef.current.play();
        }
    };

    const playSecondary = () => {
        if (audioSecondaryRef.current) {
            audioSecondaryRef.current.currentTime = 0;
            audioSecondaryRef.current.play();
        }
    };

    return (
        <Wrapper>
            <audio ref={audioPrimaryRef} src={slide.audio_primary} preload="metadata" />
            <audio ref={audioSecondaryRef} src={slide.audio_secondary} preload="metadata" />
            <Header />
            <Container>
                {/* 표지 및 제목 */}
                <InfoContainer>
                    <Image height={120} src={Book} alt="" />
                    <Title>달토끼와 츠키 토끼의 빛나는 선물</Title>
                    <Icon src={PencilIcon} alt="" />
                </InfoContainer>

                {/* 내용 */}
                <BookContainer>
                    <Bookmark src={BookmarkIcon} alt="" />
                    <NavButton $position="left" type="button" aria-label="" onClick={handleLeftClick}>
                        <Image height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>
                    <NavButton $position="right" type="button" aria-label="" onClick={handleRightClick}>
                        <Image height={26} src={ArrowRightIcon} alt="" />
                    </NavButton>

                    {/* 일러스트 */}
                    <LeftSection>
                        <PageImage src={slide.image} alt="" />
                    </LeftSection>

                    {/* 텍스트 */}
                    <RightSection>
                        {/* 언어 1 */}
                        <TextContainer>
                            <Flag src={Korea} alt="" />
                            <Lang>
                                <LangText>{slide.text_primary}</LangText>
                                <SpeakerButton type="button" aria-label="" onClick={playPrimary}>
                                    <Image height={36} src={SpeakerIcon} alt="" />
                                </SpeakerButton>
                            </Lang>
                        </TextContainer>
                        {/* 언어 2 */}
                        <TextContainer>
                            <Flag src={Japan} alt="" />
                            <Lang>
                                <LangText>{slide.text_secondary}</LangText>
                                <SpeakerButton type="button" aria-label="" onClick={playSecondary}>
                                    <Image height={36} src={SpeakerIcon} alt="" />
                                </SpeakerButton>
                            </Lang>
                        </TextContainer>
                    </RightSection>
                </BookContainer>
            </Container>
        </Wrapper>
    );
};

export default ReadPage;

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
    background: #DEDEDE;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 60px;
    box-sizing: border-box;
    overflow: auto;
`;

const Title = styled.div`
    color: #1F1F1F;
    text-align: center;
    font-size: 40px;
    font-style: normal;
    font-weight: 800;
    line-height: 45px;
    cursor: default;
`;

const Image = styled.img`
    height: ${props => props.height}px;
`;

const Icon = styled.img`
    width: 29px;
    height: 29px;
`;

const InfoContainer = styled.div`
    width: 100%;
    max-width: 1400px;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    align-self: flex-start;
    gap: 20px;
    z-index: 1;
    padding-left: 20px;
`;

const BookContainer = styled.div`
    width: 100%;
    max-width: 1400px;
    position: relative;
    background: #FFFFFF;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: -28px;
    overflow: visible;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`;

const LeftSection = styled.div`
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
`;

const RightSection = styled.div`
    flex: 1.01;
    background: #FFFFFF;
    padding: 20px 80px 20px 50px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 50px;
`;

const Bookmark = styled.img`
    position: absolute;
    top: -10px;
    right: 38px;
    width: 40px;
    height: 68px;
    z-index: 100;
    pointer-events: none;
`;

const NavButton = styled.button<{ $position: "left" | "right" }>`
    position: absolute;
    top: 50%;
    ${props => props.$position === "left" ? "left: -28px;" : "right: -28px;"}
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 0.3px solid #000000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    padding: 0;
    z-index: 10;
`;

const PageImage = styled.img`
    width: 100%;
    max-width: 580px;
    height: 100%;
    max-height: 580px;
    object-fit: contain;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
`;

const Flag = styled.img`
    width: 65px;
    height: 43px;
`;

const Lang = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
`;

const LangText = styled.div`
    color: #1F1F1F;
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: 45px;
`;

const SpeakerButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;
