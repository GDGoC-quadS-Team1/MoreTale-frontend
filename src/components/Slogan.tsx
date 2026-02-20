import styled from "styled-components";

const Slogan = () => {
    return (
        <Wrapper>
            <Text>More Language, More Tale</Text>
        </Wrapper>
    );
};

export default Slogan;

const Wrapper = styled.div`
    background: #1F1F1F;
    width: 100%;
    max-width: 1104px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Text = styled.div`
    color: #FFDE21;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    line-height: 26px;
    cursor: default;
`;