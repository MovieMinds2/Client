import React, { useRef } from "react";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm, type SubmitHandler } from "react-hook-form";
import { REGEX } from "./regex";
import { TextField } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { api_login, checkNickName } from "../../Feature/API/User";
import { useNavigate, Link } from "react-router-dom";
import "./CreateAccount.css";

interface FormValue {
  nickname: string;
  email: string;
  password: string;
  password_confirm?: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>({ mode: 'onBlur' });

  const passwordRef = useRef<string | null>(null);
  passwordRef.current = watch("password");

  const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
    const isNicknameTaken = await checkNickName(data.nickname);
    if (isNicknameTaken) {
      alert("이미 사용 중인 닉네임입니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.nickname,
        photoURL: "https://i.pravatar.cc",
      });

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        nickname: data.nickname,
        email: user.email,
      });

      const result = await api_login(user.uid);
      if (result.status === 200) {
        alert("회원가입이 완료되었습니다.");
        navigate("/");
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("이미 가입된 이메일입니다.");
      } else {
        console.error("회원가입 중 에러 발생: ", error);
        alert("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-box">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="signup-form">
          <TextField
            fullWidth
            label="닉네임"
            variant="outlined"
            {...register("nickname", {
              required: "닉네임은 필수 항목입니다.",
              maxLength: { value: 20, message: "닉네임은 20자 이하여야 합니다." },
            })}
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          />

          <TextField
            fullWidth
            label="이메일"
            variant="outlined"
            {...register("email", {
              required: "이메일은 필수 항목입니다.",
              pattern: {
                value: REGEX.email,
                message: "이메일 형식에 맞춰 입력해주세요.",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="비밀번호"
            variant="outlined"
            type="password"
            {...register("password", {
              required: "비밀번호는 필수 항목입니다.",
              pattern: {
                value: REGEX.password,
                message: "(최소 6글자, 대/소문자, 숫자, 특수문자 각 1개 이상)",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            variant="outlined"
            type="password"
            {...register("password_confirm", {
              required: "비밀번호 확인은 필수 항목입니다.",
              validate: (value) =>
                value === passwordRef.current || "비밀번호가 일치하지 않습니다.",
            })}
            error={!!errors.password_confirm}
            helperText={errors.password_confirm?.message}
          />

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>
        <div className="extra-links">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;