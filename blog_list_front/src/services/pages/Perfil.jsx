import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function Perfil() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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
            { (user.nombre || user.name || user.username) ?
              (user.nombre || user.name || user.username)[0].toUpperCase() : <span>👤</span>}
          </div>
          <h2>{user.nombre || user.name || user.username}</h2>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "1rem"
        }}>
          <div className="field-row" style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div className="field-label" style={{ color: "#cbd5e1", fontWeight: "700" }}>Correo electrónico</div>
            <div className="field-value" style={{ color: "#94a3b8" }}>{user.email || '-'}</div>
          </div>
          
          <div className="field-row" style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div className="field-label" style={{ color: "#cbd5e1", fontWeight: "700" }}>Número de teléfono</div>
            <div className="field-value" style={{ color: "#94a3b8" }}>{user.phone || 'Aún no añadido'}</div>
          </div>
          
          <div className="field-row" style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div className="field-label" style={{ color: "#cbd5e1", fontWeight: "700" }}>Nombre de visualización</div>
            <div className="field-value" style={{ color: "#94a3b8" }}>{user.username || user.name || '-'}</div>
          </div>
          
          <div className="field-row" style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0"
          }}>
            <div className="field-label" style={{ color: "#cbd5e1", fontWeight: "700" }}>Rol</div>
            <div className="field-value" style={{ 
              color: user.role === 'admin' ? "#00c6ff" : "#94a3b8",
              fontWeight: user.role === 'admin' ? "700" : "normal"
            }}>
              {user.role === 'admin' ? "Administrador" : "Usuario"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}