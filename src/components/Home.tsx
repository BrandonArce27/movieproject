import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Rating from "./Rating";
import Header from "./Header";

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export interface Movie {
  id: string;
  title: string;
}

export interface Review {
  id: string;
  movieId: string;
  userEmail: string;
  content: string;
}

export function Home() {
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();
  // console.log("user");
  // console.log(user); //revisar bien esto al final

  const apiKey = "72dee24b8ebdce73383391884778e2d7";
  const api_url = "https://api.themoviedb.org/3";
  const image_url = "https://image.tmdb.org/t/p/original";

  //Variables de estado
  const [movies, setMovies] = React.useState<Movies[]>([]);
  const [search, setSearch] = React.useState("");
  // const [movie, setMovie] = React.useState<Movies[]>([]); //sirve para cuanbdo se busca una pelicula, lo voy a utilizar para agregar a favoritos posiblemente
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [favoriteMovies, setFavoriteMovies] = React.useState<number[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchData = async (search: any) => {
    const type = search ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${api_url}/${type}/movie`, {
      params: {
        api_key: apiKey,
        query: search,
      },
    });
    setMovies(results);
  };

  //funcion para buscar peliculas
  const searchMovies = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(search);
  };

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      const docRef = doc(db, "favorite-movies", user?.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFavoriteMovies(docSnap.data().idmovies);
      }
    };

    fetchFavoriteMovies();
  }, [user]);

  //funcion para agregar peliculas a favoritos
  const addMovieToFavorites = async (movieId: number) => {
    try {
      const docRef = doc(db, "favorite-movies", user?.email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, { idmovies: [movieId] });
      } else {
        await updateDoc(docRef, {
          idmovies: arrayUnion(movieId),
        });
      }

      setFavoriteMovies((prevMovies) => [...prevMovies, movieId]);
    } catch (error) {
      console.error("Error adding movie to favorites: ", error);
    }
  };

  useEffect(() => {
    fetchData(null);
  }, []);

  const handleOpenModal = (items: any) => {
    console.log("handleOpenModal called with:", items);
    setSelectedMovie(items);
    console.log("selectedMovie after setSelectedMovie:", selectedMovie);
    setIsModalOpen(true);
    console.log("isModalOpen after setIsModalOpen:", isModalOpen);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedMovie) {
      const q = query(
        collection(db, "reviews"),
        where("movieId", "==", selectedMovie.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newReviews = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Review)
        );

        setReviews(newReviews);
      });

      // Limpiar la suscripción al desmontar
      return () => unsubscribe();
    }
  }, [selectedMovie]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <main className="w-full">
        <Header user={user} handleLogout={handleLogout} />
        <section>
          <form
            onSubmit={searchMovies}
            className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 max-w-md mx-auto transform transition duration-500 hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Buscar Película
            </h2>
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Buscar pelicula"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-r-lg transition duration-300 transform hover:scale-105">
                Buscar
              </button>
            </div>
          </form>
          <h1 className="text-4xl font-bold text-white text-center mb-5 mt-5">
            Peliculas en tendencia
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {movies.map((items) => {
              return (
                <article
                  className="relative bg-white rounded-lg shadow-md overflow-hidden text-black transform transition duration-500 hover:scale-105"
                  key={items.id}
                >
                  <img
                    src={`${image_url}${items.poster_path}`}
                    alt="movie"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg">{items.title}</h2>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <Rating movieId={items.id} />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={() => handleOpenModal(items)}
                      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                    >
                      Agregar/Ver Reseñas
                    </button>
                    {favoriteMovies.includes(items.id) ? (
                      <button className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded">
                        Película agregada a favoritos
                      </button>
                    ) : (
                      <button
                        onClick={() => addMovieToFavorites(items.id)}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                      >
                        Agregar peli a favoritos
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {isModalOpen && selectedMovie && (
              <Modal
                movie={selectedMovie}
                reviews={reviews}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
