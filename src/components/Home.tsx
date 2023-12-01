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

  const [movies, setMovies] = React.useState<Movies[]>([]);
  const apiKey = "72dee24b8ebdce73383391884778e2d7";
  const popular = "https://api.themoviedb.org/3/movie/popular";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchData = () => {
    axios.get(`${popular}?api_key=${apiKey}`).then((response) => {
      const result = response.data.results;
      setMovies(result);
    });
  };

  useEffect(() => {
    fetchData();
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
        {/* Main content */}
        <h1 className="text-4xl font-bold text-white text-center mb-5">
          Peliculas en tendencia
        </h1>
        <div className="flex flex-wrap justify-center">
          {movies.map((items) => {
            return (
              <div className=" text-white">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${items.poster_path}`}
                  alt="movie"
                />
                <p className="">{items.title}</p>
                <p className="">{items.release_date}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
