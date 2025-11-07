import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const inputStyles = {
  width: "100%",
  padding: "15px",
  marginBottom: "16px",
  borderRadius: "12px",
  background: "#ffffff",
  border: "1px solid rgba(0, 198, 255, 0.2)",
  outline: "none",
  fontSize: "16px",
  color: "#333",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const focusStyles = {
  background: "#ffffff",
  borderColor: "#00c6ff",
  boxShadow: "0 8px 16px rgba(0, 198, 255, 0.2)",
  transform: "translateY(-2px)",
};

export default function Register({ modoClaro }) {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    numero: "",
    correo: "",
    contraseña: "",
  });

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!formulario.correo.includes("gmail.com")) {
      alert("Por favor, ingresa un correo de gmail.com");
      return;
    }

    try {
      console.log('Enviando datos:', formulario);
      const response = await fetch("http://localhost:3003/api/contacts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario),
      });

      if (response.ok) {
        alert("¡Registro exitoso! Por favor, inicia sesión");
        setFormulario({ nombre: "", numero: "", correo: "", contraseña: "" });
        navigate('/login');
      } else {
        const error = await response.json();
        alert(error.mensaje || "Error al registrar usuario");
      }
    } catch (error) {
      console.error('Error de registro:', error);
      alert("Error de conexión. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 80px)",
      width: "100%",
      padding: "20px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "30px",
          fontSize: "2em"
        }}>
          Crear Cuenta
        </h1>

        <form onSubmit={manejarEnvio}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
            style={inputStyles}
            onFocus={e => Object.assign(e.target.style, focusStyles)}
            onBlur={e => Object.assign(e.target.style, inputStyles)}
          />

          <input
            type="text"
            name="numero"
            placeholder="Número de teléfono"
            value={formulario.numero}
            onChange={manejarCambio}
            required
            style={inputStyles}
            onFocus={e => Object.assign(e.target.style, focusStyles)}
            onBlur={e => Object.assign(e.target.style, inputStyles)}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico (gmail.com)"
            value={formulario.correo}
            onChange={manejarCambio}
            required
            style={inputStyles}
            onFocus={e => Object.assign(e.target.style, focusStyles)}
            onBlur={e => Object.assign(e.target.style, inputStyles)}
          />

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formulario.contraseña}
            onChange={manejarCambio}
            required
            style={inputStyles}
            onFocus={e => Object.assign(e.target.style, focusStyles)}
            onBlur={e => Object.assign(e.target.style, inputStyles)}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              background: "linear-gradient(45deg, #00c6ff, #0072ff)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "20px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.target.style.transform = "translateY(0)"}
          >
            Registrarse
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666"
        }}>
          ¿Ya tienes cuenta?{" "}
          <Link 
            to="/login"
            style={{
              color: "#00c6ff",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}