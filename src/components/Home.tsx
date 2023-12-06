import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export function Home() {
  const { logout, user, loading } = useAuth();
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

  useEffect(() => {
    fetchData(null);
  }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-800 text-white p-4">
          <div>
            <p className="text-white">
              Bienvenido: {user.displayName || user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
        <form onSubmit={searchMovies}>
          <input
            type="text"
            placeholder="search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-white">Buscar</button>
        </form>
        {/* Aqui se renderizan las pelis en tendencia si no se utiliza el search */}
        <h1 className="text-4xl font-bold text-white text-center mb-5">
          Peliculas en tendencia
        </h1>
        <div className="flex flex-wrap justify-center">
          {movies.map((items) => {
            return (
              <div className=" text-white" key={items.id}>
                <img src={`${image_url}${items.poster_path}`} alt="movie" />
                <p className="">{items.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
