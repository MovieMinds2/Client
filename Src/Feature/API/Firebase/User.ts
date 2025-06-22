import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";

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
