import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./MovieDetail.css";
import {
  api_deleteLikes,
  api_getReview,
  api_insertlikes,
  api_insertReview,
  type IReviews,
} from "../../Feature/API/Review";

interface MovieDetailData {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface IReview {
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

  const [averRank, setAverRank] = useState<number>(0);
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReviews[]>([]);

  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");

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
  }, [movieId]);

  useEffect(() => {
    // useEffect에 직접적으로 async/ await를 사용할 수 없음
    const fetchReviewData = async () => {
      if (movie && currentUser) {
        // 영화 정보를 갖고 오면 리뷰 조회
        const results = await api_getReview(movie.id, currentUser?.userId);
        if (results) {
          setReviews(results.reviews);
          setAverRank(results.averRank);
        }
      }
    };

    fetchReviewData();
  }, [movie]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.");
      return;
    }
    if (!content) {
      alert("리뷰 내용을 모두 입력해주세요.");
      return;
    }
    if (!movie) return;

    const newReview: IReview = {
      movieId: movie.id,
      movieTitle: movie.title,
      userId: currentUser.userId,
      nickname: currentUser.displayName ? currentUser.displayName : "anonymous",
      rankScore: score,
      content: content,
    };

    //api 호출
    const result = await api_insertReview(newReview);

    if (result && result.status == 200) {
      alert("리뷰가 등록되었습니다.");
      const results = await api_getReview(movie.id, currentUser?.userId);
      if (results) {
        setAverRank(results.averRank);
        setReviews(results.reviews);
      }
    }
  };

  const handleReviewDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const userId = currentUser?.userId;
    const reviewId = e.currentTarget.dataset.id;

    if (!userId || !reviewId) return;

    // api 호출
  };

  // 좋아요 등록 및 해제
  const handleReviewLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isLike: boolean
  ) => {
    e.preventDefault();

    if (!currentUser) {
      alert("로그인을 먼저 해주세요");
      return;
    }

    //e.currentTarget: button 자체의 속성을 안전하게 가져올 때
    const reviewId = e.currentTarget.dataset.id;
    const userId = currentUser.userId;
    const movieId = movie?.id;

    if (!reviewId || !userId || !movieId) return;

    // 만약 좋아요가 되어 있으면 해지
    if (isLike) {
      console.log("좋아요 삭제");

      const result = await api_deleteLikes(parseInt(reviewId), userId, movieId);
      if (result?.status == 200) {
        const newReviews = reviews.map((review) =>
          review.id === parseInt(reviewId)
            ? {
                ...review,
                isLike: !isLike,
                likeCount: review.likeCount - 1,
              }
            : review
        );
        setReviews(newReviews);
      }
    }
    // 안되어 있으면 추가
    else {
      console.log("좋아요 추가");
      const result = await api_insertlikes(parseInt(reviewId), userId, movieId);
      if (result?.status == 200) {
        const newReviews = reviews.map((review) =>
          review.id === parseInt(reviewId)
            ? {
                ...review,
                isLike: !isLike,
                likeCount: review.likeCount + 1,
              }
            : review
        );
        setReviews(newReviews);
      }
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
            <strong>네티즌 평점:</strong> ⭐️{averRank}
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
            <div className="form-row">
              <strong>
                작성자: {currentUser.displayName || currentUser.userId}
              </strong>
            </div>
            <div className="form-row">
              <select
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              >
                <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
                <option value="4">⭐️⭐️⭐️⭐️</option>
                <option value="3">⭐️⭐️⭐️</option>
                <option value="2">⭐️⭐️</option>
                <option value="1">⭐️</option>
              </select>
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
                {currentUser?.userId === review.userId && (
                  <>
                    <button
                      data-id={review.id}
                      onClick={(e) => handleReviewDelete(e)}
                      className="delete-button"
                    >
                      <br />
                      삭제
                    </button>
                  </>
                )}

                {review.isLike ? (
                  <button
                    data-id={review.id}
                    onClick={(e) => handleReviewLike(e, review.isLike)}
                  >
                    좋아요(취소) {review.likeCount}
                  </button>
                ) : (
                  <button
                    data-id={review.id}
                    onClick={(e) => handleReviewLike(e, review.isLike)}
                  >
                    좋아요(추가) {review.likeCount}
                  </button>
                )}
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
