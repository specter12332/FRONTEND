
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some((u) => u.email === email);
      if (exists) {
        alert("El correo ya está registrado");
        return;
      }
      users.push({ email, password, role });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Cuenta creada. Ahora puedes iniciar sesión.");
      setIsRegister(false);
      setEmail("");
      setPassword("");
      setRole("user");
      return;
    }
    // Login
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userFound) {
      localStorage.setItem("user", JSON.stringify(userFound));
      if (userFound.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/biblioteca");
      }
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "80px auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ textAlign: "center" }}>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
        required
        style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      {isRegister && (
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      )}
      <button type="submit" style={{ padding: 10, borderRadius: 4, background: "#4ade80", color: "#222", fontWeight: "bold", border: "none" }}>
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </button>
      <button
        type="button"
        onClick={() => setIsRegister((v) => !v)}
        style={{ background: "none", color: "#4ade80", border: "none", cursor: "pointer", marginTop: 8 }}
      >
        {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Crear cuenta"}
      </button>
    </form>
  );
}


