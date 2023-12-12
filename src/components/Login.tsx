import React, { useState } from "react";
import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { Link } from "react-router-dom";

export function Login() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate(); // this is a hook from react-router-dom
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      // console.log(error.code); // de aqui podemos sacar el string que es unico y con un if podria ir validando todos y utilizar un mensaje mas claro para el usuario
      // if (error.code === "auth/invalid-email") {
      //   setError("Email is not valid");
      // }
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs m-auto ">
        {error && <Alert message={error} />}
        <h1 className="text-6xl font-bold animate__animated animate__fadeInUp animate__delay-1s text-white mb-5">
          Movie Project !!!!
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="youremail@company.tld"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="*************"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105 animate-spin"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <p className=" text-white my-4 text-sm flex justify-between px-3">
          Don't have an account?
          <Link to="/register" className="text-blue-700 hover:text-blue-900">
            Register
          </Link>
        </p>
        <button
          onClick={handleGoogleSignin}
          className="bg-slate-50 hover:bg-slate-200 text-black  shadow rounded border-2 border-gray-300 py-2 px-4 w-full"
        >
          Google login
        </button>
      </div>
    </>
  );
}
