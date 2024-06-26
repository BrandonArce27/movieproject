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

  const apiKey = "72dee24b8ebdce73383391884778e2d7";
  const api_url = "https://api.themoviedb.org/3";
  const image_url = "https://image.tmdb.org/t/p/original";

  //Variables
  const [movies, setMovies] = React.useState<Movies[]>([]);
  const [search, setSearch] = React.useState("");
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
  //fetch de peliculas o search o discover
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
    setSelectedMovie(items);
    setIsModalOpen(true);
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
      return () => unsubscribe();
    }
  }, [selectedMovie]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <main className="w-full font-poppins">
        <Header user={user} handleLogout={handleLogout} />
        <section>
          <form
            onSubmit={searchMovies}
            className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 max-w-md mx-auto transform transition duration-500 hover:scale-105 font-poppins"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Search Movie{" "}
            </h2>
            <div className="flex w-full">
              <input
                name="search"
                type="text"
                placeholder="Search Movie"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-r-lg transition duration-300 transform hover:scale-105">
                Search
              </button>
            </div>
          </form>
          <h1 className="text-4xl font-bold text-white text-center mb-5 mt-5">
            Explore current best movies !!!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {movies.map((items) => {
              return (
                <article
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden text-black transform transition duration-500 hover:scale-105"
                  key={items.id}
                >
                  {items.poster_path ? (
                    <img
                      src={`${image_url}${items.poster_path}`}
                      alt="movie"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-auto bg-gray-300 flex items-center justify-center text-lg text-gray-700">
                      Picture not available
                    </div>
                  )}
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
                      Add/View Review
                    </button>
                    {favoriteMovies.includes(items.id) ? (
                      <button className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded">
                        Movie added to favorites
                      </button>
                    ) : (
                      <button
                        onClick={() => addMovieToFavorites(items.id)}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                      >
                        Add Movie to Favorites
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
