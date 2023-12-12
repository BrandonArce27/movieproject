import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

type Movie = {
  id: string;
  title: string;
  poster_path: string;
};

export const Favorites: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const userId = user.email;
        const db = getFirestore();
        const userDoc = doc(db, "favorite-movies", userId);

        getDoc(userDoc).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const movieIds = docSnapshot.data().idmovies || [];

            Promise.all(
              movieIds.map((id: string) =>
                axios.get(
                  `https://api.themoviedb.org/3/movie/${id}?api_key=72dee24b8ebdce73383391884778e2d7`
                )
              )
            ).then((responses) => {
              const movies = responses.map((response) => response.data);
              setMovies(movies);
            });
          }
        });
      }
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <div key={movie.id}>
          <h2 className="text-white">{movie.title}</h2>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      ))}
    </div>
  );
};
