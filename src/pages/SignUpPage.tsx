import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slogan from "../components/Slogan";
import InputField from "../components/InputField";
import YellowButton from "../components/YellowButton";
import LogoYellow from "../assets/images/logo-yellow.svg";
import ArrowIcon from "../assets/images/arrow.svg";

const PROFICIENCY_LEVELS = [
    { key: "egg", label: "알" },
    { key: "larva", label: "애벌레" },
    { key: "pupa", label: "번데기" },
    { key: "bee", label: "꿀벌" },
] as const;

const FAMILY_OPTIONS = ["엄마", "아빠", "할아버지", "할머니", "형제자매"] as const;
const LANGUAGE_OPTIONS = ["한국어", "영어", "일본어", "중국어", "스페인어", "베트남어", "기타"] as const;
const STORY_OPTIONS = ["포근포근 안아주는 이야기", "신나는 모험 이야기", "오늘 하루를 닮은 이야기"] as const;

const SignUpPage = () => {
    const navigate = useNavigate();

    const handleComplete = () => {
        navigate("/profile-complete");
    };

    // 1. 이름
    const [name, setName] = useState("");
    // 2. 나이
    const [age, setAge] = useState("1");
    // 3. 함께 사는 사람
    const [livingWith, setLivingWith] = useState<string[]>([]);
    const [livingWithOther, setLivingWithOther] = useState("");
    // 4. 주인공 사용 언어
    const [protagonistLanguages, setProtagonistLanguages] = useState("");
    // 5. 보호자 사용 언어
    const [guardianLanguages, setGuardianLanguages] = useState("");
    // 첫 번째 말 (듣기, 말하기)
    const [listeningLevel, setListeningLevel] = useState<string | null>(null);
    const [speakingLevel, setSpeakingLevel] = useState<string | null>(null);
    // 두 번째 말 (듣기, 말하기)
    const [listeningLevel2, setListeningLevel2] = useState<string | null>(null);
    const [speakingLevel2, setSpeakingLevel2] = useState<string | null>(null);
    // 7. 좋아하는 이야기
    const [storyPreference, setStoryPreference] = useState<string | null>(null);
    const [storyPreferenceOther, setStoryPreferenceOther] = useState("");

    const toggleLivingWith = (option: string) => {
        setLivingWith((prev) =>
            prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
        );
    };

    const setDroppedLanguage = (dropped: string, setter: (v: string) => void) => {
        const trimmed = dropped.trim();
        if (!trimmed) return;
        setter(trimmed);
    };

    return (
        <Wrapper>
            <Container>
                <Slogan />
                <Content>
                    <LeftContainer>
                        <LogoYellowImg src={LogoYellow} alt="" />
                        <TextContainer>
                            <DescriptionText>구글 로그인에 성공했어요!</DescriptionText>
                            <DescriptionText>이제 더 좋은 이야기를 위해 여러분에 대해서 알려주세요.</DescriptionText>
                        </TextContainer>
                    </LeftContainer>
                    <RightContainer>
                        <Title>주인공(아이)을 소개해주세요</Title>
                        <InputContainer>
                            <FieldContainer>
                                <Question>1. 이름을 알려주세요.</Question>
                                <InputField
                                    placeholder="이름 입력"
                                    value={name}
                                    onChange={setName}
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <Question>2. 나이를 알려주세요.</Question>
                                <InputField
                                    type="number"
                                    value={age}
                                    onChange={setAge}
                                    min={1}
                                    max={18}
                                    placeholder="나이"
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <Question>3. 누구와 함께 살고 있나요? <GrayText>(다중선택 가능)</GrayText></Question>
                                <ButtonContainer>
                                    {FAMILY_OPTIONS.map((option) => (
                                        <YellowButton
                                            key={option}
                                            width={182}
                                            height={40}
                                            borderRadius={10}
                                            backgroundColor={livingWith.includes(option) ? "#D4B806" : "#FFDE21"}
                                            onClick={() => toggleLivingWith(option)}
                                        >
                                            {option}
                                        </YellowButton>
                                    ))}
                                    <YellowButton
                                        type="text-input"
                                        placeholder="직접 적을래요"
                                        value={livingWithOther}
                                        onChange={(e) => setLivingWithOther(e.target.value)}
                                        backgroundColor="#EACD26"
                                        width={182}
                                        height={40}
                                        borderRadius={10}
                                    />
                                </ButtonContainer>
                            </FieldContainer>
                        </InputContainer>
                        
                        <Title>주인공이 쓰는 언어를 알려주세요</Title>
                        <InputContainer>
                            <LanguageContainer>
                                {LANGUAGE_OPTIONS.map((lang) => (
                                    <YellowButton
                                        key={lang}
                                        width={85}
                                        backgroundColor={lang === "기타" ? "#EACD26" : "#FFDE21"}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("text/plain", lang);
                                            e.dataTransfer.effectAllowed = "copy";
                                        }}
                                    >
                                        {lang}
                                    </YellowButton>
                                ))}
                            </LanguageContainer>
                            <FieldContainer>
                                <Question>4. 주인공의 사용 언어는 무엇인가요?</Question>
                                <DropTarget
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = "copy";
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const text = e.dataTransfer.getData("text/plain");
                                        setDroppedLanguage(text, setProtagonistLanguages);
                                    }}
                                >
                                    <InputField
                                        width={400}
                                        height={48}
                                        placeholder="이곳에 끌어오세요."
                                        value={protagonistLanguages}
                                        onChange={setProtagonistLanguages}
                                    />
                                </DropTarget>
                            </FieldContainer>
                            <FieldContainer>
                                <Question>5. 보호자의 사용 언어는 무엇인가요?</Question>
                                <DropTarget
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = "copy";
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const text = e.dataTransfer.getData("text/plain");
                                        setDroppedLanguage(text, setGuardianLanguages);
                                    }}
                                >
                                    <InputField
                                        width={400}
                                        height={48}
                                        placeholder="이곳에 끌어오세요."
                                        value={guardianLanguages}
                                        onChange={setGuardianLanguages}
                                    />
                                </DropTarget>
                            </FieldContainer>
                            <FieldContainer>
                                <Question>6. 주인공은 각 언어를 얼마나 잘하나요?</Question>
                                <BackgroundContainer>
                                    <OrderTitle>
                                        <Text>첫 번째 말<RequiredText>*</RequiredText></Text>
                                    </OrderTitle>
                                    <ProficiencyGrid>
                                        <div />
                                        <ButtonLabel>이제 막 배워요</ButtonLabel>
                                        <ButtonLabel>조금 알아들어요</ButtonLabel>
                                        <ButtonLabel>익숙해요</ButtonLabel>
                                        <ButtonLabel>혼자서도 읽어요</ButtonLabel>
                                        <AbilityLabel>듣기</AbilityLabel>
                                        {PROFICIENCY_LEVELS.map(({ key, label }) => (
                                            <YellowButton
                                                key={`listening-${key}`}
                                                backgroundColor={listeningLevel === key ? "#D4B806" : "#FFDE21"}
                                                onClick={() => setListeningLevel((prev) => (prev === key ? null : key))}
                                            >
                                                {label}
                                            </YellowButton>
                                        ))}
                                        <AbilityLabel>말하기</AbilityLabel>
                                        {PROFICIENCY_LEVELS.map(({ key, label }) => (
                                            <YellowButton
                                                key={`speaking-${key}`}
                                                backgroundColor={speakingLevel === key ? "#D4B806" : "#FFDE21"}
                                                onClick={() => setSpeakingLevel((prev) => (prev === key ? null : key))}
                                            >
                                                {label}
                                            </YellowButton>
                                        ))}
                                    </ProficiencyGrid>
                                </BackgroundContainer>
                                <BackgroundContainer>
                                    <OrderTitle>
                                        <Text>두 번째 말</Text>
                                    </OrderTitle>
                                    <ProficiencyGrid>
                                        <div />
                                        <ButtonLabel>이제 막 배워요</ButtonLabel>
                                        <ButtonLabel>조금 알아들어요</ButtonLabel>
                                        <ButtonLabel>익숙해요</ButtonLabel>
                                        <ButtonLabel>혼자서도 읽어요</ButtonLabel>
                                        <AbilityLabel>듣기</AbilityLabel>
                                        {PROFICIENCY_LEVELS.map(({ key, label }) => (
                                            <YellowButton
                                                key={`listening2-${key}`}
                                                backgroundColor={listeningLevel2 === key ? "#D4B806" : "#FFDE21"}
                                                onClick={() => setListeningLevel2((prev) => (prev === key ? null : key))}
                                            >
                                                {label}
                                            </YellowButton>
                                        ))}
                                        <AbilityLabel>말하기</AbilityLabel>
                                        {PROFICIENCY_LEVELS.map(({ key, label }) => (
                                            <YellowButton
                                                key={`speaking2-${key}`}
                                                backgroundColor={speakingLevel2 === key ? "#D4B806" : "#FFDE21"}
                                                onClick={() => setSpeakingLevel2((prev) => (prev === key ? null : key))}
                                            >
                                                {label}
                                            </YellowButton>
                                        ))}
                                    </ProficiencyGrid>
                                </BackgroundContainer>
                            </FieldContainer>
                        </InputContainer>

                        <Title>이런 이야기가 좋아요</Title>
                        <InputContainer>
                            <FieldContainer>
                                <Question>7. 어떤 이야기를 좋아하는지 알려주세요.</Question>
                                <StoryContainer>
                                    {STORY_OPTIONS.map((option) => (
                                        <YellowButton
                                            key={option}
                                            width={300}
                                            height={58}
                                            borderRadius={10}
                                            fontSize={20}
                                            backgroundColor={storyPreference === option ? "#D4B806" : "#FFDE21"}
                                            onClick={() => setStoryPreference((prev) => (prev === option ? null : option))}
                                        >
                                            {option}
                                        </YellowButton>
                                    ))}
                                    <YellowButton
                                        type="text-input"
                                        placeholder="직접 적을래요"
                                        value={storyPreferenceOther}
                                        onChange={(e) => {
                                        const v = e.target.value;
                                        setStoryPreferenceOther(v);
                                        if (v.trim()) setStoryPreference(null);
                                    }}
                                        backgroundColor="#EACD26"
                                        width={300}
                                        height={58}
                                        fontSize={20}
                                        borderRadius={10}
                                    />
                                </StoryContainer>
                            </FieldContainer>
                        </InputContainer>
                        <CompleteButtonContainer>
                            <CompleteButton type="button" onClick={handleComplete}>
                                <ArrowIconImg src={ArrowIcon} alt="" />
                            </CompleteButton>
                        </CompleteButtonContainer>
                    </RightContainer>
                </Content>
            </Container>
        </Wrapper>
    );
};

export default SignUpPage;

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
    justify-content: center;
    padding: 80px;
    box-sizing: border-box;
`;

const Container = styled.div`
    width: 100%;
    min-width: 966px;
    max-width: 1104px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
`;

const Content = styled.div`
    width: 100%;
    max-width: 1104px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
`;

const LeftContainer = styled.div`
    background: #1F1F1F;
    flex: 1;
    min-width: 0;
    height: 600px;
    padding: 30px 40px 40px 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const RightContainer = styled.div`
    background: #FFFFFF;
    flex: 1.13;
    min-width: 0;
    height: 600px;
    padding: 30px 80px 40px 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
`;

const LogoYellowImg = styled.img`
    width: 102px;    
    height: auto;
    display: block;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: 375px;
    width: 100%;
`;

const DescriptionText = styled.div`
    color: #FFFFFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    text-align: right;
    cursor: default;
`;

const Title = styled.div`
    color: #1F1F1F;
    font-size: 36px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    text-align: left;
    cursor: default;
    margin-top: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 40px;
    margin: 40px 0;
`;

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 20px;
`;

const DropTarget = styled.div`
    width: fit-content;
`;

const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 48px;
`;

const Question = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: #1F1F1F;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: left;
    cursor: default;
`;

const GrayText = styled.div`
    color: rgba(31, 31, 31, 0.50);
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    cursor: default;
`;

const LanguageContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
`;

const BackgroundContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 420px;
    padding: 24px 28px;
    background: #E5C40733;
    border-radius: 16px;
`;

const OrderTitle = styled.div`
`;

const ProficiencyGrid = styled.div`
    display: grid;
    grid-template-columns: 60px repeat(4, 1fr);
    column-gap: 12px;
    row-gap: 24px;
    align-items: center;
`;

const ButtonLabel = styled.div`
    color: #949494;
    text-align: center;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
    margin-bottom: -24px;
`;

const AbilityLabel = styled.div`
    color: #1F1F1F;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
    margin-right: 12px;
`;

const Text = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    color: #1F1F1F;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    cursor: default;
`;

const RequiredText = styled.div`
    color: #AE2929;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
`;

const StoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 24px;
    width: 100%;
    margin-top: 20px;
    margin-bottom: -20px;
`;

const CompleteButtonContainer = styled.div`
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

const CompleteButton = styled.button`
    width: 56px;
    height: 56px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #171717;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.2);
    transition: opacity 0.2s, transform 0.1s;

    &:hover:not(:disabled) {
        opacity: 0.95;
    }
    &:active:not(:disabled) {
        transform: translateY(1px);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ArrowIconImg = styled.img`
    width: 32px;
    height: 32px;
    display: block;
`;
