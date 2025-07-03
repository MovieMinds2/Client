import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import axios from "axios";

export const checkNickName = async (nickname: string): Promise<boolean> => {
  const querySnapshot = await getDocs(collection(db, "users"));

  let isCheck = false;

  querySnapshot.forEach((doc) => {
    const check = doc.data().nickname.replace(/ /g, "");

    if (check === nickname.replace(/ /g, "")) {
      isCheck = !isCheck;
      return;
    }
  });

  return isCheck;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api_login = async (userId: string): Promise<any> => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_IP}/users/login`,
      {
        userId: userId,
      },
      {
        // 쿠키값 전송 여부
        withCredentials: true,
      }
    );

    if (result) {
      console.log(result);
      return result;
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
