import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bookCoverEx from "../assets/images/tale/book-cover-ex.png";
import koreaFlag from "../assets/images/tale/flag/korea.png";
import wordIcon from "../assets/images/icon/word.svg";
import moreIcon from "../assets/images/icon/more.svg";
import { languageCodeToFlag } from "../apis/tale";

export type BookCardListVariant = "library" | "quiz";

export interface BookCardProps {
    storyId?: number;
    title?: string;
    date?: string;
    coverSrc?: string;
    primaryLanguage?: string;
    secondaryLanguage?: string;
    /* 카드 클릭 시 버튼 : library → [읽기 | 단어장], quiz → [퀴즈 풀기] */
    listVariant?: BookCardListVariant;
    onDelete?: (storyId: number) => void | Promise<void>;
}

const BookCard = ({
    storyId,
    title = "달을 따라 간 소년",
    date = "2026.03.29.",
    coverSrc = bookCoverEx,
    primaryLanguage,
    secondaryLanguage,
    listVariant = "library",
    onDelete,
}: BookCardProps) => {
    const primaryFlag = primaryLanguage ? languageCodeToFlag(primaryLanguage) : koreaFlag;
    const secondaryFlag = secondaryLanguage ? languageCodeToFlag(secondaryLanguage) : undefined;
    const navigate = useNavigate();
    const [cardPopover, setCardPopover] = useState(false);
    const [morePopover, setMorePopover] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setCardPopover(false);
                setMorePopover(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCardPopover(false);
        setMorePopover((prev) => !prev);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMorePopover(false);
        if (storyId == null || !onDelete) return;
        void onDelete(storyId);
    };

    return (
        <Card ref={cardRef} onClick={() => { setMorePopover(false); setCardPopover((prev) => !prev); }}>
            <CardContent>
                <Cover src={coverSrc} alt="" />
                <Body>
                    {/* 제목 & 더보기 버튼 */}
                    <TitleRow>
                        <Title>{title}</Title>
                        <MoreButton type="button" onClick={handleMoreClick}>
                            <MoreIcon src={moreIcon} alt="" />
                        </MoreButton>
                    </TitleRow>

                    {/* 언어 */}
                    <Flags>
                        {primaryFlag ? <Flag src={primaryFlag} alt="" /> : null}
                        {secondaryFlag ? <Flag src={secondaryFlag} alt="" /> : null}
                    </Flags>

                    {/* 생성일 & 단어장 */}
                    <Footer>
                        <DateText>{date}</DateText>
                        <WordButton type="button" onClick={() => navigate("/voca")}>
                            <WordIcon src={wordIcon} alt="" />
                        </WordButton>
                    </Footer>
                </Body>
            </CardContent>

            {/* 오버레이 */}
            {(cardPopover || morePopover) && (
                <Overlay onClick={(e) => e.stopPropagation()} />
            )}

            {/* [팝오버] library → [읽기 | 단어장], quiz → [퀴즈 풀기] */}
            {cardPopover && (
                <CardPopover onClick={(e) => e.stopPropagation()}>
                    {listVariant === "quiz" ? (
                        <PopoverButton
                            onClick={() =>
                                storyId != null
                                    ? navigate(`/quiz/play?storyId=${storyId}`, {
                                        state: { storyId, title },
                                    })
                                    : navigate("/quiz/play")
                            }
                        >
                            퀴즈 풀기
                        </PopoverButton>
                    ) : (
                        <>
                            <PopoverButton
                                onClick={() =>
                                    storyId != null
                                        ? navigate(`/tale/read/${storyId}`)
                                        : navigate("/tale/read")
                                }
                            >
                                읽기
                            </PopoverButton>
                            <PopoverDivider />
                            <PopoverButton onClick={() => navigate("/voca")}>단어장</PopoverButton>
                        </>
                    )}
                </CardPopover>
            )}

            {/* [팝오버] 삭제 */}
            {morePopover && (
                <MorePopover onClick={(e) => e.stopPropagation()}>
                    <PopoverButton
                        $danger
                        onClick={onDelete ? handleDeleteClick : undefined}
                    >
                        삭제
                    </PopoverButton>
                </MorePopover>
            )}
        </Card>
    );
};

export default BookCard;

const Card = styled.div`
    width: 100%;
    background: #FFFFFF;
    border-radius: 0 0 5px 5px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    min-width: 0;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.01);
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`;

const Cover = styled.img`
    flex: 1.5;
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
`;

const Body = styled.div`
    flex: 1;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

const Title = styled.p`
    margin: 0;
    width: 90%;
    font-size: 16px;
    font-weight: 800;
    color: #424242;
`;

const MoreButton = styled.button`
    flex-shrink: 0;
    padding: 2px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const MoreIcon = styled.img`
    width: 4px;
    height: auto;
    display: block;
`;

const Flags = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
`;

const Flag = styled.img`
    width: auto;
    height: 19px;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
`;

const Footer = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
`;

const DateText = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #9E9E9E;
`;

const WordButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`;

const WordIcon = styled.img`
    width: auto;
    height: 24px;
    display: block;
`;

// Popover Style
const CardPopover = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background: #FFFFFF;
    border-radius: 10px;
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    white-space: nowrap;
`;

const MorePopover = styled.div`
    position: absolute;
    bottom: 80px;
    right: 16px;
    z-index: 10;
    background: #FFFFFF;
    border-radius: 10px;
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
    white-space: nowrap;
`;

const PopoverButton = styled.button<{ $danger?: boolean }>`
    padding: 10px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    color: ${({ $danger }) => ($danger ? "#F02828" : "#424242")};
    border-radius: 10px;
    transition: background 0.2s ease;

    &:hover {
        background: #f5f5f5;
    }
`;

const PopoverDivider = styled.div`
    width: 1px;
    height: 22px;
    background: #E0E0E0;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9;
    border-radius: 0 0 5px 5px;
`;
