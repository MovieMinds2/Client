import axios from "axios";
import React, { useEffect, useState } from "react";
import auth from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

// 타입 명시
import type { User, OAuthCredential } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const provider = new GoogleAuthProvider();

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
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const userId = await api_login(userCredential.user.uid);
        console.log(userId);
      })
      .catch((error) => {
        console.log(error.code, ":", error.message);
      });
  };

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

  const api_login = async (userId: string): Promise<any | undefined> => {
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
    } catch (error: any | undefined) {
      throw new Error(error.message);
    }
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
      <button onClick={e_socialLogin}>소셜 로그인</button>
    </>
  );
};

export default Login;
