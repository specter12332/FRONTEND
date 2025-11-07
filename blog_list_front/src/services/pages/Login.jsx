import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Validación de correo gmail.com
      if (!email.includes("gmail.com")) {
        alert("Por favor, ingrese las credenciales correctas.");
        return;
      }

      try {
        const response = await fetch('http://localhost:3003/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre,
            numero: numero,
            correo: email,
            contraseña: password,
            role: role,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Usuario registrado correctamente. Por favor, inicia sesión.');
          setIsRegister(false);
          setEmail("");
          setPassword("");
          setNombre("");
          setNumero("");
          setRole("user");
        } else {
          alert(data.error || 'Error al registrar usuario');
        }
      } catch (error) {
        console.error('Error durante el registro:', error);
        alert('Error de conexión');
      }
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/api/contacts/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          correo: email, 
          contraseña: password,
        })
      });

      if (response.ok) {
        const user = await response.json();
        // Guardar el token y la información del usuario
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
        // Redirige a biblioteca
        navigate("/biblioteca");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Credenciales incorrectas. Asegúrate de usar un correo de Gmail y la contraseña correcta.");
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert("Error de conexión. Por favor, intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "80px auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ textAlign: "center" }}>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>
      {isRegister && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            name="number"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </>
      )}
      <input
        type="email"
        name="correo"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <input
        type="password"
        name="contraseña"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
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


