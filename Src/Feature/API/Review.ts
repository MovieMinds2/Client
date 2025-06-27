import axios from "axios";
import type { IReview } from "../../Page/Movie/MovieDetail";

export interface IReviews {
  id: number;
  userId: string;
  nickname: string;
  content: string;
  rankScore: number;
  likeCount: number;
  isLike: boolean;
  createdAt: Date;
}

export interface IReviewsResult {
  averRank: number;
  reviews: IReviews[];
}

export const api_insertReview = async (newReview: IReview) => {
  try {
    console.log(newReview);
    const result = await axios.post(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews`,
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
  movieId: number,
  userId: string
): Promise<IReviewsResult | undefined> => {
  try {
    const result = await axios.post(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews/review`,
      {
        movieId: movieId,
        userId: userId,
      },
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

export const api_insertlikes = async (
  reviewId: number,
  userId: string,
  movieId: number
) => {
  try {
    const result = await axios.post(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews/likes`,
      {
        movieId: movieId,
        reviewId: reviewId,
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

export const api_deleteLikes = async (
  reviewId: number,
  userId: string,
  movieId: number
) => {
  try {
    const result = await axios.post(
      `http://${import.meta.env.VITE_SERVER_IP}/reviews/likes`,
      {
        _method: "DELETE",
        movieId: movieId,
        reviewId: reviewId,
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
