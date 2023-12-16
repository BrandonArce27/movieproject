import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: { displayName: string; email: string };
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-black p-4 mb-10 font-poppins">
      <p className="text-white text-xl sm:text-2xl font-bold mr-4">
        Bienvenido: {user?.displayName || user?.email || "Invitado"}
      </p>
      <div className="flex flex-col sm:flex-row flex-grow space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/trending")}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
        >
          Trending movies
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
        >
          Favorites
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105 mt-4 sm:mt-0"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
