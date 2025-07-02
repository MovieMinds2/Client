import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import './Community.css';

interface ReviewFeedItem {
  id: number;
  content: string;
  rankScore: number;
  createdAt: string;
  likeCount: number;
  isLike: number;
  userId: string;
  nickname: string;
  movieId: number;
  movieTitle: string;
  moviePosterPath: string;
}

type SortOrder = 'latest' | 'oldest' | 'likes_desc';

const Community: React.FC = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<ReviewFeedItem[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async (sort: SortOrder, pageNum: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}/reviews`, {
        params: { sort, currentPage: pageNum, limit: 15 },
        withCredentials: true,
      });
      
      const newReviews = response.data.reviews;
      const pagination = response.data.pagination;

      setReviews(prev => pageNum === 1 ? newReviews : [...prev, ...newReviews]);
      
      if (pagination) {
        setHasNextPage(pagination.currentPage < Math.ceil(pagination.totalCount / 15));
      } else {
        setHasNextPage(false);
      }

    } catch (err) {
      console.error('리뷰를 불러오는 데 실패했습니다.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setReviews([]);
    fetchReviews(sortOrder, 1);
  }, [sortOrder, fetchReviews]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(sortOrder, nextPage);
  };

  const handleSortChange = (newSortOrder: SortOrder) => {
    setPage(1);
    setReviews([]);
    setSortOrder(newSortOrder);
  };
  
  const handleLikeToggle = async (reviewId: number) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const targetReview = reviews.find(r => r.id === reviewId);
    if (!targetReview) return;

    const isLiked = !!targetReview.isLike;
    const newLikeCount = isLiked ? targetReview.likeCount - 1 : targetReview.likeCount + 1;

    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, isLike: isLiked ? 0 : 1, likeCount: newLikeCount } 
        : r
    ));

    try {
      const url = `http://${import.meta.env.VITE_SERVER_IP}/reviews/likes`;
      if (isLiked) {
        await axios.post(url, { _method: "DELETE", reviewId: reviewId, userId: currentUser.userId, movieId: targetReview.movieId }, { withCredentials: true });
      } else {
        await axios.post(url, { reviewId: reviewId, userId: currentUser.userId, movieId: targetReview.movieId }, { withCredentials: true });
      }
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      setReviews(reviews.map(r => r.id === reviewId ? targetReview : r));
    }
  };

  return (
    <div className="community-container">
      <h1>커뮤니티</h1>
      
      <div className="sort-tabs">
        <button onClick={() => handleSortChange('latest')} className={sortOrder === 'latest' ? 'active' : ''}>최신순</button>
        <button onClick={() => handleSortChange('oldest')} className={sortOrder === 'oldest' ? 'active' : ''}>오래된 순</button>
        <button onClick={() => handleSortChange('likes_desc')} className={sortOrder === 'likes_desc' ? 'active' : ''}>추천순</button>
      </div>

      <div className="review-feed">
        {reviews.map(review => (
          <div key={review.id} className="feed-item">
            <Link to={`/movie/${review.movieId}`} className="poster-link">
              <img src={`https://image.tmdb.org/t/p/w200${review.moviePosterPath}`} alt={review.movieTitle} />
            </Link>
            <div className="feed-content">
              <div className="feed-header">
                <Link to={`/movie/${review.movieId}`} className="movie-title">
                  <h3>{review.movieTitle}</h3>
                </Link>
                <button onClick={() => handleLikeToggle(review.id)} className={`like-button ${review.isLike ? 'active' : ''}`}>
                  👍 {review.likeCount}
                </button>
              </div>
              <p className="review-text">"{review.content}"</p>
              <div className="review-meta">
                <span>{'⭐️'.repeat(review.rankScore)}</span>
                <span className="author">by {review.nickname}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="status-message">불러오는 중...</p>}
      {hasNextPage && !loading && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-button">더보기</button>
        </div>
      )}
    </div>
  );
};

export default Community;