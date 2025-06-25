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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async (currentQuery: string, currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          language: 'ko-KR',
          query: currentQuery,
          page: currentPage,
        },
      });

      if (currentPage > 1) {
        setResults(prev => [...prev, ...response.data.results]);
      } else {
        setResults(response.data.results);
      }
      
      setTotalResults(response.data.total_results);
      setHasMore(response.data.page < response.data.total_pages);

    } catch (err) {
      setError('검색 결과를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // URL의 검색어가 바뀔 때, 검색창의 입력값도 동기화
    setInputValue(query || '');
  }, [query]);

  useEffect(() => {
    // URL에 검색어가 있을 때만 API 호출 실행
    if (query) {
      setPage(1);
      setResults([]);
      fetchSearchResults(query, 1);
    } else {
      // URL에 검색어가 없으면(예: /search 페이지 첫 방문) 결과 초기화
      setResults([]);
      setTotalResults(0);
    }
  }, [query, fetchSearchResults]);

  const handleLoadMore = () => {
    if (query) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(query, nextPage);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // URL의 query 파라미터를 현재 입력된 값으로 변경
      setSearchParams({ query: inputValue });
    }
  };

  return (
    <div className="search-page-container">
      <form onSubmit={handleSearchSubmit} className="search-form-on-page">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="찾고 싶은 영화를 검색하세요."
        />
        <button type="submit">검색</button>
      </form>

      {query && !loading && (
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
      
      {loading && <p className="status-message">결과를 불러오는 중...</p>}
      {error && <p className="status-message error">{error}</p>}
      
      {!loading && results.length === 0 && query && (
        <p className="status-message">"{query}"에 대한 검색 결과가 없습니다.</p>
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