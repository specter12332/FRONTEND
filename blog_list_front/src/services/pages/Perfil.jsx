import React from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div style={{ padding: "2rem", color: "#fff", textAlign: "center" }}>
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  // Backdrop que cubre toda la pantalla y asegura que el panel se muestre por encima
  return (
    <div
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: "100%",
          background: "rgba(34,36,38,0.95)",
          borderRadius: "12px",
          padding: "2rem",
          color: "#fff",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 10000
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Cerrar perfil"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer"
          }}
        >
          ×
        </button>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#0072ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "2.5em",
            marginBottom: "1rem"
          }}>
            {user.nombre ? user.nombre[0].toUpperCase() : <span>👤</span>}
          </div>
          <h2>{user.nombre}</h2>
        </div>

        <div>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Número:</strong> {user.number}</p>
          <p><strong>Rol:</strong> {user.role === "admin" ? "Administrador" : "Usuario"}</p>
        </div>
      </div>
    </div>
  );
}