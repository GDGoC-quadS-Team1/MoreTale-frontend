import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import YellowButton from "../../components/YellowButton";
import Korea from "../../assets/images/tale/flag/korea.png";
import Japan from "../../assets/images/tale/flag/japan.png";
import BookCover from "../../assets/images/tale/book-cover-ex.png";
import Flower from "../../assets/images/tale/flower.png";

const CompletePage = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <Header activeMenu="tale" />
            <Container>
                <Title>이야기가 다 만들어졌어요!</Title>
                <RowContainer>
                    <BookImageContainer>
                        <FlowerImage height={380} src={Flower} alt="" />
                        <BookImage height={260} src={BookCover} alt="" />
                    </BookImageContainer>
                    <ColumnContainer>
                        <FlagContainer>
                            <Image height={96} src={Korea} alt="한국어" />
                            <Image height={96} src={Japan} alt="일본어" />
                        </FlagContainer>
                        <YellowButton type="button" width={320} height={68} fontSize={28} borderRadius={5} onClick={() => navigate("/tale/read")}>
                            이야기 보러 가기
                        </YellowButton>
                        <YellowButton type="button" width={320} height={68} fontSize={28} borderRadius={5} backgroundColor={'#515050'} color={'#FFDE21'}>
                            도서관에 넣기
                        </YellowButton>
                    </ColumnContainer>
                </RowContainer>
            </Container>
        </Wrapper>
    );
};

export default CompletePage;

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
    height: ${props => props.height}px;
`;

const BookImageContainer = styled.div`
    position: relative;
    width: 540px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FlowerImage = styled.img`
    height: ${props => props.height}px;
`;

const BookImage = styled(Image)`
    position: absolute;
    z-index: 1;
    margin-top: -140px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 150px;
`;

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const FlagContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 33px;
    margin-bottom: 20px;
    padding-top: 16px;
`;
