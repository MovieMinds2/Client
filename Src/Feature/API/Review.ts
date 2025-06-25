import axios from "axios";
import type { IReview } from "../../Page/Movie/MovieDetail";

export const api_insertReview = async (newReview: IReview): Promise<any> => {
  try {
    console.log(newReview);
    const result = await axios.post(
      "http://localhost:5000/reviews",
      {
        newReview: newReview,
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

export const api_getReview = async (): Promise<any> => {
  try {
    const result = await axios.get("http://localhost:5000/reviews", {
      // 쿠키값 전송 여부
      withCredentials: true,
    });

    if (result) {
      console.log(result);
      return result;
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
