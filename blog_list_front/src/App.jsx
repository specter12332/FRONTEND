import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

// Pages
import Inicio from "./services/pages/Inicio";
import NuevoLibro from "./pages/NuevoLibro";
import BuscarLibros from "./services/pages/BuscarLibros";
import Biblioteca from "./services/pages/Biblioteca";
import Login from "./services/pages/Login";
import Register from "./pages/Register";
import Perfil from "./services/pages/Perfil";
import LibroCompleto from "./services/pages/LibroCompleto";
import LibroLeer from "./pages/LibroLeer";
import Ajustes from "./services/pages/Ajustes";
import CambiarContrasena from "./services/pages/CambiarContrasena";

const imagenLibreria = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [modoClaro, setModoClaro] = useState(true);
  const location = useLocation();

  if (showSplash && location.pathname === "/") {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const overlay = modoClaro
    ? "rgba(255,255,255,0.45)" // Menos opaco para modo claro
    : "rgba(34,36,38,0.45)";   // Menos opaco para modo oscuro

  // Oculta el Navbar en la página de lectura de libro
  const hideNavbar = location.pathname === "/login" || location.pathname.startsWith("/libro/");

  // No necesitamos obtener el usuario aquí

  return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          maxWidth: "100vw",
          background: `url('${imagenLibreria}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflowX: "hidden",
          paddingTop: "80px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlay,
            backdropFilter: "blur(1px)",
            zIndex: 1,
            transition: "background 0.5s"
          }}
        />
        {/* El Navbar siempre arriba */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {!hideNavbar && <Navbar modoClaro={modoClaro} setModoClaro={setModoClaro} />}
          <Routes>
            <Route path="/" element={<Inicio modoClaro={modoClaro} setModoClaro={setModoClaro} />} />
            <Route path="/nuevo" element={<NuevoLibro modoClaro={modoClaro} />} />
            <Route path="/buscar" element={<BuscarLibros modoClaro={modoClaro} />} />
            <Route path="/biblioteca" element={<Biblioteca modoClaro={modoClaro} />} />
            <Route path="/login" element={<Login modoClaro={modoClaro} />} />
            <Route path="/register" element={<Register modoClaro={modoClaro} />} />
            <Route path="/perfil" element={<Perfil modoClaro={modoClaro} />} />
            <Route path="/ajustes" element={<Ajustes modoClaro={modoClaro} setModoClaro={setModoClaro} />} />
            <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
            <Route path="/libro/:id" element={<LibroCompleto modoClaro={modoClaro} />} />
            <Route path="/libro/:id/leer" element={<LibroLeer />} />
          </Routes>
        </div>
      </div>
  );
}
