import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./Community.css";
import { api_reviewsAll } from "../../Feature/API/Review";
import { LIMIT } from "../../Constants/review";

// 데이터 타입 정의
interface ReviewFeedItem {
  id: number;
  movieId: number;
  movieTitle: string;
  userId: string;
  rankScore: number;
  createdAt: string;
  content: string;
  likeCount: number;
  isLike: boolean;
  nickname: string;
}

export type SortOrder = "latest" | "oldest" | "likes_desc";

const Community: React.FC = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<ReviewFeedItem[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // 데이터 호출 함수
  const fetchReviews = useCallback(async (sort: SortOrder, pageNum: number) => {
    setLoading(true);

    const userId = currentUser?.userId;

    if (!userId) return;

    try {
      const response = await api_reviewsAll(sort, pageNum, LIMIT, userId);
      if (response) {
        console.log("response:", response.reviews);
        const newReviews: ReviewFeedItem[] = response.reviews;

        setReviews(newReviews);

        // setReviews((prev) =>
        //   pageNum === 1 ? newReviews : [...prev, ...newReviews]
        // );
        // setHasNextPage(response.data.hasNextPage);
      }
    } catch (err) {
      console.error("리뷰를 불러오는 데 실패했습니다.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 정렬 순서가 바뀔 때마다 데이터 다시 불러오기
  useEffect(() => {
    // 페이지를 1로, 기존 리뷰 목록을 비우고 새로 호출
    setPage(1);
    setReviews([]);
    fetchReviews(sortOrder, 1);
  }, [sortOrder, fetchReviews]);

  // '더보기' 버튼 핸들러
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(sortOrder, nextPage);
  };

  // 공감(추천) 기능 (낙관적 UI 업데이트)
  const handleLikeToggle = async (reviewId: number) => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const targetReview = reviews.find((r) => r.id === reviewId);
    if (!targetReview) return;

    const isLiked = targetReview.isLike;
    const newLikeCount = isLiked
      ? targetReview.likeCount - 1
      : targetReview.likeCount + 1;

    // 화면 즉시 변경
    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? { ...r, isLikedByCurrentUser: !isLiked, likeCount: newLikeCount }
          : r
      )
    );

    // 백그라운드에서 API 호출
    try {
      const url = `http://${
        import.meta.env.VITE_SERVER_IP
      }/reviews/${reviewId}/like`;
      if (isLiked) {
        await axios.delete(url, { withCredentials: true });
      } else {
        await axios.post(url, {}, { withCredentials: true });
      }
    } catch (error) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      // 실패 시, 화면을 원래 상태로 되돌림
      setReviews(reviews.map((r) => (r.id === reviewId ? targetReview : r)));
    }
  };

  return (
    <div className="community-container">
      <h1>커뮤니티</h1>

      <div className="sort-tabs">
        <button
          onClick={() => setSortOrder("latest")}
          className={sortOrder === "latest" ? "active" : ""}
        >
          최신순
        </button>
        <button
          onClick={() => setSortOrder("oldest")}
          className={sortOrder === "oldest" ? "active" : ""}
        >
          오래된 순
        </button>
        <button
          onClick={() => setSortOrder("likes_desc")}
          className={sortOrder === "likes_desc" ? "active" : ""}
        >
          추천순
        </button>
      </div>

      <div className="review-feed">
        {reviews.map((review) => (
          <div key={review.id} className="feed-item">
            <Link to={`/movie/${review.movieId}`} className="poster-link">
              {/* <img
                src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`}
                alt={review.movieTitle}
              /> */}
            </Link>
            <div className="feed-content">
              <div className="feed-header">
                <Link to={`/movie/${review.movieId}`} className="movie-title">
                  <h3>{review.movieTitle}</h3>
                </Link>
                <button
                  onClick={() => handleLikeToggle(review.id)}
                  className={`like-button ${review.isLike ? "active" : ""}`}
                >
                  👍 {review.likeCount}
                </button>
              </div>
              <p className="review-text">"{review.content}"</p>
              <div className="review-meta">
                <span>{"⭐️".repeat(review.rankScore)}</span>
                <span className="author">by {review.nickname}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="status-message">불러오는 중...</p>}
      {hasNextPage && !loading && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-button">
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
