import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import BookCard from "../../components/BookCard";
import ListSearchIcon from "../../assets/images/icon/list-search.svg";
import { getLibraryStories, type LibrarySortKey, type LibraryStoryItem } from "../../apis/library";

const PAGE_SIZE = 10; // 한 페이지당 동화 수

const SORT_OPTIONS = [
    { value: "created-desc" as const, label: "최신순" },
    { value: "created-asc" as const, label: "오래된순" },
    { value: "title-asc" as const, label: "가나다순" },
];

function formatCreatedAt(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}.`;
}

const LibraryPage = () => {
    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState<LibrarySortKey>("created-desc");
    const [stories, setStories] = useState<LibraryStoryItem[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sortRootRef = useRef<HTMLDivElement>(null);

    const selectedLabel = SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "최신순";

    const fetchPage = useCallback(
        async (pageToLoad: number, sort: LibrarySortKey, append: boolean) => {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }

            try {
                const { data } = await getLibraryStories({
                    page: pageToLoad,
                    size: PAGE_SIZE,
                    sort,
                });
                setStories((prev) => (append ? [...prev, ...data.content] : data.content));
                setPage(data.number);
                setHasMore(!data.last);
            } catch {
                setError("동화 목록을 불러오지 못했습니다.");
                if (!append) setStories([]);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [],
    );

    useEffect(() => {
        void fetchPage(0, sortValue, false);
    }, [sortValue, fetchPage]);

    useEffect(() => {
        if (!sortOpen) return;
        const close = (e: MouseEvent) => {
            if (sortRootRef.current && !sortRootRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [sortOpen]);

    const handleLoadMore = () => {
        if (loading || loadingMore || !hasMore) return;
        void fetchPage(page + 1, sortValue, true);
    };

    return (
        <Wrapper>
            <Header activeMenu="library" />
            <Container>
                <Content>
                    <SortContainer>
                        <SortDropdown ref={sortRootRef}>
                            <SortTrigger
                                type="button"
                                aria-label="정렬"
                                aria-expanded={sortOpen}
                                aria-haspopup="listbox"
                                onClick={() => setSortOpen((v) => !v)}
                            >
                                <SortTriggerLabel>{selectedLabel}</SortTriggerLabel>
                                <Arrow aria-hidden />
                            </SortTrigger>
                            {sortOpen ? (
                                <SortMenu role="listbox" aria-label="정렬 옵션">
                                    {SORT_OPTIONS.filter((opt) => opt.value !== sortValue).map((opt) => (
                                        <SortMenuItem
                                            key={opt.value}
                                            type="button"
                                            role="option"
                                            aria-selected={false}
                                            onClick={() => {
                                                setSortValue(opt.value);
                                                setSortOpen(false);
                                            }}
                                        >
                                            {opt.label}
                                        </SortMenuItem>
                                    ))}
                                </SortMenu>
                            ) : null}
                        </SortDropdown>
                        <FilterIcon type="button" aria-label="목록 검색">
                            <FilterIconImg src={ListSearchIcon} alt="" />
                        </FilterIcon>
                    </SortContainer>

                    {loading ? (
                        <StatusMessage>불러오는 중...</StatusMessage>
                    ) : error ? (
                        <StatusMessage>{error}</StatusMessage>
                    ) : stories.length === 0 ? (
                        <StatusMessage>저장된 동화가 없습니다.</StatusMessage>
                    ) : (
                        <>
                            <BookGrid>
                                {stories.map((story) => (
                                    <BookCard
                                        key={story.storyId}
                                        storyId={story.storyId}
                                        title={story.title}
                                        date={formatCreatedAt(story.createdAt)}
                                        coverSrc={story.thumbnail}
                                        primaryLanguage={story.primaryLanguage}
                                        secondaryLanguage={story.secondaryLanguage}
                                    />
                                ))}
                            </BookGrid>
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
                </Content>
            </Container>
        </Wrapper>
    );
};

export default LibraryPage;

const Wrapper = styled.div`
    background: #FFDE21;
    width: 100%;
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
    padding: 40px 80px;
    box-sizing: border-box;
    overflow: auto;
`;

const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    box-sizing: border-box;
`;

const SortContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 28px;
`;

const SortDropdown = styled.div`
    position: relative;
    flex-shrink: 0;
`;

const SortTrigger = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid #424242;
    border-radius: 5px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    color: #424242;
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
`;

const SortTriggerLabel = styled.span`
    text-align: center;
`;

const Arrow = styled.span`
    display: block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid #424242;
    flex-shrink: 0;
`;

const SortMenu = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #424242;
    background: #ffffff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;
`;

const SortMenuItem = styled.button<{ $selected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 8px;
    border: none;
    border-top: 1px solid #4242424D;
    background: #ffffff;
    cursor: pointer;
    color: #424242;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;

    &:first-child {
        border-top: none;
    }

    &:hover {
        background: #fafafa;
    }
`;

const FilterIcon = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FilterIconImg = styled.img`
    width: 28px;
    height: auto;
    display: block;
`;

const BookGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 60px 70px;
`;

const StatusMessage = styled.p`
    margin: 0;
    text-align: center;
    color: #757575;
    font-size: 16px;
    font-weight: 600;
`;

const LoadMoreButton = styled.button`
    align-self: center;
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
