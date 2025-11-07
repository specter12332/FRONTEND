
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LectorPDF from "../../srcv/LectorPDF";
import { librosRepo } from "./librosRepo";

export default function LibroLeer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const libro = librosRepo.find(l => l.id === Number(id));
  // Usar libro1.pdf si es Cien años de soledad
  const pdf = libro?.titulo === "Cien años de soledad" ? "/libro1.pdf" : (libro?.pdf || "/sample.pdf");
  const location = useLocation();

  // If navigation set state.goToSaved, try to scroll to saved page once the reader has rendered.
  useEffect(() => {
    if (!location?.state?.goToSaved) return;
    // Try to scroll to saved page using the same key LectorPDF uses
    const key = `lastPage-${pdf}`;
    const saved = localStorage.getItem(key);
    const pageNum = saved ? parseInt(saved, 10) : null;
    if (!pageNum) return;

    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts += 1;
      const articles = document.querySelectorAll('article');
      if (articles && articles.length >= pageNum) {
        // scroll the reader container to the desired article
        const target = articles[pageNum - 1];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          clearInterval(interval);
        }
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [location, pdf]);
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
