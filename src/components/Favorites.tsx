import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "./Header";

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export function Favorites() {
  const { user, logout } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (user?.email) {
        const docRef = doc(db, "favorite-movies", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const movieIds = docSnap.data().idmovies;
          const movies = await Promise.all(
            movieIds.map((id: number) =>
              axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                params: {
                  api_key: "72dee24b8ebdce73383391884778e2d7",
                },
              })
            )
          );
          setFavoriteMovies(movies.map((response) => response.data));
        }
      }
      setLoading(false);
    };

    fetchFavoriteMovies();
  }, [user]);

  return (
    <>
      <main>
        <Header user={user} handleLogout={handleLogout} />
        <section>
          <h1 className="text-4xl font-bold text-white text-center mb-5">
            Peliculas Favoritas
          </h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {favoriteMovies.map((movie) => (
                <article
                  className="relative bg-white rounded-lg shadow-md overflow-hidden text-black transform transition duration-500 hover:scale-105"
                  key={movie.id}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt="movie"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg">{movie.title}</h2>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
