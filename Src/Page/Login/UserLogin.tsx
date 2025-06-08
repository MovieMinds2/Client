import axios from "axios";
import React, { useEffect, useState } from "react";
import auth from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// 타입 명시
import type { User } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      console.log(user.uid);
    }
  }, [user]);

  const saveEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const savePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const e_login = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userId = userCredential.user.uid;

        axios
          .post(
            "http://localhost:5000/users/login",
            {
              userId: userId,
            },
            {
              // 쿠키값 전송 여부
              withCredentials: true,
            }
          )
          .then((result) => {
            console.log(result.status);
          });
      })
      .catch((error) => {
        console.log(error.code, ":", error.message);
      });
  };

  return (
    <>
      <div>Login Page</div>

      <span>Email</span>
      <input type="text" onChange={saveEmail} value={email}></input>
      <br />
      <span>Password</span>
      <input type="password" onChange={savePassword} value={password}></input>
      <br />
      <button onClick={e_login}>로그인</button>
    </>
  );
};

export default Login;
