import axios from "axios";
import type { IReview } from "../../Page/Movie/MovieDetail";

export interface IReviewResult {
  userId: string;
  nickname: string;
  content: string;
  rankScore: number;
  createdAt: Date;
}
export const api_insertReview = async (newReview: IReview): Promise<any> => {
  try {
    console.log(newReview);
    const result = await axios.post(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews"`,
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

export const api_getReview = async (
  movieId: number
): Promise<IReviewResult[] | undefined> => {
  console.log("리뷰 조회");

  try {
    const result = await axios.get(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews/${movieId}`,
      {
        // 쿠키값 전송 여부
        withCredentials: true,
      }
    );

    if (result) {
      console.log("결과:", result.data);
      return result.data;
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
