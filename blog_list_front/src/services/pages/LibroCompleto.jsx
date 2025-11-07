import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { librosRepo } from "./librosRepo";

export default function LibroCompleto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const libro = librosRepo.find(l => l.id === Number(id));

  if (!libro) {
    return (
      <div style={{ padding: "2em", color: "#00c6ff", textAlign: "center" }}>
        Libro no encontrado.
        <br />
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "1em",
            padding: "0.7em 2em",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
            color: "#222",
            fontWeight: "bold",
            border: "none",
            fontSize: "1em",
            cursor: "pointer"
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "60px"
      }}
    >
      <button
        onClick={() => navigate("/nuevo")}
        style={{
          background: "linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
          color: "#222",
          fontWeight: "bold",
          fontSize: "1em",
          padding: "0.5em 1.5em",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "1em"
        }}
      >
        ← Volver
      </button>
      <img
        src={libro.portada}
        alt={libro.titulo}
        style={{
          width: "180px",
          height: "260px",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 16px #00c6ff44",
          marginBottom: "1.5em"
        }}
      />
      <h1 style={{
        color: "#00c6ff",
        fontWeight: "bold",
        fontSize: "2em",
        marginBottom: "0.5em",
        textAlign: "center"
      }}>
        {libro.titulo}
      </h1>
      <h3 style={{
        color: "#222",
        fontWeight: "bold",
        fontSize: "1.2em",
        marginBottom: "1em",
        textAlign: "center"
      }}>
        {libro.autor}
      </h3>
      <div style={{
        background: "rgba(255,255,255,0.85)",
        borderRadius: "14px",
        boxShadow: "0 2px 12px #00c6ff44",
        padding: "1.5em",
        maxWidth: "500px",
        color: "#222",
        fontSize: "1.15em",
        textAlign: "center"
      }}>
        <strong>Sinopsis:</strong>
        <br />
        {libro.sinopsis}
      </div>
      <button
        onClick={() => navigate(`/libro/${id}/leer`)}
        style={{
          background: "linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
          color: "#222",
          fontWeight: "bold",
          fontSize: "1.1em",
          padding: "0.7em 2em",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 2px 8px #00c6ff44",
          marginTop: "1em"
        }}
      >
        Ver el libro
      </button>
    </div>
  );
}