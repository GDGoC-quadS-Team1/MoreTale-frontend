import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";

const PromptPage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header />
            <Container>
                <Title>만들고 싶은 이야기에 대해 알려주세요!</Title>
                <TextInput placeholder="이곳을 클릭해 입력해주세요." />
                <YellowButton type="button" width={195} height={63} fontSize={30} borderRadius={5} onClick={() => navigate("/tale/language")}>
                    다 적었어요
                </YellowButton>
            </Container>
        </Wrapper>
    );
};

export default PromptPage;

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

const TextInput = styled.textarea`
    width: 740px;
    height: 312px;
    border: 3px solid #FFDE21;
    border-radius: 10px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 12px 20px;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 36px;
    color: #1F1F1F;
    background: #FFFFFF;
    resize: none;
    outline: none;
    box-sizing: border-box;
    cursor: text;
    vertical-align: top;
    text-align: left;
`;
