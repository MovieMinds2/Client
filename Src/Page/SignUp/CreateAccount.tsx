import axios from "axios";
import React, { useState } from "react";

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
    // API 호출 함수
    await axios
      .post("http://localhost:5000/users/sign-up", {
        nickname: nickName,
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
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
