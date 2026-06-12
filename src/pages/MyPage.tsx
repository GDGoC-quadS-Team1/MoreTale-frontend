import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import YellowButton from "../components/YellowButton";
import {
    buildMyPageInfoRows,
    deleteUser,
    getHoneyWarehouseDisplay,
    getMyPage,
    getUsageStatusDisplay,
    HONEY_JARS_PER_STORY,
    type MyPageData,
    type MyPageProfile,
} from "../apis/user";
import ProfileEditModal from "../components/profile/ProfileEditModal";
import { clearAuth } from "../lib/auth";
import ProfileDefault from "../assets/images/mypage/profile-default.svg";
// import MaleIcon from "../assets/images/mypage/male.svg";
// import FemaleIcon from "../assets/images/mypage/female.svg";
import HoneyBee1 from "../assets/images/mypage/honey-bee-1.png";
import HoneyBee2 from "../assets/images/mypage/honey-bee-2.png";
import HoneyBee3 from "../assets/images/mypage/honey-bee-3.png";
import HoneyJarFilled from "../assets/images/mypage/honey-jar-filled.png";
import HoneyJarEmpty from "../assets/images/mypage/honey-jar-empty.png";
import HoneyJarStand from "../assets/images/mypage/honey-jar-stand.png";
import UsageBee from "../assets/images/mypage/bee.png";
import PencilIcon from "../assets/images/tale/pencil.svg";

type SidebarKey = "member" | "honey" | "usage";

const SIDEBAR_ITEMS: { key: SidebarKey; label: string }[] = [
    { key: "member", label: "회원 정보" },
    { key: "honey", label: "꿀 창고" },
    { key: "usage", label: "이용 현황" },
];

const JARS_PER_ROW = 5;

const MyPage = () => {
    const navigate = useNavigate();

    const [activeSidebar, setActiveSidebar] = useState<SidebarKey>("member");
    const [myPageData, setMyPageData] = useState<MyPageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

    const handleWithdraw = async () => {
        if (isWithdrawing) return;

        const confirmed = window.confirm(
            "[moretale]\n정말 탈퇴하시겠어요?\n탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.",
        );
        if (!confirmed) return;

        setIsWithdrawing(true);
        try {
            await deleteUser();
            clearAuth();
            navigate("/login", { replace: true });
        } catch {
            window.alert("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsWithdrawing(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { data } = await getMyPage();
                if (!cancelled) {
                    setMyPageData(data);
                    setError(null);
                }
            } catch {
                if (!cancelled) {
                    setError("마이페이지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const profile = myPageData?.profiles[0];
    const accountInfo = myPageData?.accountInfo;
    const usageStatus = myPageData?.usageStatus;

    const infoRows = useMemo(
        () => (profile ? buildMyPageInfoRows(profile) : []),
        [profile],
    );

    const childName = profile?.childName ?? "";

    const handleProfileUpdated = (updatedProfile: MyPageProfile) => {
        setMyPageData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                profiles: prev.profiles.map((p) =>
                    p.profileId === updatedProfile.profileId ? updatedProfile : p,
                ),
            };
        });
    };

    if (isLoading) {
        return (
            <Wrapper>
                <Header activeMenu="my" />
                <StatusMessage>마이페이지를 불러오는 중이에요...</StatusMessage>
            </Wrapper>
        );
    }

    if (error || !myPageData || !profile || !accountInfo || !usageStatus) {
        return (
            <Wrapper>
                <Header activeMenu="my" />
                <StatusMessage>{error ?? "마이페이지 정보를 찾을 수 없습니다."}</StatusMessage>
            </Wrapper>
        );
    }

    const honeyWarehouse = getHoneyWarehouseDisplay(usageStatus);
    const usageDisplay = getUsageStatusDisplay(usageStatus);
    
    const honeyJarsFilled = Array.from(
        { length: honeyWarehouse.totalCount },
        (_, index) => index < honeyWarehouse.filledJars,
    );
    const honeyShelfRowsRendered = [
        honeyJarsFilled.slice(0, JARS_PER_ROW),
        honeyJarsFilled.slice(JARS_PER_ROW),
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
                                            <ChildName>{profile.childName}</ChildName>
                                            <ChildRole>어린이</ChildRole>
                                            <NameDivider aria-hidden />
                                            <ChildAge>{profile.childAge}세</ChildAge>
                                        </Name>
                                        {/* <GenderIcon
                                            src={CHILD_PROFILE.gender === "male" ? MaleIcon : FemaleIcon}
                                            alt={CHILD_PROFILE.gender === "male" ? "남" : "여"}
                                        /> */}
                                    </NameRow>
                                    <Email>{accountInfo.email}</Email>
                                </ProfileInfoContainer>
                                <WithdrawButton
                                    type="button"
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing}
                                >
                                    {isWithdrawing ? "탈퇴 처리 중..." : "회원 탈퇴"}
                                </WithdrawButton>
                            </ProfileCard>

                            <SectionTitleRow>
                                <SectionTitle>프로필 정보</SectionTitle>
                                <EditProfileButton
                                    type="button"
                                    onClick={() => setIsProfileEditOpen(true)}
                                    aria-label="프로필 수정"
                                >
                                    <PencilImg src={PencilIcon} alt="" />
                                </EditProfileButton>
                            </SectionTitleRow>

                            <InfoList>
                                {infoRows.map((row) => (
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
                                    </InfoCard>
                                ))}
                            </InfoList>

                            <ProfileEditModal
                                profile={profile}
                                isOpen={isProfileEditOpen}
                                onClose={() => setIsProfileEditOpen(false)}
                                onUpdated={handleProfileUpdated}
                            />
                        </>
                    )}

                    {activeSidebar === "honey" && (
                        <>
                            <HoneyTitle>{childName}의 꿀창고</HoneyTitle>
                            <HoneyCard>
                                <HoneyStatus>
                                    <HoneyStatusMain>
                                        꿀단지를{" "}
                                        <HoneyCount>{honeyWarehouse.honeyJarCount}</HoneyCount>개
                                        모았어요!
                                    </HoneyStatusMain>
                                    <HoneyStatusSub>
                                        {HONEY_JARS_PER_STORY}개를 모으면 동화 하나를 생성할 수
                                        있어요
                                    </HoneyStatusSub>
                                </HoneyStatus>

                                <HoneyDisplay>
                                    <Bee1 src={HoneyBee1} alt="" />
                                    <Bee2 src={HoneyBee2} alt="" />
                                    <Bee3 src={HoneyBee3} alt="" />

                                    {honeyShelfRowsRendered.map((row, rowIndex) => (
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
                        <>
                            <UsageTitle>동화 이용 현황</UsageTitle>
                            <UsageCard>
                                <UsageStatusMain>
                                    무료 동화 생성{" "}
                                    <UsageCount>
                                        {usageDisplay.freeStoriesUsed} /{" "}
                                        {usageDisplay.freeStoryQuota}
                                    </UsageCount>{" "}
                                    회 완료
                                </UsageStatusMain>

                                <ProgressBarWrap>
                                    <ProgressBarTrack>
                                        <ProgressBarFill
                                            $progress={usageDisplay.usageProgress}
                                        />
                                    </ProgressBarTrack>
                                    <ProgressBee
                                        src={UsageBee}
                                        alt=""
                                        $progress={usageDisplay.usageProgress}
                                    />
                                </ProgressBarWrap>

                                <UsageSummary>
                                    벌써 동화를 {usageDisplay.totalStoriesCreated}개 만들었어요!
                                    <br />
                                    아직 {usageDisplay.remainingFreeStories}번 더 만들 수 있어요
                                </UsageSummary>
                            </UsageCard>

                            <UsageButtonContainer>
                                <YellowButton
                                    type="button"
                                    width={300}
                                    height={68}
                                    fontSize={32}
                                    onClick={() => navigate("/tale/intro")}
                                >
                                    동화 만들러 가기
                                </YellowButton>
                            </UsageButtonContainer>
                        </>
                    )}
                </Main>
            </Container>
        </Wrapper>
    );
};

export default MyPage;

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

const StatusMessage = styled.p`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 48px 24px;
    background: #F2F2F2;
    color: #424242;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
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

// const GenderIcon = styled.img`
//     width: auto;
//     height: 32px;
//     display: block;
//     margin-left: 4px;
// `;

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

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SectionTitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0 0;
`;

const SectionTitle = styled.p`
    margin: 0;
    color: #424242;
    font-size: 28px;
    font-weight: 800;
`;

const EditProfileButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PencilImg = styled.img`
    width: 29px;
    height: 29px;
    display: block;
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const InfoCard = styled.article`
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 160px 1px 1fr;
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

const UsageTitle = styled.h2`
    margin: 0;
    color: #424242;
    font-size: 28px;
    font-weight: 900;
`;

const UsageCard = styled.section`
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    padding: 44px 60px;
    border-radius: 12px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

const UsageStatusMain = styled.p`
    margin: 0;
    color: #1F1F1F;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
`;

const UsageCount = styled.span`
    color: #64926B;
    font-weight: 800;
`;

const ProgressBarWrap = styled.div`
    position: relative;
    width: 100%;
    max-width: 800px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
`;

const ProgressBarTrack = styled.div`
    width: 100%;
    height: 32px;
    background: #424242;
    overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
    width: ${({ $progress }) => $progress * 100}%;
    height: 100%;
    background: linear-gradient(90deg, #FFDE21 0%, #BFA71DCC 100%);
`;

const ProgressBee = styled.img<{ $progress: number }>`
    position: absolute;
    top: -40px;
    left: ${({ $progress }) => `${$progress * 100}%`};
    width: 100px;
    height: auto;
    transform: translate(-50%, 0);
`;

const UsageSummary = styled.p`
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #424242;
    font-size: 24px;
    font-weight: 700;
    line-height: 45px;
`;

const UsageButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 60px;
`;
