import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCleanDisplayName = (user: typeof auth.currentUser): string => {
    if (!user) return '사용자';

    const displayName = user.displayName?.split('(')[0].trim();
    return displayName || user.email || '사용자';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await axios.post(
          `http://${import.meta.env.VITE_SERVER_IP}/users/logout`,
          null,
          {
            withCredentials: true,
          }
        );
        await signOut(auth);
        alert("로그아웃 되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("Failed to request logout:", error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <header style={headerStyle}>
      <div style={leftSectionStyle}>
        <Link to="/" style={logoLinkStyle}>
          <span>MovieMinds</span>
        </Link>
        <Link to="/search" style={navLinkStyle}>
          검색
        </Link>
      </div>

      <nav style={centerNavStyle}>
        <Link to="/" style={navLinkStyle}>
          홈
        </Link>
        <Link to="/community" style={navLinkStyle}>
          커뮤니티
        </Link>
      </nav>

      <div style={rightSectionStyle}>
        {user ? (
          <div style={profileMenuStyle} ref={dropdownRef}>
            <button onClick={toggleDropdown} style={profileButtonStyle}>
              {user.photoURL && (
                <img src={user.photoURL} alt="profile" style={profileImgStyle} />
              )}
              <span>{getCleanDisplayName(user)}님</span>
            </button>

            <div style={{ ...dropdownMenuStyle, ...(isDropdownOpen ? dropdownMenuOpenStyle : {}) }}>
              <Link to="/mypage" style={dropdownLinkStyle} onClick={() => setIsDropdownOpen(false)}>마이페이지</Link>
              <button onClick={handleLogout} style={dropdownButtonStyle}>로그아웃</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>로그인</Link>
            <Link to="/create-account" style={navLinkStyle}>회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  backgroundColor: "#20232a",
  color: "white",
  borderBottom: "1px solid #444",
};

const leftSectionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const logoLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#61dafb",
  fontSize: "1.8rem",
  fontWeight: "bold",
};

const centerNavStyle: React.CSSProperties = {
  display: "flex",
  gap: "30px",
};

const rightSectionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#e0e0e0",
  fontSize: "1.1rem",
  padding: "8px 12px",
  borderRadius: "5px",
  transition: "background-color 0.2s ease, color 0.2s ease",
};

const profileMenuStyle: React.CSSProperties = {
  position: 'relative',
};

const profileButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '5px',
  borderRadius: '5px',
  fontSize: '1rem',
};

const profileImgStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%', // 프로필 이미지 원형
};

const dropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '120%',
  left: '50%',
  backgroundColor: '#333',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  width: '150px',
  zIndex: 100,
  // 애니메이션 효과
  transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
  opacity: 0,
  transform: 'translate(-50%, -10px)',
  visibility: 'hidden',
};

const dropdownMenuOpenStyle: React.CSSProperties = {
  opacity: 1,
  transform: 'translate(-50%, 0)',
  visibility: 'visible',
};

const dropdownLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'white',
  padding: '12px 20px',
  transition: 'background-color 0.2s',
  textAlign: 'left',
  width: '100%',
  boxSizing: 'border-box',
};

const dropdownButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  borderTop: '1px solid #555',
  color: 'white',
  padding: '12px 20px',
  cursor: 'pointer',
  fontSize: '1rem',
  textAlign: 'left',
  width: '100%',
};