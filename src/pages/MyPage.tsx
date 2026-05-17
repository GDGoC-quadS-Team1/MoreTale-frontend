import { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import ProfileDefault from "../assets/images/mypage/profile-default.svg";
import MaleIcon from "../assets/images/mypage/male.svg";
import FemaleIcon from "../assets/images/mypage/female.svg";
import HoneyBee1 from "../assets/images/mypage/honey-bee-1.png";
import HoneyBee2 from "../assets/images/mypage/honey-bee-2.png";
import HoneyBee3 from "../assets/images/mypage/honey-bee-3.png";
import HoneyJarFilled from "../assets/images/mypage/honey-jar-filled.png";
import HoneyJarEmpty from "../assets/images/mypage/honey-jar-empty.png";
import HoneyJarStand from "../assets/images/mypage/honey-jar-stand.png";

type SidebarKey = "member" | "honey" | "usage";

const SIDEBAR_ITEMS: { key: SidebarKey; label: string }[] = [
    { key: "member", label: "회원 정보" },
    { key: "honey", label: "꿀 창고" },
    { key: "usage", label: "이용 현황" },
];

const CHILD_PROFILE = {
    name: "한지우",
    age: 8,
    gender: "male" as const,
    email: "jiwoo0420@gmail.com",
};

const HONEY_WAREHOUSE_DUMMY = {
    honeyCount: 6,
    totalCount: 10,
    jarsPerRow: 5,
};

const INFO_ROWS = [
    {
        label: "사용 언어",
        lines: ["한국어 | 어느 정도 익숙한 번데기 단계", "일본어 | 조금 알아듣는 애벌레 단계"],
        variant: "default" as const,
    },
    {
        label: "보호자 언어",
        lines: ["엄마 (일본어), 아빠 (한국어)"],
        variant: "default" as const,
    },
    {
        label: "듣고 싶은 이야기",
        lines: ["#신나는_모험_이야기"],
        variant: "tag" as const,
    },
];

const MyPage = () => {
    const [activeSidebar, setActiveSidebar] = useState<SidebarKey>("member");
    const { honeyCount, totalCount, jarsPerRow } = HONEY_WAREHOUSE_DUMMY;
    const honeyJars = Array.from({ length: totalCount }, (_, index) => index < honeyCount);
    const honeyShelfRows = [
        honeyJars.slice(0, jarsPerRow),
        honeyJars.slice(jarsPerRow),
    ];

    return (
        <Wrapper>
            <Header activeMenu="my" />
            <Container>
                <Sidebar>
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.key}
                            type="button"
                            $active={activeSidebar === item.key}
                            onClick={() => setActiveSidebar(item.key)}
                        >
                            {item.label}
                        </SidebarItem>
                    ))}
                </Sidebar>
                <Main>
                    {activeSidebar === "member" && (
                        <>
                            <ProfileCard>
                                <ProfileImgContainer>
                                    <AvatarWrap>
                                        <Avatar src={ProfileDefault} alt="" />
                                        <PhotoChangeButton type="button">사진 변경</PhotoChangeButton>
                                    </AvatarWrap>
                                </ProfileImgContainer>
                                <ProfileInfoContainer>
                                    <NameRow>
                                        <Name>
                                            <ChildName>{CHILD_PROFILE.name}</ChildName>
                                            <ChildRole>어린이</ChildRole>
                                            <NameDivider aria-hidden />
                                            <ChildAge>{CHILD_PROFILE.age}세</ChildAge>
                                        </Name>
                                        <GenderIcon
                                            src={CHILD_PROFILE.gender === "male" ? MaleIcon : FemaleIcon}
                                            alt={CHILD_PROFILE.gender === "male" ? "남" : "여"}
                                        />
                                    </NameRow>
                                    <Email>{CHILD_PROFILE.email}</Email>
                                </ProfileInfoContainer>
                                <WithdrawButton type="button">회원 탈퇴</WithdrawButton>
                            </ProfileCard>

                            <SectionTitle>프로필 정보</SectionTitle>

                            <InfoList>
                                {INFO_ROWS.map((row) => (
                                    <InfoCard key={row.label}>
                                        <InfoLabel>{row.label}</InfoLabel>
                                        <InfoDivider aria-hidden />
                                        <InfoContent>
                                            {row.lines.map((line) =>
                                                row.variant === "tag" ? (
                                                    <StoryTag key={line}>{line}</StoryTag>
                                                ) : (
                                                    <p key={line}>{line}</p>
                                                ),
                                            )}
                                        </InfoContent>
                                        <EditButton type="button">정보 수정</EditButton>
                                    </InfoCard>
                                ))}
                            </InfoList>
                        </>
                    )}

                    {activeSidebar === "honey" && (
                        <>
                            <HoneyTitle>한지우의 꿀창고</HoneyTitle>
                            <HoneyCard>
                                <HoneyStatus>
                                    <HoneyStatusMain>
                                        꿀단지를 <HoneyCount>{honeyCount}</HoneyCount>개 모았어요!
                                    </HoneyStatusMain>
                                    <HoneyStatusSub>
                                        {totalCount}개를 모으면 동화 하나를 생성할 수 있어요
                                    </HoneyStatusSub>
                                </HoneyStatus>

                                <HoneyDisplay>
                                    <Bee1 src={HoneyBee1} alt="" />
                                    <Bee2 src={HoneyBee2} alt="" />
                                    <Bee3 src={HoneyBee3} alt="" />

                                    {honeyShelfRows.map((row, rowIndex) => (
                                        <ShelfRow key={rowIndex}>
                                            <JarSlots>
                                                {row.map((isFilled, jarIndex) => (
                                                    <JarSlot key={jarIndex}>
                                                        <JarImg
                                                            src={isFilled ? HoneyJarFilled : HoneyJarEmpty}
                                                            alt=""
                                                            $filled={isFilled}
                                                        />
                                                    </JarSlot>
                                                ))}
                                            </JarSlots>
                                            <StandImg src={HoneyJarStand} alt="" />
                                        </ShelfRow>
                                    ))}
                                </HoneyDisplay>
                            </HoneyCard>
                        </>
                    )}

                    {activeSidebar === "usage" && (
                        <Placeholder>
                            {SIDEBAR_ITEMS.find((item) => item.key === activeSidebar)?.label}
                        </Placeholder>
                    )}
                </Main>
            </Container>
        </Wrapper>
    );
};

export default MyPage;

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
`;

const Sidebar = styled.nav`
    flex-shrink: 0;
    width: 260px;
    background: #1F1F1F;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 44px;
    box-sizing: border-box;
`;

const SidebarItem = styled.button<{ $active?: boolean }>`
    padding: 20px 0px;
    border: none;
    background: transparent;
    text-align: left;
    font-size: 26px;
    font-weight: 800;
    color: ${({ $active }) => ($active ? "#FFDE21" : "#FFFFFF")};
    cursor: pointer;
`;

const Main = styled.main`
    flex: 1;
    background: #F2F2F2;
    padding: 56px 60px;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ProfileCard = styled.section`
    background: #FFFFFF;
    position: relative;
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 36px 48px;
    border-radius: 12px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

const ProfileImgContainer = styled.div`
    padding-bottom: 14px;
`;

const AvatarWrap = styled.div`
    position: relative;
    width: 80px;
    height: auto;
`;

const Avatar = styled.img`
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
`;

const PhotoChangeButton = styled.button`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    z-index: 1;
    padding: 5px 12px;
    border: none;
    border-radius: 8px;
    background: #FFFFFF;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
    color: #424242;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
`;

const ProfileInfoContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
`;

const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const Name = styled.p`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 36px;
    font-weight: 900;
`;

const ChildName = styled.span`
    color: #424242;
`;

const ChildRole = styled.span`
    color: #9E9E9E;
`;

const NameDivider = styled.span`
    width: 2px;
    height: 28px;
    background: #808080;
    margin: 0 12px;
`;

const ChildAge = styled.span`
    color: #424242;
`;

const GenderIcon = styled.img`
    width: auto;
    height: 32px;
    display: block;
    margin-left: 4px;
`;

const Email = styled.p`
    margin: 0;
    color: #1F1F1F;
    font-size: 15px;
    font-weight: 600;
`;

const WithdrawButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    color: #E67E7E;
    font-size: 16px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
`;

const SectionTitle = styled.p`
    margin: 20px 0 0;
    color: #424242;
    font-size: 28px;
    font-weight: 800;
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const InfoCard = styled.article`
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 160px 1px 1fr auto;
    align-items: center;
    gap: 40px;
    padding: 24px 40px;
    border-radius: 12px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

const InfoLabel = styled.p`
    margin: 0;
    color: #424242;
    font-size: 24px;
    font-weight: 800;
`;

const InfoDivider = styled.div`
    width: 1px;
    height: 60px;
    align-self: stretch;
    background: #D9D5D5;
`;

const InfoContent = styled.div`
    color: #424242;
    font-size: 20px;
    font-weight: 700;

    p {
        margin: 0;

        & + p {
            margin-top: 4px;
        }
    }
`;

const StoryTag = styled.p`
    margin: 0;
    color: #DBBB00;
    font-weight: 700;
`;

const EditButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    color: #738D76;
    font-size: 16px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
`;

const HoneyTitle = styled.h2`
    margin: 0;
    color: #424242;
    font-size: 28px;
    font-weight: 900;
`;

const HoneyCard = styled.section`
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 60px;
    border-radius: 12px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

const HoneyStatus = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
`;

const HoneyStatusMain = styled.p`
    margin: 0;
    color: #1F1F1F;
    font-size: 28px;
    font-weight: 800;
`;

const HoneyCount = styled.span`
    color: #e85d4a;
`;

const HoneyStatusSub = styled.p`
    margin: 0;
    color: #424242;
    font-size: 24px;
    font-weight: 700;
`;

const HoneyDisplay = styled.div`
    position: relative;
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

const ShelfRow = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const JarSlots = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 0px;
    width: 100%;
    margin-bottom: -40px;
    box-sizing: border-box;
`;

const JarSlot = styled.div`
    flex: 1;
    max-width: 120px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
`;

const JarImg = styled.img<{ $filled: boolean }>`
    width: 100%;
    max-width: 120px;
    height: auto;
    display: block;
    object-fit: contain;
`;

const StandImg = styled.img`
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
`;

const Bee1 = styled.img`
    position: absolute;
    left: -50px;
    top: 30px;
    width: 50px;
    height: auto;
    z-index: 2;
    pointer-events: none;
`;

const Bee2 = styled.img`
    position: absolute;
    right: 140px;
    top: 112px;
    width: 80px;
    height: auto;
    z-index: 2;
    pointer-events: none;
`;

const Bee3 = styled.img`
    position: absolute;
    right: 8px;
    top: -50px;
    width: 50px;
    height: auto;
    z-index: 2;
    pointer-events: none;
`;

const Placeholder = styled.p`
`;
