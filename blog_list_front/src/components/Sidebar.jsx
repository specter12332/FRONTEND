
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiBookOpen, FiMenu } from "react-icons/fi";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  const [open, setOpen] = useState(true);

  return (
    <div className="bg-[#202123] w-60 fixed h-full flex flex-col border-r border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">📚 Biblioteca</h2>
        <button
          className="text-2xl text-[#4ade80] focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          title="Abrir menú"
        >
          <FiMenu />
        </button>
      </div>
      {open && (
        <nav className="flex-1 px-4 py-6 space-y-4">
          <Link to="/nuevo" className="flex items-center gap-2 hover:bg-[#343541] p-2 rounded">
            <FiPlus /> Nuevo libro
          </Link>
          <Link to="/buscar" className="flex items-center gap-2 hover:bg-[#343541] p-2 rounded">
            <FiSearch /> Buscar libros
          </Link>
          <Link to="/biblioteca" className="flex items-center gap-2 hover:bg-[#343541] p-2 rounded">
            <FiBookOpen /> Biblioteca
          </Link>
          {user && user.role === "admin" && (
            <Link to="/admin" className="flex items-center gap-2 hover:bg-[#343541] p-2 rounded text-yellow-400 font-bold">
              🛠️ Panel Admin
            </Link>
          )}
        </nav>
      )}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        © 2025 Mi App
      </div>
    </div>
  );
}
