import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import PencilIcon from "../../assets/images/tale/pencil.svg";
import Finish from "../../assets/images/tale/finish.png";
import ArrowLeftIcon from "../../assets/images/tale/arrow-left.svg";
import LibraryIcon from "../../assets/images/icon/library.svg";
import SettingIcon from "../../assets/images/icon/setting.svg";

const BOOK_TITLE = "달토끼와 츠키 토끼의 빛나는 선물";
const TOTAL_PAGES = 2;

const FinishPage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                {/* 제목 및 아이콘 */}
                <InfoContainer>
                    <LeftContainer>
                        <Title>{BOOK_TITLE}</Title>
                        <Icon src={PencilIcon} alt="" />
                    </LeftContainer>
                    <RightContainer>
                        <PageIndicator>{TOTAL_PAGES} / {TOTAL_PAGES} 쪽</PageIndicator>
                        <IconButton type="button"><Icon src={LibraryIcon} alt="" /></IconButton>
                        <IconButton type="button"><Icon src={SettingIcon} alt="" /></IconButton>
                    </RightContainer>
                </InfoContainer>

                <BookContainer>
                    <NavButton
                        $position="left"
                        type="button"
                        aria-label=""
                        onClick={() => navigate("/tale/read", { state: { startFromLast: true } })}
                    >
                        <Image height={26} src={ArrowLeftIcon} alt="" />
                    </NavButton>
                    <Content>
                        <Text>
                            &lt;{BOOK_TITLE}&gt;을 다 읽었어요!<br />
                            오늘의 꿀스티커를 받아요!
                        </Text>

                        <ImageContainer>
                            <HoneyImg src={Finish} alt="" />
                        </ImageContainer>

                        <ButtonGroup>
                            <YellowButton onClick={() => navigate("/voca")}>단어장</YellowButton>
                            <YellowButton onClick={() => navigate("/quiz")}>퀴즈 풀기</YellowButton>
                        </ButtonGroup>
                    </Content>
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
    background: #F2F2F2;
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
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    align-self: flex-start;
    gap: 20px;
    z-index: 1;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const RightContainer = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const PageIndicator = styled.div`
    border-radius: 5px;
    border: 1px solid #424242;
    padding: 6px 12px;
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    background: #FFFFFF;
    margin-right: 4px;
`;

const IconButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
`;

const BookContainer = styled.div`
    width: 100%;
    position: relative;
    background: #FFFFFF;
    border-radius: 20px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
    border: 0.3px solid #808080;
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

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 80px 40px;
`;

const Text = styled.div`
    color: #1F1F1F;
    font-size: 30px;
    font-weight: 700;
    font-style: normal;
    line-height: 45px;
    text-align: center;
    cursor: default;
    color: #1F1F1F;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 60px;
`;

const HoneyImg = styled.img`
    height: 220px;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const YellowButton = styled.button`
    width: 180px;
    padding: 8px 0;
    color: #424242;
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    border-radius: 20px;
    background: #FFDE21;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    border: none;
`;
