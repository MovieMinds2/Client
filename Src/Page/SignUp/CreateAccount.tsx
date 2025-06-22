// import axios from "axios";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { REGEX } from "./regex";
import { useRef } from "react";
import { FormHelperText, TextField } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { checkNickName } from "../../Feature/API/Firebase/User";

interface FormValue {
  nickname: string;
  email: string;
  password: string;
  password_confirm?: string;
}

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>();

  // 비밀번호와 비밀번호 확인이 일치하는지 검증하기 위해 "password" input 의 value 를 추적함
  const passwordRef = useRef<string | null>(null);
  passwordRef.current = watch("password");

  const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
    // 닉네임 중복 체크
    const result = await checkNickName(data.nickname);
    if (result) {
      console.log("result:", result);
      alert("닉네임 중복");
      return;
    }

    signUp(data);
  };

  const signUp = async ({ email, nickname, password }: FormValue) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;

        updateProfile(user, {
          displayName: nickname,
          // fake 프로필로 대체
          photoURL: "https://i.pravatar.cc",
        }).then(async () => {
          console.log(user.displayName);
          try {
            const docRef = await addDoc(collection(db, "users"), {
              nickname: user.displayName,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ":", errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          alert("현재 가입된 이메일입니다.");
        }
        // ..
      });
  };

  return (
    <>
      <div>CreateAccount Page</div>

      <div>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <TextField
            label="닉네임"
            variant="outlined"
            {...register("nickname", { required: true, maxLength: 20 })}
          />

          {errors.nickname && errors.nickname.type === "required" && (
            <FormHelperText error>{`닉네임을 입력해주세요`}</FormHelperText>
          )}
          <br />

          <TextField
            label="이메일"
            variant="outlined"
            {...register("email", { required: true, pattern: REGEX.email })}
          />

          {errors.email &&
            (errors.email.type === "required" ||
              errors.email.type === "pattern") && (
              <FormHelperText
                error
              >{`이메일 형식에 맞춰 입력해 주세요`}</FormHelperText>
            )}

          <br />

          <TextField
            label="비밀번호"
            variant="outlined"
            {...register("password", {
              required: true,
              pattern: REGEX.password,
            })}
            type="password"
          />

          {errors.password &&
            (errors.password.type === "required" ||
              errors.password.type === "pattern") && (
              <FormHelperText error>
                {`(최소 6글자,대/소문자 및 숫자 최소 1개,특수문자 최소 1개)`}
              </FormHelperText>
            )}

          <br />

          <TextField
            label="비밀번호 확인"
            variant="outlined"
            type="password"
            {...register("password_confirm", {
              required: true,
              validate: (value) => value === passwordRef.current,
            })}
          />

          {errors.password_confirm &&
            errors.password_confirm.type === "validate" && (
              <FormHelperText>비밀번호가 같지 않습니다.</FormHelperText>
            )}
          <br />

          <button type="submit">회원가입</button>
        </form>
      </div>
    </>
  );
};

export default CreateAccount;
