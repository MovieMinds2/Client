import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Search.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [results, setResults] = useState<Movie[]>([]); // 영화 결과 목록
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [totalResults, setTotalResults] = useState(0); // 전체 결과 개수
  const [hasMore, setHasMore] = useState(false); // 더 불러올 페이지가 있는지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async (currentPage: number) => {
    if (!query) return;

    setLoading(true);
    setError(null);
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          language: 'ko-KR',
          query: query,
          page: currentPage,
        },
      });

      // '더보기'일 경우, 기존 결과에 새 결과를 추가
      if (currentPage > 1) {
        setResults(prev => [...prev, ...response.data.results]);
      } else {
        // 첫 페이지일 경우, 결과 목록을 새로 설정
        setResults(response.data.results);
      }
      
      setTotalResults(response.data.total_results);
      // 현재 페이지 < 전체 페이지 일 때 '더보기' 버튼 표시
      setHasMore(response.data.page < response.data.total_pages);

    } catch (err) {
      setError('검색 결과를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 검색어가 바뀔 때마다 첫 페이지 로딩
  useEffect(() => {
    setPage(1); 
    fetchSearchResults(1);
  }, [fetchSearchResults]);

  // '더보기' 버튼 클릭 핸들러
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSearchResults(nextPage);
  };

  return (
    <div className="search-page-container">
      {query && (
        <h2>
          "{query}"에 대한 {totalResults}개의 검색 결과
        </h2>
      )}

      <div className="search-results-grid">
        {results.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="result-card">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.png'} 
              alt={movie.title} 
            />
            <div className="result-info">
              <h3>{movie.title}</h3>
            </div>
          </Link>
        ))}
      </div>
      
      {loading && <p className="status-message">불러오는 중...</p>}
      {error && <p className="status-message error">{error}</p>}
      
      {!loading && results.length === 0 && query && (
        <p className="status-message">검색 결과가 없습니다.</p>
      )}

      {!loading && hasMore && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-button">
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;