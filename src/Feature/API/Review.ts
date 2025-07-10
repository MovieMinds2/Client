import axios from "axios";
import type { NewReview } from "../../Page/Movie/MovieDetail";
import type { SortOrder } from "../../Page/Community/Community";

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

interface Props {
  reviewId: number;
  movieId: number;
}

export const api_deleteReview = async (deleteReview: Props) => {
  try {
    console.log(deleteReview);

    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_IP}/reviews/review`,
      {
        _method: "DELETE",
        ...deleteReview,
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

export const api_insertReview = async (newReview: NewReview) => {
  try {
    console.log(newReview);
    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_IP}/reviews`,
      {
        newReview: newReview,
      },
      {
        // 쿠키값 전송 여부
        withCredentials: true,
      }
    );

    if (result) {
      console.log(result.status);
      return result;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

export const api_getReview = async (
  movieId: number,
  userId: string | undefined
): Promise<IReviewsResult | undefined> => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_IP}/reviews/review`,
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
      `${import.meta.env.VITE_SERVER_IP}/reviews/likes`,
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
      `${import.meta.env.VITE_SERVER_IP}/reviews/likes`,
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

// 모든 리뷰
export const api_reviewsAll = async (
  sort: SortOrder,
  currentPage: number,
  limit: number,
  userId: string | undefined
) => {
  try {
    console.log(sort, currentPage, limit);

    const result = await axios.post(
      `${
        import.meta.env.VITE_SERVER_IP
      }/reviews?sort=${sort}&currentPage=${currentPage}&limit=${limit}`,
      {
        _method: "GET",
        userId: userId,
      },
      {
        // 쿠키값 전송 여부
        withCredentials: true,
      }
    );
    if (result) {
      return result.data;
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export const api_getMyReviews = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_IP}/mypage/myreview`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("내가 쓴 리뷰 조회 실패:", error);
    throw error;
  }
};

export const api_updateReview = async (reviewId: number, content: string) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_IP}/mypage/myreview`,
      { reviewId, updatedContent: content },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("리뷰 수정 실패:", error);
    throw error;
  }
};
