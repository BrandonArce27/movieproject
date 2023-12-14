import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: { displayName: string; email: string };
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white p-4 mb-10">
      <div>
        <p className="text-white">
          Bienvenido: {user.displayName || user.email}
        </p>
      </div>
      <button onClick={() => navigate("/")}>Go to Home</button>{" "}
      <button onClick={() => navigate("/favorites")}>Go to Favorites</button>
      <button
        onClick={handleLogout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
