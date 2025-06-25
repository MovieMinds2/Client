import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await axios.post(
          "http://localhost:5000/users/logout",
          null,
          { withCredentials: true }
        );
        await signOut(auth);
        alert("로그아웃 되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("Failed to request logout:", error);
      }
    }
  };

  return (
    <header style={headerStyle}>
      {/* --- 1. Left Section: Logo + Search --- */}
      <div style={leftSectionStyle}>
        <Link to="/" style={logoLinkStyle}>
          <span>MovieMinds</span>
        </Link>
        <Link to="/search" style={navLinkStyle}>
          검색
        </Link>
      </div>

      {/* --- 2. Center Section: Home + Community --- */}
      <nav style={centerNavStyle}>
        <Link to="/" style={navLinkStyle}>
          홈
        </Link>
        <Link to="/community" style={navLinkStyle}>
          커뮤니티
        </Link>
      </nav>

      {/* --- 3. Right Section: User Menu --- */}
      <div style={rightSectionStyle}>
        {isLoggedIn ? (
          <>
            {/* Display an empty string if displayName is null or undefined to prevent errors */}
            <span>{user?.displayName || user?.email || '사용자'}님</span>
            <Link to="/mypage" style={navLinkStyle}>
              마이페이지
            </Link>
            <button onClick={handleLogout} style={navButtonStyle}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>
              로그인
            </Link>
            <Link to="/create-account" style={navLinkStyle}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#20232a',
  color: 'white',
  borderBottom: '1px solid #444'
};

const leftSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};
  
const logoLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#61dafb',
  fontSize: '1.8rem',
  fontWeight: 'bold',
};

const centerNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
};

const rightSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};
  
const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#e0e0e0',
  fontSize: '1.1rem',
  padding: '8px 12px',
  borderRadius: '5px',
  transition: 'background-color 0.2s ease, color 0.2s ease',
};
  
const navButtonStyle: React.CSSProperties = {
  backgroundColor: '#61dafb',
  color: '#20232a',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease',
};