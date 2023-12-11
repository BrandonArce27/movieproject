import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export function Home() {
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();
  console.log("user");
  console.log(user); //revisar bien esto al final

  const apiKey = "72dee24b8ebdce73383391884778e2d7";
  const api_url = "https://api.themoviedb.org/3";
  const image_url = "https://image.tmdb.org/t/p/original";

  //Variables de estado
  const [movies, setMovies] = React.useState<Movies[]>([]);
  const [search, setSearch] = React.useState("");
  // const [movie, setMovie] = React.useState<Movies[]>([]); //sirve para cuanbdo se busca una pelicula, lo voy a utilizar para agregar a favoritos posiblemente

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

  //funcion para agregar peliculas a favoritos
  const addMovieToFavorites = async (movieId: number) => {
    try {
      // Obtén una referencia al documento del usuario en la colección "favorite-movies"
      const docRef = doc(db, "favorite-movies", user?.email);

      // Comprueba si el documento existe
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Si el documento no existe, utilice setDoc para crearlo
        await setDoc(docRef, { idmovies: [movieId] });
      } else {
        // Si el documento existe, utilice updateDoc para agregar el ID de la película al campo 'idmovies'
        await updateDoc(docRef, {
          idmovies: arrayUnion(movieId),
        });
      }
    } catch (error) {
      console.error("Error adding movie to favorites: ", error);
    }
  };

  useEffect(() => {
    fetchData(null);
  }, []);

  const rating = 4; // de momento la puse igual a 4 todas, pero esto es meramente paraque sirvan las estrellas. tengo que darles funcionaidad con firebase.

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <main className="w-full">
        {/* Header */}
        <header className="flex justify-between items-center bg-gray-800 text-white p-4 mb-10">
          <div>
            <p className="text-white">
              Bienvenido: {user.displayName || user.email}
            </p>
          </div>
          <button onClick={() => navigate("/favorites")}>
            Go to Favorites
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </header>
        {/* Aqui se renderizan las pelis en tendencia si no se utiliza el search */}
        <section>
          <h1 className="text-4xl font-bold text-white text-center mb-5">
            Peliculas en tendencia
          </h1>
          <form
            onSubmit={searchMovies}
            className="flex flex-col items-center justify-center"
          >
            <input
              type="text"
              placeholder="Buscar pelicula"
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105 mb-5">
              Buscar
            </button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((items) => {
              return (
                <article className=" text-white" key={items.id}>
                  <img
                    src={`${image_url}${items.poster_path}`}
                    alt="movie"
                    className="w-full h-100 object-cover"
                  />
                  <p className="mt-2">{items.title}</p>
                  <button
                    onClick={() => addMovieToFavorites(items.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105 "
                  >
                    Agregar peli a favoritos
                  </button>
                  <div className="flex">
                    {[...Array(5)].map((star, i) => {
                      const ratingValue = i + 1;
                      return (
                        <label key={i}>
                          <input
                            type="radio"
                            name={`rating-${items.id}`}
                            value={ratingValue}
                            className="hidden"
                          />
                          <FaStar
                            color={ratingValue <= rating ? "yellow" : "gray"}
                          />
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
