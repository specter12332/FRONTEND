import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const librosRepo = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    portada: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    sinopsis: "La historia de la familia Buendía en el mítico pueblo de Macondo, una obra maestra del realismo mágico.",
  },
  {
    id: 2,
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    portada: "https://covers.openlibrary.org/b/id/8108696-L.jpg",
    sinopsis: "Un cuento filosófico sobre la vida, la amistad y el amor visto a través de los ojos de un niño viajero de otros planetas.",
  },
  // ...otros libros...
];

export default function LibroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const libro = librosRepo.find(l => l.id === Number(id));

  if (!libro) return <div>Libro no encontrado</div>;

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2em",
      background: "transparent"
    }}>
      <button
        style={{
          background: "#eee",
          color: "#222",
          border: "none",
          borderRadius: "10px",
          padding: "14px 36px",
          fontWeight: "bold",
          fontSize: "1.1em",
          cursor: "pointer",
          marginBottom: "2em",
          alignSelf: "flex-start"
        }}
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
      <div style={{
        display: "flex",
        flexDirection: "row",
        background: "rgba(255,255,255,0.97)",
        borderRadius: "24px",
        boxShadow: "0 4px 24px #00c6ff44",
        padding: "2.5em 3em",
        alignItems: "flex-start",
        maxWidth: "1200px", // Ajusta el ancho si lo necesitas
        width: "100%"
      }}>
        <img
          src={libro.portada}
          alt={libro.titulo}
          style={{
            width: "400px", // Ajusta el tamaño si lo necesitas
            height: "570px",
            objectFit: "cover",
            borderRadius: "18px",
            boxShadow: "0 2px 16px #00c6ff44",
            marginRight: "3em"
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <h2 style={{
            color: "#00c6ff",
            fontWeight: "bold",
            fontSize: "2.5em",
            marginBottom: "0.3em",
            letterSpacing: "1px"
          }}>
            {libro.titulo}
          </h2>
          <h3 style={{
            color: "#222",
            fontWeight: "bold",
            fontSize: "1.5em",
            marginBottom: "1.2em"
          }}>
            {libro.autor}
          </h3>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px #00c6ff22",
            padding: "1.5em 2em",
            fontSize: "1.25em",
            color: "#333",
            marginBottom: "2em",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column"
          }}>
            <strong>Sinopsis:</strong>
            <div style={{ marginTop: "0.7em", marginBottom: "2em" }}>{libro.sinopsis}</div>
            <button
              style={{
                background: "linear-gradient(90deg,#00cfff,#ffb347)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "18px 44px",
                fontWeight: "bold",
                fontSize: "1.3em",
                cursor: "pointer",
                boxShadow: "0 2px 8px #00c6ff44",
                letterSpacing: "1px",
                width: "100%"
              }}
              onClick={() => navigate(`/libro/${libro.id}/leer`)}
            >
              Comenzar tu aventura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}