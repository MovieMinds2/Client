import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();

  const e_logout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (confirm("로그아웃 하시겠습니까?")) {
      console.log("로그아웃");

      try {
        const result = await axios.post("http://localhost:5000/users/logout", {
          withCredentials: true,
        });

        if (result.status == 200) {
          alert("로그아웃 되었습니다.");
          navigate("/");
        }
      } catch (error) {
        if (error instanceof Error) console.log(`error:${error.message}`);
      }
    }
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <Link to="/" style={logoLinkStyle}>
          <span style={logoTextStyle}>MovieMinds</span>
        </Link>
      </div>

      <nav style={navStyle}>
        <Link to="/login" style={navLinkStyle}>로그인</Link>
        <Link to="/create-account" style={navLinkStyle}>회원가입</Link>
        <button onClick={e_logout} style={navButtonStyle}>로그아웃</button>
      </nav>
    </header>
  );
};

export default Header;

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#283593',
  color: 'white',
};

const logoContainerStyle: React.CSSProperties = {};

const logoLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '1.8em',
  fontWeight: 'bold',
};

const logoTextStyle: React.CSSProperties = {};

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '1.1em',
  padding: '5px 10px',
  borderRadius: '5px',
  transition: 'background-color 0.3s ease',
};

const navButtonStyle: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'black',
  border: '1px solid black',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1.1em',
  transition: 'background-color 0.3s ease',
};