import { useAuth } from "../context/authContext";

export function Home() {
  const { logout, user, loading } = useAuth();
  console.log("user");

  console.log(user); //revisar bien esto al final

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (loading) return <h1>Loading...</h1>;
  return (
    <div className="w-full max-w-xs m-auto text-black">
      <div className="bg-white shadow-md rounded px-8 ot-6 pb-8 mb-4">
        <p className="text-xl mb-4">
          Bienvenido : {user.displayName || user.email}
        </p>
        <button
          className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
