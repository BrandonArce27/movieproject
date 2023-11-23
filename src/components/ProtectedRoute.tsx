import React from "react";
import { useAuth } from "../context/authContext"; // importamos el hook que creamos en el authContext.tsx para poder utilizarlo en este componente
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  if (!user) return <Navigate to="/login" />;
  //se comprueba si el objeto usuario existe si no devuelve a la pagina de login

  return <>{children}</>;
}
