// import axios from "axios";
import React, { useState } from "react";
import auth from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const CreateAccount = () => {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveNickName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(event.target.value);
  };

  const saveEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const savePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const e_signUp = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // firebase 회원가입
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;

        updateProfile(user, {
          displayName: nickName,
          // fake 프로필로 대체
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        }).then(() => {
          console.log(user);
          setNickName("");
          setEmail("");
          setPassword("");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ":", errorMessage);
        // ..
      });
  };

  return (
    <>
      <div>CreateAccount Page</div>

      <span>Nickname</span>
      <input type="text" onChange={saveNickName} value={nickName}></input>
      <br />
      <span>Email</span>
      <input type="text" onChange={saveEmail} value={email}></input>
      <br />
      <span>Password</span>
      <input type="password" onChange={savePassword} value={password}></input>
      <br />
      <button onClick={e_signUp}>회원 가입</button>
    </>
  );
};

export default CreateAccount;
