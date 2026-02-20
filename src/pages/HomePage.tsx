import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Container>
                <Header />
            </Container>
        </Wrapper>
    );
};

export default HomePage;

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
    width: 100%;
    box-sizing: border-box;
`;
