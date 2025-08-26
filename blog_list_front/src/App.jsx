import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import NuevoLibro from "./services/pages/NuevoLibro";
import BuscarLibros from "./services/pages/BuscarLibros";
import Biblioteca from "./services/pages/Biblioteca";
import Login from "./services/pages/Login";

export default function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/nuevo" element={<NuevoLibro />} />
        <Route path="/buscar" element={<BuscarLibros />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
