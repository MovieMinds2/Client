import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

const bannerImages = [
  "https://image.tmdb.org/t/p/original/srYya1ZlI97Au4jUYAktDe3avyA.jpg",
  "https://image.tmdb.org/t/p/original/2KGxwL6f1l_tJgssM4C15a4pGdn.jpg",
  "https://image.tmdb.org/t/p/original/jsoz1HjbA4PKmWogM9jrzSgqY0h.jpg",
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = "https://api.themoviedb.org/3/movie/now_playing";

  const bannerSliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const moviesliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL, {
          params: {
            api_key: API_KEY,
            language: "ko-KR",
            page: 1,
          },
        });
        setMovies(response.data.results);
      } catch (err) {
        setError("영화 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [API_KEY]);

  if (loading)
    return <div className="loading-message">영화를 불러오는 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <section className="banner-section">
        <Slider {...bannerSliderSettings}>
          {bannerImages.map((imgUrl, index) => (
            <div key={index}>
              <div
                className="banner-slide"
                style={{ backgroundImage: `url(${imgUrl})` }}
              />
            </div>
          ))}
        </Slider>
      </section>

      <main className="movies-section">
        <h2>상영중인 인기 영화</h2>
        <Slider {...moviesliderSettings}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card-slide">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </main>
    </div>
  );
};

export default Home;
