import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./MovieDetail.css";
import { api_insertReview, api_reviewInsert } from "../../Feature/API/Review";

interface MovieDetailData {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface Review {
  id: number;
  authorId: string;
  authorName: string;
  score: number;
  content: string;
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

  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);

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

  useEffect(() => {}, []);

  useEffect(() => {
    if (!movieId) return;
    const savedReviews = localStorage.getItem(`reviews_${movieId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([]);
    }
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(reviews));
  }, [reviews, movieId]);

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

    // const newReview: Review = {
    //   id: Date.now(),
    //   authorId: currentUser.userId,
    //   authorName: currentUser.displayName || currentUser.userId,
    //   score,
    //   content,
    // };

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

    if (result.status == 200) {
      alert("리뷰가 등록되었습니다.");
    }

    // setReviews([newReview, ...reviews]);

    // setScore(5);
    // setContent("");
  };

  const handleReviewDelete = (reviewToDelete: Review) => {
    if (currentUser?.userId !== reviewToDelete.authorId) {
      alert("본인이 작성한 리뷰만 삭제할 수 있습니다.");
      return;
    }

    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      setReviews(reviews.filter((r) => r.id !== reviewToDelete.id));
      alert("리뷰가 삭제되었습니다.");
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
                  <strong>{review.authorName}</strong>
                  <span>{"⭐️".repeat(review.score)}</span>
                </div>
                <p>{review.content}</p>
                {currentUser?.userId === review.authorId && (
                  <button
                    onClick={() => handleReviewDelete(review)}
                    className="delete-button"
                  >
                    삭제
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
