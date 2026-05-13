import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import BookCard from "../../components/BookCard";
import ListSearchIcon from "../../assets/images/icon/list-search.svg";

const DEMO_CARD_COUNT = 8;

const SORT_OPTIONS = [
    { value: "created-desc", label: "최신순" },
    { value: "created-asc", label: "오래된순" },
    { value: "title-asc", label: "가나다순" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const LibraryPage = () => {
    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState<SortValue>("created-desc");
    const sortRootRef = useRef<HTMLDivElement>(null);

    const selectedLabel = SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "최신순";

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
                    <BookGrid>
                        {Array.from({ length: DEMO_CARD_COUNT }).map((_, index) => (
                            <BookCard key={index} />
                        ))}
                    </BookGrid>
                </Content>
            </Container>
        </Wrapper>
    );
};

export default LibraryPage;

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
