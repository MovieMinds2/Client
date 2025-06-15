import axios from "axios";
import React, { useEffect, useState } from "react";
import auth from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

// 타입 명시
import type { User } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

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

  // 로그인
  const e_login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        const result = await api_login(userCredential.user.uid);
        if (result.status == 200) {
          console.log("sucess");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.code, ":", error.message);
      }
    }
  };

  // 소셜 로그인
  const e_socialLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential: OAuthCredential | null =
        //   GoogleAuthProvider.credentialFromResult(result);
        // if (credential) {
        //   const token = credential.accessToken;
        //   console.log(token);
        // }

        // The signed-in user info.
        const user = result.user;
        console.log(user.uid);
        const response = await api_login(user.uid);

        console.log(response);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(`${errorCode}: ${errorMessage}, ${email},${credential}`);
        // ...
      });
  };

  const api_login = async (userId: string): Promise<any> => {
    try {
      const result = await axios.post(
        "http://localhost:5000/users/login",
        {
          userId: userId,
        },
        {
          // 쿠키값 전송 여부
          withCredentials: true,
        }
      );

      if (result) {
        return result;
      }
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <>
      <div>Login Page</div>

      <form onSubmit={e_login}>
        <span>Email</span>{" "}
        <input type="text" onChange={saveEmail} value={email} />
        <br />
        <span>Password</span>
        <input type="password" onChange={savePassword} value={password} />
        <input type="submit" value={"로그인"} />
        <br />
      </form>

      <button onClick={e_socialLogin}>소셜 로그인</button>
    </>
  );
};

export default Login;
