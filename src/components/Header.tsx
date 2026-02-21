import styled from 'styled-components';
import LogoBlack from '../assets/images/logo-black.svg';
import Profile from '../assets/images/profile.svg';

const Header = () => {
    return (
        <HeaderWrapper>
            <LeftContainer>
                <Logo type="button" aria-label="">
                    <LogoImg src={LogoBlack} alt="" />
                </Logo>
                <MenuContainer>
                    <Menu>TALE</Menu>
                    <Menu>LIBRARY</Menu>
                    <Menu>QUIZ</Menu>
                    <Menu>ME</Menu>
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
    padding: 50px 72px;
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

const Menu = styled.button`
    font-family: Gudea;
    font-size: 20px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    padding: 0;
    border: none;
    background: transparent;
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
