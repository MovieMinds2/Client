import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./MovieDetail.css";
import {
  api_insertReview,
  api_getReview,
  api_insertlikes,
  api_deleteLikes,
  type IReviews,
  api_deleteReview,
} from "../../Feature/API/Review";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-container">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <label
            key={starValue}
            className="star-label"
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(starValue)}
          >
            <span className={`star-icon ${isFilled ? "fill" : ""}`}></span>
          </label>
        );
      })}
    </div>
  );
};

interface MovieDetailData {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface NewReview {
  movieId: number;
  movieTitle: string;
  userId: string;
  nickname: string;
  rankScore: number;
  content: string;
}

const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReviews[]>([]);
  const [averRank, setAverRank] = useState<number>(0);

  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");

  // const fetchReviewData = useCallback(async () => {
  //   if (movieId && currentUser?.userId) {
  //     const results = await api_getReview(
  //       parseInt(movieId),
  //       currentUser.userId
  //     );
  //     if (results) {
  //       setReviews(results.reviews);
  //       setAverRank(parseFloat(results.averRank as any) || 0);
  //     }
  //   }
  // }, [movieId, currentUser]);

  const fetchReviewData = useCallback(async () => {
    const userId = currentUser?.userId;

    if (movieId) {
      const results = await api_getReview(parseInt(movieId), userId);
      if (results) {
        setReviews(results.reviews);
        setAverRank(parseFloat(results.averRank as any) || 0);
      }
    }
  }, [movieId, currentUser]);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: { api_key: API_KEY, language: "ko-KR" },
          }
        );
        setMovie(response.data);
      } catch (err) {
        setError("영화 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
    fetchReviewData();
  }, [movieId, fetchReviewData]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !movie) {
      alert("로그인 정보와 영화 정보를 확인해주세요.");
      return;
    }
    if (!content) {
      alert("리뷰 내용을 모두 입력해주세요.");
      return;
    }

    const newReview: NewReview = {
      movieId: movie.id,
      movieTitle: movie.title,
      userId: currentUser.userId,
      nickname: currentUser.displayName || "anonymous",
      rankScore: score,
      content: content,
    };

    try {
      const result = await api_insertReview(newReview);
      if (result && result.status === 200) {
        alert("리뷰가 등록되었습니다.");
        fetchReviewData();
        setContent("");
        setScore(5);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) return;

        if (error.response.status == 401)
          alert("인증 만료: 로그인 해주세요(로그아웃 후 로그인 페이지 이동)");
        else if ((error.response.status = 400)) {
          const message = error.response.data.message;
          if (message === "Bad_Content") alert("비속어는 사용할 수 없습니다.");
          else if (message === "Review_Duplication")
            alert("각 영화당 2개 이상의 리뷰를 작성할 수 없습니다.");
        }
      }

      console.error(error);
    }
  };

  const handleReviewDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (confirm("해당 리뷰를 삭제하겠습니까?")) {
      console.log("리뷰 삭제");
      const userId = currentUser?.userId;
      const id = e.currentTarget.dataset.id;
      const movieId = movie?.id;

      console.log(userId, id, movieId);

      if (!userId || !id || !movieId) return;

      const reviewId = parseInt(id);

      const deleteReivew = {
        userId,
        reviewId,
        movieId,
      };

      // api 호출
      api_deleteReview(deleteReivew).then(() => {
        setReviews((reviews) =>
          reviews.filter((review) => review.id !== reviewId)
        );
      });
    } else {
      alert("취소되었습니다.");
    }
  };

  const handleReviewLike = async (reviewId: number, isLike: boolean) => {
    if (!currentUser || !movie) return alert("로그인이 필요합니다.");

    const optimisticUpdate = (liked: boolean) => {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                isLike: liked,
                likeCount: liked ? review.likeCount + 1 : review.likeCount - 1,
              }
            : review
        )
      );
    };

    optimisticUpdate(!isLike);

    try {
      if (isLike) {
        await api_deleteLikes(reviewId, currentUser.userId, movie.id);
      } else {
        await api_insertlikes(reviewId, currentUser.userId, movie.id);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      optimisticUpdate(isLike);
      alert("오류가 발생했습니다.");
    }
  };

  if (loading)
    return <div className="loading-message">정보를 불러오는 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div>영화 정보가 없습니다.</div>;

  return (
    <div className="page-container">
      <div className="movie-detail-section">
        <img
          className="detail-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p>
            <strong>개봉일:</strong> {movie.release_date}
          </p>
          <p>
            <strong>TMDB 평점:</strong> ⭐️ {movie.vote_average.toFixed(1)}
          </p>
          <p>
            <strong>네티즌 평점:</strong> ⭐️{averRank.toFixed(2)}
          </p>
          <h2>줄거리</h2>
          <p className="overview">
            {movie.overview || "제공된 줄거리가 없습니다."}
          </p>
          <Link to="/" className="back-link">
            홈으로
          </Link>
        </div>
      </div>

      <div className="review-section">
        <h2>리뷰</h2>
        {currentUser ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-line">
              <strong className="form-label">작성자:</strong>
              <span>{currentUser.displayName || currentUser.userId}</span>
            </div>
            <div className="form-line">
              <strong className="form-label">내 평점:</strong>
              <StarRating rating={score} onRatingChange={setScore} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="리뷰를 남겨주세요..."
            ></textarea>
            <button type="submit">리뷰 등록</button>
          </form>
        ) : (
          <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
        )}

        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.nickname}</strong>
                  <span>{"⭐️".repeat(review.rankScore)}</span>
                </div>
                <p>{review.content}</p>
                <div className="review-actions">
                  {currentUser?.userId === review.userId && (
                    <button
                      data-id={review.id}
                      onClick={handleReviewDelete}
                      className="delete-button"
                    >
                      삭제
                    </button>
                  )}
                  <button
                    className={`like-button ${review.isLike ? "active" : ""}`}
                    onClick={() => handleReviewLike(review.id, review.isLike)}
                  >
                    👍 {review.likeCount}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨주세요!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
