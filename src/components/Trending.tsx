import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Header from "./Header";
import OverviewPopup from "./OverviewPopup";

interface TrendingMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

export const Trending = () => {
  const { logout, user } = useAuth();
  const apiKey = "72dee24b8ebdce73383391884778e2d7";
  const api_url = "https://api.themoviedb.org/3";
  const image_url = "https://image.tmdb.org/t/p/original";
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedOverview, setSelectedOverview] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const {
        data: { results },
      } = await axios.get(`${api_url}/trending/all/week`, {
        params: {
          api_key: apiKey,
        },
      });
      setTrendingMovies(results);
      setLoading(false);
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} />
      <main>
        <section>
          <h1 className="text-4xl font-bold text-white text-center mb-5">
            Trending Movies
          </h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
              {trendingMovies.map((movie) => (
                <article
                  className="relative bg-white rounded-lg shadow-md overflow-hidden text-black transform transition duration-500 hover:scale-105"
                  key={movie.id}
                  onMouseEnter={() => setSelectedOverview(movie.overview)}
                >
                  <img
                    src={`${image_url}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg">{movie.title}</h2>
                  </div>
                  <button
                    className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setShowOverview(true)}
                  >
                    Ver overview
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      {showOverview && (
        <OverviewPopup
          overview={selectedOverview}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
};
