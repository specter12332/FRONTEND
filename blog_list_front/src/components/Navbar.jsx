// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          📚 MiBiblioteca
        </div>

        {/* Menú */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-green-400 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/nuevo" className="hover:text-green-400 transition-colors">
              Nuevo libro
            </Link>
          </li>
          <li>
            <Link to="/buscar" className="hover:text-green-400 transition-colors">
              Buscar libros
            </Link>
          </li>
          <li>
            <Link to="/biblioteca" className="hover:text-green-400 transition-colors">
              Biblioteca
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-green-400 transition-colors">
              Iniciar sesión
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  );
}
