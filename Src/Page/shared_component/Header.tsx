import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const e_logout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        await axios.post("http://localhost:5000/users/logout", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("백엔드 로그아웃 요청에 실패했습니다:", error);
      }

      await signOut(auth);
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <header style={headerStyle}>
      <div>
        <Link to="/" style={logoLinkStyle}>
          <span>MovieMinds</span>
        </Link>
      </div>

      <nav style={navStyle}>
        {isLoggedIn ? (
          <>
            <button onClick={e_logout} style={navButtonStyle}>
              로그아웃
            </button>

            {user?.photoURL ? (
              <img src={`${user?.photoURL}`} width={30} height={30} />
            ) : null}
            {user?.displayName ? <span> {user.displayName} </span> : null}
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
      </nav>
    </header>
  );
};

export default Header;

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#283593",
  color: "white",
};

const logoLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  fontSize: "1.8em",
  fontWeight: "bold",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  fontSize: "1.1em",
  padding: "5px 10px",
  borderRadius: "5px",
  transition: "background-color 0.3s ease",
};

const navButtonStyle: React.CSSProperties = {
  backgroundColor: "white",
  color: "black",
  border: "1px solid black",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1.1em",
  transition: "background-color 0.3s ease",
};
