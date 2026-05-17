import { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import ProfileDefault from "../assets/images/mypage/profile-default.svg";
import MaleIcon from "../assets/images/mypage/male.svg";
import FemaleIcon from "../assets/images/mypage/female.svg";

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
                    {activeSidebar === "member" ? (
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
                    ) : (
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

const Placeholder = styled.p`
`;
