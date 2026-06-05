import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoBlack from '../assets/images/logo-black.svg';
import Profile from '../assets/images/profile.svg';
import { clearAuth, getAccessToken } from '../lib/auth';

type HeaderMenuKey = 'tale' | 'library' | 'voca' | 'quiz' | 'my';

interface HeaderProps {
    activeMenu?: HeaderMenuKey;
}

const Header = ({ activeMenu }: HeaderProps) => {
    const navigate = useNavigate();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const isLoggedIn = Boolean(getAccessToken());

    useEffect(() => {
        if (!profileMenuOpen) return;
        const close = (e: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [profileMenuOpen]);

    const handleProfileAuth = () => {
        setProfileMenuOpen(false);
        if (isLoggedIn) {
            clearAuth();
            navigate('/login', { replace: true });
            return;
        }
        navigate('/login');
    };

    return (
        <HeaderWrapper>
            <LeftContainer>
                <Logo type="button" aria-label="" onClick={() => navigate("/home")}>
                    <LogoImg src={LogoBlack} alt="" />
                </Logo>
                <MenuContainer>
                    <Menu type="button" $active={activeMenu === 'tale'} onClick={() => navigate("/tale/intro")}>TALE</Menu>
                    <Menu type="button" $active={activeMenu === 'library'} onClick={() => navigate("/lib")}>LIBRARY</Menu>
                    <Menu type="button" $active={activeMenu === 'voca'} $clickable={false}>VOCA</Menu>
                    <Menu type="button" $active={activeMenu === 'quiz'} onClick={() => navigate("/quiz")}>QUIZ</Menu>
                    <Menu type="button" $active={activeMenu === 'my'} onClick={() => navigate("/mypage")}>MY</Menu>
                </MenuContainer>
            </LeftContainer>
            <ProfileDropdown ref={profileMenuRef}>
                <ProfileButton
                    type="button"
                    aria-label="계정 메뉴"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                >
                    <ProfileIcon src={Profile} alt="" />
                </ProfileButton>
                {profileMenuOpen ? (
                    <ProfileMenu>
                        <ProfileMenuItem type="button" onClick={handleProfileAuth}>
                            {isLoggedIn ? '로그아웃' : '로그인'}
                        </ProfileMenuItem>
                    </ProfileMenu>
                ) : null}
            </ProfileDropdown>
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
    gap: 40px;
`;

const Menu = styled.button<{ $active?: boolean; $clickable?: boolean }>`
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
    cursor: ${({ $clickable = true }) => ($clickable ? 'pointer' : 'default')};
`;

const ProfileDropdown = styled.div`
    position: relative;
    flex-shrink: 0;
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

const ProfileMenu = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 10;
    min-width: 80px;
    border-radius: 4px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.20);
    overflow: hidden;
`;

const ProfileMenuItem = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 8px;
    border: none;
    background: #171717;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s ease;

    &:hover {
        filter: brightness(0.8);
    }
`;
