import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import Book from "../../assets/images/tale/book.png";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import Finish from "../../assets/images/tale/finish.png";
import Bee from "../../assets/images/tale/bee.png";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";

const BOOK_TITLE = "달토끼와 츠키 토끼의 빛나는 선물";

const FinishPage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header />
            <Container>
                {/* 표지 및 제목 */}
                <InfoContainer>
                    <Image height={120} src={Book} alt="" />
                    <Title>{BOOK_TITLE}</Title>
                    <Icon src={PencilIcon} alt="" />
                </InfoContainer>

                <BookContainer>
                    <NavButton $position="left" type="button" aria-label="" onClick={() => navigate("/tale/read")}>
                        <Image height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>

                    <LeftSection>
                        <LeftContent>
                            <Text>
                                '{BOOK_TITLE}'을<br />
                                다 읽었어요!<br />
                                오늘의 꿀스티커를 받아요!
                            </Text>
                            <Image height={238} src={Finish} alt="꿀스티커" />
                        </LeftContent>
                    </LeftSection>

                    <RightSection>
                        <ButtonGroup>
                            <YellowButton
                                type="button"
                                width={320}
                                height={68}
                                fontSize={28}
                                borderRadius={5}
                                onClick={() => navigate("/tale/read")}
                            >
                                다시 읽으러가기
                            </YellowButton>
                            <YellowButton
                                type="button"
                                width={320}
                                height={68}
                                fontSize={28}
                                borderRadius={5}
                            >
                                퀴즈 풀러가기
                            </YellowButton>
                            <YellowButton
                                type="button"
                                width={320}
                                height={68}
                                fontSize={28}
                                borderRadius={5}
                            >
                                꿀창고 바로가기
                            </YellowButton>
                            <YellowButton
                                type="button"
                                width={320}
                                height={68}
                                fontSize={30}
                                borderRadius={5}
                                backgroundColor="#515050"
                                color="#FFDE21"
                            >
                                서재 바로가기
                            </YellowButton>
                        </ButtonGroup>
                        <Image 
                            height={140} 
                            src={Bee} 
                            alt="" 
                            style={{ 
                                marginTop: '110px',
                            }}
                        />
                    </RightSection>
                </BookContainer>
            </Container>
        </Wrapper>
    );
};

export default FinishPage;

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

const LeftSection = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 86px 40px;
`;

const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 34px;
`;

const Text = styled.div`
    color: #1F1F1F;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 45px;
    text-align: center;
    cursor: default;
`;

const RightSection = styled.div`
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
`;
