import React, { useState } from "react";
import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { Link } from "react-router-dom";
import "animate.css";

export function Register() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const { signup } = useAuth();
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
      await signup(user.email, user.password);
      navigate("/");
    } catch (error: any) {
      // console.log(error.code); // de aqui podemos sacar el string que es unico y con un if podria ir validando todos y utilizar un mensaje mas claro para el usuario
      // if (error.code === "auth/invalid-email") {
      //   setError("Email is not valid");
      // }
      setError(error.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs m-auto bg-white shadow-lg rounded-xl p-6 animate__animated animate__pulse animate__infinite">
        <h1 className="text-3xl font-bold text-center text-red-800 mb-4 animate__animated animate__fadeInDown">
          Nesflitz Movies
        </h1>
        {error && <Alert message={error} />}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate__animated animate__fadeInUp"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="youremail@company.tld"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="*************"
            />
          </div>
          <div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate__animated animate__pulse animate__infinite"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
