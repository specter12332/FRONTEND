import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LectorPDF from "../srcv/LectorPDF";
import { useLibros } from "../hooks/useLibros";
import { librosRepo } from "../services/pages/librosRepo";
import { useUser } from "../contexts/UserContext";
import { saveBookToLibrary, setToken } from "../services/userLibrary";

export default function LibroLeer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { libros, agregarComentario } = useLibros();
  const libro = libros.find(l => l.id === Number(id));
  const { user } = useUser();

  
  // Asegurar que el token para userLibrary esté establecido cuando el usuario cambie
  useEffect(() => {
    if (user?.token) {
      setToken(user.token);
    } else {
      // no-op when no token
    }
  }, [user]);

  const [comentarios, setComentarios] = useState(libro?.comentarios || []);
  const [autorComentario, setAutorComentario] = useState(user?.name || user?.username || "");
  const [textoComentario, setTextoComentario] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setSaving(true);
      // Llamar a saveBookToLibrary; el servicio intentará extraer userId del token
      await saveBookToLibrary({ userId: user?.id, bookId: libro.id });
      setIsSaved(true);
      // Redirigir a la biblioteca después de guardar
      navigate('/biblioteca');
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setComentarios(libro?.comentarios || []);
  }, [libro]);

  useEffect(() => {
    if (user) setAutorComentario(user.name || user.username || '');
  }, [user]);
  
  // Get PDF URL from book data. If the local `libro` (from useLibros) doesn't include a `pdf` field,
  // try to resolve it from the static `librosRepo` (which includes `pdf` paths). Fall back to /libro1.pdf.
  const pdf = libro?.pdf || (librosRepo.find(l => l.id === Number(id)) || {}).pdf || '/libro1.pdf';
  // pdf path resolved; LectorPDF will handle loading

  if (!libro) {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <h2 style={{ color: '#fff', marginBottom: '1em' }}>Libro no encontrado</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
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
      </div>
    );
  }

  // Decide si forzar el visor por iframe para cargas rápidas (útil para /libro1.pdf)
  const forceIframe = String(pdf).toLowerCase().includes('libro1.pdf');

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
      <div style={{
        position: "absolute",
        top: 30,
        left: 30,
        display: "flex",
        gap: "1rem"
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
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

        <button
          onClick={handleSaveBook}
          disabled={saving || isSaved}
          style={{
            background: isSaved 
              ? "linear-gradient(90deg, #4CAF50, #45a049)"
              : "linear-gradient(90deg, #ffb347, #ff7547)",
            color: "#222",
            fontWeight: "bold",
            fontSize: "1.1em",
            padding: "0.7em 2em",
            border: "none",
            borderRadius: "12px",
            cursor: isSaved ? "default" : "pointer",
            opacity: isSaved ? 0.9 : 1,
            boxShadow: "0 2px 8px #ffb34744",
            display: "flex",
            alignItems: "center",
            gap: "0.5em"
          }}
        >
          {saving ? (
            "Guardando..."
          ) : isSaved ? (
            <>
              <span>Guardado</span>
              <span style={{ fontSize: "1.2em" }}>✓</span>
            </>
          ) : (
            <>
              <span>Guardar en biblioteca</span>
              <span style={{ fontSize: "1.2em" }}>📚</span>
            </>
          )}
        </button>
      </div>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 32px #00c6ff88",
        padding: "2em",
        maxWidth: "1200px",
        width: "95%",
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{ color: '#00c6ff', marginBottom: '1em' }}>{libro.titulo}</h2>
        <div style={{ width: '100%', height: 'calc(100vh - 200px)', position: 'relative' }}>
          {/* Si el archivo es un PDF, mostrar el visor nativo del navegador en un iframe
              (esto muestra barra de herramientas y miniaturas como en la segunda foto). */}
          {String(pdf).toLowerCase().endsWith('.pdf') ? (
            <iframe
              title={libro.titulo}
              src={pdf}
              style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              allowFullScreen
            />
          ) : (
            <LectorPDF
              archivo={pdf}
              useIframe={forceIframe}
              key={pdf}
            />
          )}
        </div>
        {/* Comentarios */}
        <div style={{ width: '100%', marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.6rem' }}>Comentarios</h3>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <input
              aria-label="Autor del comentario"
              placeholder="Tu nombre"
              value={autorComentario}
              onChange={(e) => setAutorComentario(e.target.value)}
              style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>
          <textarea
            aria-label="Escribe tu comentario"
            placeholder="Escribe tu opinión sobre el libro..."
            value={textoComentario}
            onChange={(e) => setTextoComentario(e.target.value)}
            style={{ width: '100%', minHeight: 80, padding: '0.6rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
            <button
              onClick={() => {
                if (!textoComentario.trim()) return;
                const nuevo = {
                  id: Date.now(),
                  autor: autorComentario || 'Anónimo',
                  texto: textoComentario.trim(),
                  fecha: new Date().toISOString()
                };
                agregarComentario(libro.id, nuevo);
                setComentarios(prev => [nuevo, ...prev]);
                setTextoComentario('');
              }}
              style={{ background: 'linear-gradient(90deg,#00c6ff,#ffb347)', color: '#222', padding: '0.6rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              Enviar comentario
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {comentarios && comentarios.length === 0 && (
              <div style={{ color: '#666' }}>Sé el primero en comentar este libro.</div>
            )}
            {comentarios && comentarios.map(c => (
              <div key={c.id} style={{ padding: '0.8rem', borderRadius: 8, background: '#f7fbff', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong>{c.autor}</strong>
                  <small style={{ color: '#666' }}>{new Date(c.fecha).toLocaleString()}</small>
                </div>
                <div style={{ color: '#222' }}>{c.texto || c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}