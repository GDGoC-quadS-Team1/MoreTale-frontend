import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import BookStand from "../../assets/images/tale/book-stand.png";
import KoreaFlag from "../../assets/images/tale/flag/korea.png";
import StarEmpty from "../../assets/images/icon/star-empty.svg";
import StarFilled from "../../assets/images/icon/star-filled.svg";
import DeleteIcon from "../../assets/images/icon/delete.svg";
import LibraryIcon from "../../assets/images/icon/library.svg";
import SearchIcon from "../../assets/images/icon/search.svg";
import SpeakerIcon from "../../assets/images/icon/speaker-black.svg";
import {
    deleteVocabulary,
    getVocabulary,
    updateVocabulary,
    type VocabularyItem,
} from "../../apis/vocabulary";
import { languageCodeToFlag } from "../../apis/tale";
import { speakText } from "../../lib/speechSynthesis";

const PAGE_SIZE = 20;

function sortVocabularyItems(items: VocabularyItem[]): VocabularyItem[] {
    return [...items].sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

type VocabularyLocationState = {
    title?: string;
    coverSrc?: string;
    primaryLanguage?: string;
    secondaryLanguage?: string;
};

const VocabularyPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const locationState = (location.state ?? {}) as VocabularyLocationState;

    const storyIdParam = searchParams.get("storyId");
    const storyId = storyIdParam ? Number(storyIdParam) : undefined;

    const [items, setItems] = useState<VocabularyItem[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedKeyword(search.trim()), 300);
        return () => window.clearTimeout(timer);
    }, [search]);

    const fetchPage = useCallback(
        async (pageToLoad: number, keyword: string, append: boolean) => {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            try {
                const { data } = await getVocabulary({
                    page: pageToLoad,
                    size: PAGE_SIZE,
                    sort: "created-desc",
                    storyId: storyId != null && !Number.isNaN(storyId) ? storyId : undefined,
                    keyword: keyword || undefined,
                });
                setItems((prev) => (append ? [...prev, ...data.content] : data.content));
                setPage(data.number);
                setHasMore(!data.last);
            } catch {
                setError("단어장을 불러오지 못했습니다.");
                if (!append) setItems([]);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [storyId],
    );

    useEffect(() => {
        void fetchPage(0, debouncedKeyword, false);
    }, [debouncedKeyword, fetchPage]);

    const bookTitle = useMemo(() => {
        if (locationState.title) return locationState.title;
        if (items.length > 0) return items[0].storyTitle;
        return storyId != null ? "단어장" : "전체 단어장";
    }, [locationState.title, items, storyId]);

    const coverSrc = locationState.coverSrc;

    const primaryFlag = useMemo(() => {
        const code = locationState.primaryLanguage ?? items[0]?.sourceLanguage;
        return code ? languageCodeToFlag(code) : KoreaFlag;
    }, [locationState.primaryLanguage, items]);

    const secondaryFlag = useMemo(() => {
        const code = locationState.secondaryLanguage ?? items[0]?.targetLanguage;
        return code ? languageCodeToFlag(code) : undefined;
    }, [locationState.secondaryLanguage, items]);

    const handleToggleStar = async (vocabularyId: number) => {
        const item = items.find((v) => v.vocabularyId === vocabularyId);
        if (!item) return;

        const nextFavorite = !item.isFavorite;

        setItems((prev) =>
            sortVocabularyItems(
                prev.map((v) =>
                    v.vocabularyId === vocabularyId ? { ...v, isFavorite: nextFavorite } : v,
                ),
            ),
        );

        try {
            const { data } = await updateVocabulary(vocabularyId, { isFavorite: nextFavorite });
            setItems((prev) =>
                sortVocabularyItems(
                    prev.map((v) => (v.vocabularyId === vocabularyId ? data : v)),
                ),
            );
        } catch {
            setItems((prev) =>
                sortVocabularyItems(
                    prev.map((v) =>
                        v.vocabularyId === vocabularyId ? { ...v, isFavorite: item.isFavorite } : v,
                    ),
                ),
            );
            window.alert("즐겨찾기 변경에 실패했습니다.");
        }
    };

    const handleDelete = async (vocabularyId: number) => {
        const item = items.find((v) => v.vocabularyId === vocabularyId);

        const confirmed = window.confirm(
            `[moretale]\n'${item?.word ?? "단어"}' 단어를 삭제하시겠습니까?\n삭제하면 복구할 수 없습니다.`,
        );
        if (!confirmed) return;

        try {
            await deleteVocabulary(vocabularyId);
            setItems((prev) => prev.filter((v) => v.vocabularyId !== vocabularyId));
        } catch {
            window.alert("단어 삭제에 실패했습니다.");
        }
    };

    const handleLoadMore = () => {
        if (loading || loadingMore || !hasMore) return;
        void fetchPage(page + 1, debouncedKeyword, true);
    };

    return (
        <Wrapper>
            <Header activeMenu="voca" />
            <Container>
                <ContentShell>
                    <TitleContainer>
                        <BookTitle>{bookTitle}</BookTitle>
                        <FlagGroup>
                            {primaryFlag ? <FlagIcon src={primaryFlag} alt="" /> : null}
                            {secondaryFlag ? <FlagIcon src={secondaryFlag} alt="" /> : null}
                        </FlagGroup>
                    </TitleContainer>

                    {coverSrc ? (
                        <BookCoverContainer aria-hidden>
                            <BookCoverImg src={coverSrc} alt="" />
                            <BookStandImg src={BookStand} alt="" />
                        </BookCoverContainer>
                    ) : null}

                    <MainCard>
                        <ToolContainer>
                            <SearchField>
                                <SearchInput
                                    placeholder="단어 검색"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <SearchIconImg src={SearchIcon} alt="" />
                            </SearchField>
                            <LibraryButton onClick={() => navigate("/voca")}>
                                <LibraryIconImg src={LibraryIcon} alt="" />
                            </LibraryButton>
                        </ToolContainer>

                        {loading ? (
                            <StatusMessage>불러오는 중...</StatusMessage>
                        ) : error ? (
                            <StatusMessage>{error}</StatusMessage>
                        ) : items.length === 0 ? (
                            <StatusMessage>
                                {debouncedKeyword ? "검색 결과가 없습니다." : "저장된 단어가 없습니다."}
                            </StatusMessage>
                        ) : (
                            <>
                                <CardGrid>
                                    {items.map((item, index) => (
                                        <VocaCard key={item.vocabularyId}>
                                            <CardHeader $starred={item.isFavorite}>
                                                <CardIndex>{index + 1}</CardIndex>
                                                <CardActions>
                                                    <IconButton
                                                        type="button"
                                                        aria-label={
                                                            item.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"
                                                        }
                                                        onClick={() => void handleToggleStar(item.vocabularyId)}
                                                    >
                                                        <ActionIcon
                                                            src={item.isFavorite ? StarFilled : StarEmpty}
                                                            alt=""
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        type="button"
                                                        aria-label="삭제"
                                                        onClick={() => void handleDelete(item.vocabularyId)}
                                                    >
                                                        <ActionIcon src={DeleteIcon} alt="" />
                                                    </IconButton>
                                                </CardActions>
                                            </CardHeader>
                                            <CardBody>
                                                <Row1>
                                                    <VocaBlock>
                                                        <WordText>{item.word}</WordText>
                                                        {item.definition ? (
                                                            <Definition>{item.definition}</Definition>
                                                        ) : null}
                                                    </VocaBlock>
                                                    <SpeakerButton
                                                        type="button"
                                                        aria-label="발음 듣기"
                                                        onClick={() =>
                                                            speakText(item.word, item.sourceLanguage)
                                                        }
                                                    >
                                                        <SpeakerImg src={SpeakerIcon} alt="" />
                                                    </SpeakerButton>
                                                </Row1>
                                                <Row2 $highlighted={item.isFavorite}>
                                                    <TranslationBlock>
                                                        <TranslationText>{item.translation}</TranslationText>
                                                        {item.secondaryDefinition ? (
                                                            <SecondaryDefinition>
                                                                {item.secondaryDefinition}
                                                            </SecondaryDefinition>
                                                        ) : null}
                                                    </TranslationBlock>
                                                </Row2>
                                            </CardBody>
                                        </VocaCard>
                                    ))}
                                </CardGrid>
                                {hasMore ? (
                                    <LoadMoreButton
                                        type="button"
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? "불러오는 중..." : "더 보기"}
                                    </LoadMoreButton>
                                ) : null}
                            </>
                        )}
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

const StatusMessage = styled.p`
    margin: 0;
    text-align: center;
    color: #757575;
    font-size: 16px;
    font-weight: 600;
    padding: 40px 0;
`;

const LoadMoreButton = styled.button`
    display: block;
    margin: 32px auto 0;
    padding: 10px 24px;
    border: 1px solid #424242;
    border-radius: 5px;
    background: #ffffff;
    color: #424242;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background: #fafafa;
    }
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
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const WordText = styled.span`
    font-size: 40px;
    font-weight: 800;
    color: #1F1F1F;
    line-height: 1.2;
`;

const Definition = styled.span`
    color: #949494;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
`;

const Row2 = styled.div<{ $highlighted?: boolean }>`
    flex: 1;
    display: flex;
    padding: 20px;
    border-radius: 8px;
    background: ${({ $highlighted }) => ($highlighted ? "#FDEFA4" : "#F4F3F0")};
`;

const TranslationBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const TranslationText = styled.span`
    color: #424242;
    font-size: 36px;
    font-weight: 800;
    line-height: 1.2;
`;

const SecondaryDefinition = styled.span`
    color: #757575;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
`;

const SpeakerButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const SpeakerImg = styled.img`
    width: 36px;
    height: auto;
    display: block;
`;
