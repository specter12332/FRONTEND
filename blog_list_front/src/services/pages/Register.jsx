import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      alert("Este correo ya está registrado");
      return;
    }

    users.push({ email, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Cuenta creada con éxito");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#343541]">
      <div className="bg-[#202123] p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Crear cuenta
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 bg-[#343541] text-white border border-gray-600 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 bg-[#343541] text-white border border-gray-600 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Selección de rol */}
          <select
            className="w-full p-2 bg-[#343541] text-white border border-gray-600 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
