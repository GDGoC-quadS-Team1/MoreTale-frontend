import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";

const QuizResultPage = () => {
    return (
        <Wrapper>
            <Header activeMenu="quiz" />
            <Container>
                QuizResultPage
            </Container>
        </Wrapper>
    );
};

export default QuizResultPage;

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
    max-width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 72px;
`;
