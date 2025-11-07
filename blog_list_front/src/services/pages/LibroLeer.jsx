
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import LectorPDF from "../../srcv/LectorPDF";
import { librosRepo } from "./librosRepo";

export default function LibroLeer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const libro = librosRepo.find(l => l.id === Number(id));
  const pdf = libro?.pdf || "/sample.pdf";
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999,
      overflowY: "auto"
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          background: "#00c6ff",
          color: "#222",
          fontWeight: "bold",
          fontSize: "1.1em",
          padding: "0.7em 2em",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 2px 8px #00c6ff44",
        }}
      >
        ← Volver
      </button>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 32px #00c6ff88",
        padding: "2em",
        maxWidth: "900px",
        width: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {libro && (
          <>
            <h2 style={{ color: '#00c6ff', marginBottom: '0.5em' }}>{libro.titulo}</h2>
            {/* Solo mostrar el título */}
          </>
        )}
        <LectorPDF archivo={pdf} />
        // ...el resto del código permanece igual...
      </div>
    </div>
  );
}
