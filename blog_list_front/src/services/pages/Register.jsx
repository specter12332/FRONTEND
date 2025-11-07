import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const getInputStyle = (modoClaro) => ({
  width: "100%",
  padding: "15px",
  marginBottom: "16px",
  borderRadius: "12px",
  background: modoClaro ? "#ffffff" : "#2A2A2A",
  border: "1px solid rgba(0, 198, 255, 0.3)",
  outline: "none",
  fontSize: "16px",
  color: modoClaro ? "#333" : "#fff",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const inputFocusStyle = (modoClaro, color) => ({
  background: modoClaro ? "#ffffff" : "#363636",
  borderColor: color,
  boxShadow: `0 8px 16px ${color}33`,
  transform: "translateY(-2px)",
});

export default function Register({ modoClaro }) {
  const navigate = useNavigate();
  
  // Removemos el useEffect de redirección automática para permitir ver el formulario de registro
  const [formulario, setFormulario] = useState({
    nombre: "",
    numero: "",
    correo: "",
    contraseña: "",
  });
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!formulario.correo.includes("gmail.com")) {
      setMensaje("El correo debe contener gmail.com");
      alert("Por favor, ingresa un correo de gmail.com");
      return;
    }
    try {
      console.log('Enviando datos:', formulario);
      const response = await fetch("http://localhost:3003/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });
      if (response.ok) {
        const datos = await response.json();
        alert("¡Registro exitoso! Por favor, inicia sesión");
        // Limpiar el formulario y redirigir al login
        setFormulario({ nombre: "", numero: "", correo: "", contraseña: "" });
        navigate('/login');
      } else {
        const error = await response.json();
        alert(error.mensaje || "Error al registrar usuario");
        setMensaje(error.mensaje || "Error al registrar usuario");
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMensaje("Error de conexión: " + error.message);
      alert("Error de conexión. Por favor, verifica que el servidor esté corriendo en el puerto 3003");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "40px 0",
        background: `linear-gradient(135deg, rgba(0,198,255,0.1) 0%, rgba(255,179,71,0.1) 100%)`,
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "linear-gradient(45deg, #00c6ff, #0066ff)",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: "0.1",
        top: "-50px",
        left: "-50px",
        animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        background: "linear-gradient(45deg, #ffb347, #ff7a00)",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: "0.1",
        bottom: "-50px",
        right: "-50px",
        animation: "float 6s ease-in-out infinite reverse",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          padding: "48px",
          background: modoClaro 
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(23, 25, 35, 0.95)",
          borderRadius: "24px",
          boxShadow: `0 8px 32px rgba(0, 198, 255, 0.15),
                      0 8px 32px rgba(255, 179, 71, 0.15)`,
          width: "480px",
          maxWidth: "95%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            @keyframes glow {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.2); }
            }
            .input-animated {
              transition: all 0.3s ease;
              border: 2px solid transparent;
              background: rgba(255, 255, 255, 0.05);
            }
            .input-animated:focus {
              border-color: #00c6ff;
              transform: translateY(-2px);
              box-shadow: 0 8px 16px rgba(0, 198, 255, 0.2);
            }
          `}
        </style>
        <h2 style={{ 
          textAlign: "center", 
          background: "linear-gradient(45deg, #00c6ff, #ffb347)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.2em",
          fontWeight: "bold",
          marginBottom: "0.5em",
          animation: "glow 3s ease-in-out infinite"
        }}>
          ¡BIENVENIDO A LECTURA INFINITA!
        </h2>
        <p style={{
          textAlign: "center",
          marginBottom: "24px",
          color: modoClaro ? "#666" : "#eee",
          fontSize: "1.1em",
          lineHeight: "1.5",
          padding: "0 20px"
        }}>
          Crea tu cuenta y empieza tu aventura literaria con confianza.
          <br/>
          <span style={{ 
            color: "#00c6ff",
            fontWeight: "500" 
          }}>Miles de historias te esperan</span>
        </p>
        <form onSubmit={manejarEnvio}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "16px",
              borderRadius: "12px",
              background: "rgba(0, 198, 255, 0.03)",
              border: "1px solid rgba(0, 198, 255, 0.2)",
              outline: "none",
              fontSize: "16px",
              color: modoClaro ? "#333" : "#fff",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(0, 198, 255, 0.1)";
              e.target.style.borderColor = "#00c6ff";
              e.target.style.boxShadow = "0 8px 16px rgba(0, 198, 255, 0.2)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(0, 198, 255, 0.03)";
              e.target.style.borderColor = "rgba(0, 198, 255, 0.2)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          />
          <input
            type="text"
            name="numero"
            placeholder="Número de teléfono"
            value={formulario.numero}
            onChange={manejarCambio}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "16px",
              borderRadius: "12px",
              background: "rgba(255, 179, 71, 0.03)",
              border: "1px solid rgba(255, 179, 71, 0.2)",
              outline: "none",
              fontSize: "16px",
              color: modoClaro ? "#333" : "#fff",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 179, 71, 0.1)";
              e.target.style.borderColor = "#ffb347";
              e.target.style.boxShadow = "0 8px 16px rgba(255, 179, 71, 0.2)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 179, 71, 0.03)";
              e.target.style.borderColor = "rgba(255, 179, 71, 0.2)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formulario.correo}
            onChange={manejarCambio}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "16px",
              borderRadius: "12px",
              background: "rgba(0, 198, 255, 0.03)",
              border: "1px solid rgba(0, 198, 255, 0.2)",
              outline: "none",
              fontSize: "16px",
              color: modoClaro ? "#333" : "#fff",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(0, 198, 255, 0.1)";
              e.target.style.borderColor = "#00c6ff";
              e.target.style.boxShadow = "0 8px 16px rgba(0, 198, 255, 0.2)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(0, 198, 255, 0.03)";
              e.target.style.borderColor = "rgba(0, 198, 255, 0.2)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formulario.contraseña}
            onChange={manejarCambio}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "24px",
              borderRadius: "12px",
              background: "rgba(255, 179, 71, 0.03)",
              border: "1px solid rgba(255, 179, 71, 0.2)",
              outline: "none",
              fontSize: "16px",
              color: modoClaro ? "#333" : "#fff",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255, 179, 71, 0.1)";
              e.target.style.borderColor = "#ffb347";
              e.target.style.boxShadow = "0 8px 16px rgba(255, 179, 71, 0.2)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255, 179, 71, 0.03)";
              e.target.style.borderColor = "rgba(255, 179, 71, 0.2)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          />

          <motion.button
            type="submit"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 20px rgba(0,198,255,0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(45deg, #00c6ff, #ffb347)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,198,255,0.2)",
              transition: "all 0.3s ease",
              marginTop: "10px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <span style={{
              position: "relative",
              zIndex: 1,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Comenzar mi aventura
            </span>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
              transform: "translateX(-100%)",
              transition: "transform 0.6s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(100%)";
            }}
            />
          </motion.button>
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: modoClaro ? "#333" : "#eee",
          }}
        >
          <span>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "#00cfff", textDecoration: "none" }}>
              Inicia sesión
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
