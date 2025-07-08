import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  api_getMyReviews,
  api_deleteReview,
  api_updateReview,
} from "../../Feature/API/Review";
import "./MyPage.css";

interface IMyReview {
  id: number;
  movieTitle: string;
  movieId: number;
  content: string;
  createdAt: string;
}

const MyPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<IMyReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const fetchMyReviews = useCallback(async () => {
    try {
      setLoading(true);
      const myReviewsData = await api_getMyReviews();
      setReviews(myReviewsData);
    } catch (error) {
      console.error("리뷰를 불러오지 못했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  const handleDelete = async (review: IMyReview) => {
    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      try {
        const deleteReview = {
          reviewId: review.id,
          movieId: review.movieId,
        };
        await api_deleteReview(deleteReview);
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
        alert("리뷰가 삭제되었습니다.");
      } catch (error) {
        alert(`리뷰 삭제에 실패했습니다. (${error})`);
      }
    }
  };

  const handleEdit = (review: IMyReview) => {
    setEditingReviewId(review.id);
    setEditedContent(review.content);
  };

  const handleUpdate = async () => {
    if (editingReviewId === null) return;
    try {
      await api_updateReview(editingReviewId, editedContent);
      alert("리뷰가 수정되었습니다.");
      setEditingReviewId(null);
      fetchMyReviews();
    } catch (error) {
      alert("리뷰 수정에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="profile-section">
        <p>
          <strong>아이디:</strong> {currentUser?.userId}
        </p>
        <p>
          <strong>닉네임:</strong> {currentUser?.displayName || "Anonymous"}
        </p>
      </div>

      <div className="my-reviews-section">
        <h2>내가 쓴 리뷰 ({reviews.length}개)</h2>
        <div className="my-reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="my-review-item">
                <div className="my-review-details">
                  <Link to={`/movie/${review.movieId}`}>
                    <h3>{review.movieTitle}</h3>
                  </Link>
                  {editingReviewId === review.id ? (
                    <textarea
                      value={editedContent ?? ""}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="edit-textarea"
                    />
                  ) : (
                    <p className="my-review-content">"{review.content}"</p>
                  )}
                  <p className="my-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="my-review-actions">
                  {editingReviewId === review.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="action-btn save-btn"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="action-btn cancel-btn"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(review)}
                        className="action-btn"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="action-btn delete-btn"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>작성한 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
