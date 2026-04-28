import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoBlack from '../assets/images/logo-black.svg';
import Profile from '../assets/images/profile.svg';

type HeaderMenuKey = 'tale' | 'library' | 'voca' | 'quiz' | 'my';

interface HeaderProps {
    activeMenu?: HeaderMenuKey;
}

const Header = ({ activeMenu }: HeaderProps) => {
    const navigate = useNavigate();

    return (
        <HeaderWrapper>
            <LeftContainer>
                <Logo type="button" aria-label="" onClick={() => navigate("/home")}>
                    <LogoImg src={LogoBlack} alt="" />
                </Logo>
                <MenuContainer>
                    <Menu type="button" $active={activeMenu === 'tale'} onClick={() => navigate("/tale/intro")}>TALE</Menu>
                    <Menu type="button" $active={activeMenu === 'library'} onClick={() => navigate("/lib")}>LIBRARY</Menu>
                    <Menu type="button" $active={activeMenu === 'voca'} onClick={() => navigate("/lib/voca")}>VOCA</Menu>
                    <Menu type="button" $active={activeMenu === 'quiz'} onClick={() => navigate("/quiz")}>QUIZ</Menu>
                    <Menu type="button" $active={activeMenu === 'my'} onClick={() => navigate("/mypage")}>MY</Menu>
                </MenuContainer>
            </LeftContainer>
            <ProfileButton type="button" aria-label="">
                <ProfileIcon src={Profile} alt="" />
            </ProfileButton>
        </HeaderWrapper>
    );
};

export default Header;

const HeaderWrapper = styled.header`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 50px 72px 35px 72px;
    background: transparent;
    box-sizing: border-box;
    gap: 40px;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 66px;
`;

const Logo = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
`;

const LogoImg = styled.img`
    height: 56px;
    width: auto;
    display: block;
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 54px;
`;

const Menu = styled.button<{ $active?: boolean }>`
    font-family: Gudea;
    font-size: 20px;
    font-style: normal;
    font-weight: 900;
    line-height: 24px;
    padding: 5px 12px 3px;
    border: none;
    border-radius: 3px;
    background: ${({ $active }) => ($active ? '#1F1F1F' : 'transparent')};
    color: ${({ $active }) => ($active ? '#FFDE21' : '#1F1F1F')};
    cursor: pointer;
`;

const ProfileButton = styled.button`
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
`;

const ProfileIcon = styled.img`
    width: 38px;
    height: 38px;
    display: block;
`;
