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
import Image1 from "../../assets/mid-demo/illustrations/page_01.png";

const ReadPage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
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
                    <NavButton $position="left" type="button" aria-label="">
                        <Image height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>
                    <NavButton $position="right" type="button" aria-label="">
                        <Image height={26} src={ArrowRightIcon} alt="" onClick={() => navigate("/tale/finish")}/>
                    </NavButton>

                    {/* 일러스트 */}
                    <LeftSection>
                        <PageImage src={Image1} alt="동화 일러스트" />
                    </LeftSection>

                    {/* 텍스트 */}
                    <RightSection>
                        {/* 언어 1 */}
                        <TextContainer>
                            <Flag src={Korea} alt="한국어" />
                            <Lang>
                                <LangText>한국어 텍스트</LangText>
                                <SpeakerButton type="button" aria-label="">
                                    <Image height={36} src={SpeakerIcon} alt="" />
                                </SpeakerButton>
                            </Lang>
                        </TextContainer>
                        {/* 언어 2 */}
                        <TextContainer>
                            <Flag src={Japan} alt="일본어" />
                            <Lang>
                                <LangText>일본어 텍스트</LangText>
                                <SpeakerButton type="button" aria-label="">
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
    align-items: center;
    justify-content: center;
`;

const RightSection = styled.div`
    flex: 1.01;
    background: #FFFFFF;
    padding: 60px 80px 200px 50px;
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
    max-width: 680px;
    height: 100%;
    max-height: 680px;
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
