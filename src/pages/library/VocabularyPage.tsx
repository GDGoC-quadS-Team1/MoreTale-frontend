import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import BookStand from "../../assets/images/tale/book-stand.png";
import BookCover from "../../assets/images/tale/book-cover-ex.png";
import KoreaFlag from "../../assets/images/tale/flag/korea.png";
import JapanFlag from "../../assets/images/tale/flag/japan.png";
import StarEmpty from "../../assets/images/icon/star-empty.svg";
import StarFilled from "../../assets/images/icon/star-filled.svg";
import DeleteIcon from "../../assets/images/icon/delete.svg";
import LibraryIcon from "../../assets/images/icon/library.svg";
import SearchIcon from "../../assets/images/icon/search.svg";
import SpeakerIcon from "../../assets/images/icon/speaker-black.svg";

type VocaItem = {
    id: number;
    kanji: string;
    furigana: string;
    koreanReading: string;
    korean: string;
    starred: boolean;
};

const BOOK_TITLE = "달을 따러 간 소년";

const INITIAL_VOCAB: VocaItem[] = [
    { id: 1, kanji: "月", furigana: "つき", koreanReading: "츠키", korean: "달", starred: false },
    { id: 2, kanji: "星", furigana: "ほし", koreanReading: "호시", korean: "별", starred: false },
    { id: 3, kanji: "約束", furigana: "やくそく", koreanReading: "야쿠소쿠", korean: "약속", starred: false },
    { id: 4, kanji: "夢", furigana: "ゆめ", koreanReading: "유메", korean: "꿈", starred: true },
    { id: 5, kanji: "願い", furigana: "ねがい", koreanReading: "네가이", korean: "소원", starred: false },
    { id: 6, kanji: "光", furigana: "ひかり", koreanReading: "히카리", korean: "빛", starred: true },
];

const VocabularyPage = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState<VocaItem[]>(INITIAL_VOCAB);
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            (item) =>
                item.kanji.includes(q) ||
                item.furigana.includes(q) ||
                item.korean.includes(q) ||
                item.koreanReading.toLowerCase().includes(q),
        );
    }, [items, search]);

    const toggleStar = (id: number) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item)),
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <Wrapper>
            <Header activeMenu="voca" />
            <Container>
                <ContentShell>
                    <TitleContainer>
                        <BookTitle>{BOOK_TITLE}</BookTitle>
                        <FlagGroup>
                            <FlagIcon src={JapanFlag} alt="일본어" />
                            <FlagIcon src={KoreaFlag} alt="한국어" />
                        </FlagGroup>
                    </TitleContainer>

                    <BookCoverContainer aria-hidden>
                        <BookCoverImg src={BookCover} alt="" />
                        <BookStandImg src={BookStand} alt="" />
                    </BookCoverContainer>

                    <MainCard>
                        <ToolContainer>
                            <SearchField>
                                <SearchInput
                                    placeholder=""
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <SearchIconImg src={SearchIcon} alt="" />
                            </SearchField>
                            <LibraryButton onClick={() => navigate("/lib")}>
                                <LibraryIconImg src={LibraryIcon} alt="" />
                            </LibraryButton>
                        </ToolContainer>

                        <CardGrid>
                            {filteredItems.map((item, index) => (
                                <VocaCard key={item.id}>
                                    <CardHeader $starred={item.starred}>
                                        <CardIndex>{index + 1}</CardIndex>
                                        <CardActions>
                                            <IconButton
                                                type="button"
                                                aria-label={item.starred ? "즐겨찾기 해제" : "즐겨찾기"}
                                                onClick={() => toggleStar(item.id)}
                                            >
                                                <ActionIcon src={item.starred ? StarFilled : StarEmpty} alt="" />
                                            </IconButton>
                                            <IconButton
                                                type="button"
                                                aria-label="삭제"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <ActionIcon src={DeleteIcon} alt="" />
                                            </IconButton>
                                        </CardActions>
                                    </CardHeader>
                                    <CardBody>
                                        <Row1>
                                            <VocaBlock>
                                                <RubyWrap>
                                                    <ruby>
                                                        {item.kanji}
                                                        <rt>{item.furigana}</rt>
                                                    </ruby>
                                                </RubyWrap>
                                                <Reading>{item.koreanReading}</Reading>
                                            </VocaBlock>
                                            <SpeakerButton type="button" aria-label="일본어 발음">
                                                <SpeakerImg src={SpeakerIcon} alt="" />
                                            </SpeakerButton>
                                        </Row1>
                                        <Row2 $highlighted={item.starred}>
                                            {item.korean}
                                            <SpeakerButton type="button" aria-label="한국어 발음">
                                                <SpeakerImg src={SpeakerIcon} alt="" />
                                            </SpeakerButton>
                                        </Row2>
                                    </CardBody>
                                </VocaCard>
                            ))}
                        </CardGrid>
                    </MainCard>
                </ContentShell>
            </Container>
        </Wrapper>
    );
};

export default VocabularyPage;

const Wrapper = styled.div`
    background: #FFDE21;
    width: 100%;
    min-width: 1200px;
    min-height: 100dvh;
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
    justify-content: flex-start;
    padding: 70px 60px;
    box-sizing: border-box;
    overflow: auto;
`;

const ContentShell = styled.div`
    position: relative;
    width: 100%;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
`;

const TitleContainer = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    background: #FFFFFF;
    border-radius: 20px 20px 0 0;
    padding: 30px 40px;
    position: relative;
    z-index: 2;
`;

const BookTitle = styled.p`
    margin: 0;
    color: #1F1F1F;
    font-size: 40px;
    font-weight: 900;
    line-height: 45px;
`;

const FlagGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FlagIcon = styled.img`
    width: auto;
    height: 26px;
    display: block;
    border: 0.3px solid rgba(0, 0, 0, 0.4);
`;

const BookCoverContainer = styled.div`
    position: absolute;
    top: -20px;
    right: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 3;
`;

const BookCoverImg = styled.img`
    width: 140px;
    height: auto;
    display: block;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const BookStandImg = styled.img`
    width: 180px;
    height: auto;
    display: block;
    margin-top: -8px;
`;

const MainCard = styled.div`
    width: 100%;
    background: #FFFFFF;
    border-radius: 0 20px 20px 20px;
    padding: 40px 60px 40px 40px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
`;

const ToolContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-bottom: 28px;
    padding-right: 8px;
`;

const SearchField = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 5px;
    border: 1px solid #424242;
    max-width: 160px
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    color: #424242;
    font-size: 16px;
    font-weight: 600;

    &::placeholder {
        color: #909090;
    }
`;

const SearchIconImg = styled.img`
    width: auto;
    height: 24px;
    display: block;
`;

const LibraryButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LibraryIconImg = styled.img`
    width: 28px;
    height: auto;
    display: block;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 52px;
`;

const VocaCard = styled.article`
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #909090;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;
`;

const CardHeader = styled.div<{ $starred?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: ${({ $starred }) => ($starred ? "#FFDE21" : "#FDEFA4")};
    box-sizing: border-box;
`;

const CardIndex = styled.span`
    color: #1F1F1F;
    font-size: 20px;
    font-weight: 800;
`;

const CardActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const IconButton = styled.button`
    padding: 2px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ActionIcon = styled.img`
    width: auto;
    height: 20px;
    display: block;
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: 14px;
    gap: 20px;
`;

const Row1 = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    gap: 20px;
`;

const VocaBlock = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 20px;
    flex: 1;
`;

const RubyWrap = styled.span`
    font-size: 40px;
    font-weight: 800;
    color: #1F1F1F;

    ruby {
        ruby-align: center;
    }

    rt {
        font-size: 12px;
        margin-bottom: 8px;
    }
`;

const Reading = styled.span`
    color: #949494;
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
`;

const Row2 = styled.div<{ $highlighted?: boolean }>`
    flex: 1;
    display: flex;
    display-direction: row;
    justify-content: space-between;
    padding: 20px;
    border-radius: 8px;
    background: ${({ $highlighted }) => ($highlighted ? "#FDEFA4" : "#F4F3F0")};
    color: #424242;
    font-size: 36px;
    font-weight: 800;
`;

const SpeakerButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SpeakerImg = styled.img`
    width: 36px;
    height: auto;
    display: block;
`;
