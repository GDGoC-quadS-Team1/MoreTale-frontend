import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import Korea from "../../assets/images/tale/flag/korea.png";
import Japan from "../../assets/images/tale/flag/japan.png";

const LanguagePage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header />
            <Container>
                <Title>두 가지 언어로<br/>이야기를 만들어볼게요!</Title>
                <LanguageContainer>
                    <LanguageItem>
                        <Image src={Korea} alt="한국어" />
                        <LanguageText>한국어</LanguageText>
                        <Button>변경</Button>
                    </LanguageItem>
                    <LanguageItem>
                        <Image src={Japan} alt="일본어" />
                        <LanguageText>日本語</LanguageText>
                        <Button>変更</Button>
                    </LanguageItem>
                </LanguageContainer>
                <YellowButton type="button" width={158} height={63} fontSize={30} borderRadius={5} onClick={() => navigate("/tale/loading")}>
                    좋아요!
                </YellowButton>
            </Container>
        </Wrapper>
    );
};

export default LanguagePage;

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
    height: 214px;
`;

const LanguageContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 170px;
`;

const LanguageItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const LanguageText = styled.div`
    color: #1F1F1F;
    font-size: 33px;
    font-style: normal;
    font-weight: 700;
    line-height: 45px;
    text-align: center;
    cursor: default;
`;

const Button = styled.button`
    width: 100px;
    height: 32px;
    background: #CFCFCF;
    border: none;
    border-radius: 30px;
    color: #1F1F1F;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    cursor: pointer;
`;
