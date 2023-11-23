import React, { useState } from "react";
import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
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

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="youremail@hello.com"
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
          placeholder="********"
        />
        <button>Login</button>
      </form>
    </div>
  );
}
