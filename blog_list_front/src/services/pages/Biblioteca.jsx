
import React, { useEffect, useState } from "react";
import { getUserLibrary, setToken } from "../userLibrary";

export default function Biblioteca({ modoClaro }) {
  const [libros, setLibros] = useState([]);
  const [racha, setRacha] = useState(0);

  useEffect(() => {
    // Obtener usuario autenticado de localStorage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      getUserLibrary(user.id)
        .then(data => setLibros(data))
        .catch(() => setLibros([]));
    } else {
      setLibros([]);
    }
  }, []);

  return (
    <div style={{ padding: "2em", minHeight: "80vh" }}>
      <h2 style={{ color: modoClaro ? "#222" : "#00c6ff", fontSize: "2em", marginBottom: "1em" }}>
        Mi Biblioteca
      </h2>
      {racha > 0 && (
        <div style={{
          position: "absolute",
          top: 30,
          right: 40,
          background: "linear-gradient(90deg,#00cfff,#ffb347)",
          color: "#fff",
          padding: "10px 22px",
          borderRadius: "24px",
          fontWeight: "bold",
          fontSize: "18px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          animation: "pop 0.5s"
        }}>
          🔥 ¡Racha: {racha} día{racha > 1 ? "s" : ""} guardando libros!
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "2em", alignItems: "center" }}>
        {libros.map(libro => (
          <div key={libro.id} style={{
            display: "flex",
            flexDirection: "row",
            background: modoClaro ? "#fff" : "#222",
            borderRadius: "18px",
            boxShadow: "0 2px 16px #00c6ff44",
            padding: "2em",
            minWidth: "600px",
            maxWidth: "900px",
            alignItems: "center"
          }}>
            <img
              src={libro.portada}
              alt={libro.titulo}
              style={{
                width: "220px",
                height: "320px",
                objectFit: "cover",
                borderRadius: "12px",
                marginRight: "2em",
                boxShadow: "0 2px 12px #00c6ff44"
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "2em", color: modoClaro ? "#222" : "#fff", marginBottom: "0.3em" }}>
                {libro.titulo}
              </div>
              <div style={{ color: modoClaro ? "#555" : "#ccc", fontSize: "1.2em", marginBottom: "0.7em" }}>
                {libro.autor}
              </div>
              <div style={{
                color: modoClaro ? "#333" : "#eee",
                fontSize: "1.1em",
                marginBottom: "1.2em",
                maxHeight: "140px",
                overflowY: "auto"
              }}>
                {libro.sinopsis || "Sinopsis no disponible."}
              </div>
              <button
                style={{
                  background: "linear-gradient(90deg,#00cfff,#ffb347)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 32px",
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #00c6ff44"
                }}
                onClick={() => alert(`Comenzando lectura de "${libro.titulo}"`)}
              >
                Comenzar lectura
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
