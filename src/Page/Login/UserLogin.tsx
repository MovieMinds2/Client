import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { auth } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { api_login } from "../../Feature/API/User";
import "./UserLogin.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const result = await api_login(userCredential.user.uid);
      if (result.status === 200) {
        navigate("/");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        alert("이메일 또는 비밀번호가 유효하지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // 구글 소셜 로그인
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const regex = /\(#([a-fA-F0-9]{12})\)/;
      if (user.displayName && !regex.test(user.displayName)) {
        const uuid = uuidv4().split("-").pop();
        await updateProfile(user, {
          displayName: `${user.displayName}(#${uuid})`,
        });
      }

      const response = await api_login(user.uid);
      if (response && response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("소셜 로그인 중 에러 발생:", error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleEmailLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <button onClick={handleGoogleLogin} className="google-login-button">
          Google 계정으로 로그인
        </button>

        <div className="extra-links">
          <Link to="/create-account">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
