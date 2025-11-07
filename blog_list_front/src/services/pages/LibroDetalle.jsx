import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from '../../context/UserContext';
import { librosRepo } from "./librosRepo";
import Comments from "../../components/Comments";
import { saveBookToLibrary } from "../userLibrary";
import "../../components/Comments.css";
import "./NuevoLibro.css";

export default function LibroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSinopsis, setShowSinopsis] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const libro = librosRepo.find(l => l.id === Number(id));

  const handleSaveBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setSaving(true);
      await saveBookToLibrary({ userId: user.id, bookId: libro.id });
      setIsSaved(true);
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!libro) return <div>Libro no encontrado</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px",
      }}
    >
      {/* Fondo con efecto de desenfoque */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${libro.portada})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px)",
          opacity: 0.3,
          zIndex: 0
        }}
      />
      
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        {/* Botón Volver */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            padding: "12px 24px",
            borderRadius: "30px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "40px",
            backdropFilter: "blur(10px)"
          }}
        >
          ← Volver
        </motion.button>

        {/* Contenedor principal */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {/* Sección superior con portada e info */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "400px 1fr",
            gap: "60px",
            alignItems: "start"
          }}>
          {/* Portada del libro */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={libro.portada}
              alt={libro.titulo}
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                aspectRatio: "2/3",
                objectFit: "cover"
              }}
            />
          </motion.div>
          {/* Información del libro */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            {/* Título y autor */}
            <div>
              <h1 style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "16px",
                background: "linear-gradient(45deg, #00c6ff, #ffb347)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {libro.titulo}
              </h1>
              <h2 style={{
                fontSize: "24px",
                color: "#fff",
                opacity: 0.8
              }}>
                {libro.autor}
              </h2>
            </div>

            {/* Detalles del libro */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "15px",
              padding: "20px",
              backdropFilter: "blur(10px)"
            }}>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Año</div>
                <div>{libro.año || "N/A"}</div>
              </div>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Género</div>
                <div>{libro.género || "N/A"}</div>
              </div>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Páginas</div>
                <div>{libro.páginas || "N/A"}</div>
              </div>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Idioma</div>
                <div>{libro.idioma || "N/A"}</div>
              </div>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Rating</div>
                <div>{"★".repeat(Math.floor(libro.rating))} {libro.rating}/5</div>
              </div>
              <div>
                <div style={{ color: "#00c6ff", marginBottom: "4px" }}>Editorial</div>
                <div>{libro.editorial || "N/A"}</div>
              </div>
            </div>

            {/* Premios y reconocimientos */}
            {libro.premios && libro.premios.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "20px",
                backdropFilter: "blur(10px)"
              }}>
                <h3 style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#00c6ff"
                }}>
                  Premios y reconocimientos
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  {libro.premios.map((premio, index) => (
                    <li key={index} style={{
                      background: "rgba(0,198,255,0.1)",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "14px"
                    }}>
                      {premio}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sinopsis y biografía */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "20px"
            }}>
              <motion.div
                animate={{ height: showSinopsis ? "auto" : "100px" }}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "15px",
                  padding: "24px",
                  backdropFilter: "blur(10px)",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <h3 style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#00c6ff"
                }}>
                  Sinopsis
                </h3>
                <p style={{ lineHeight: 1.6, marginBottom: "20px" }}>
                  {libro.sinopsis}
                </p>

                {!showSinopsis && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "80px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: "20px"
                  }}
                >
                  <button
                    onClick={() => setShowSinopsis(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#00c6ff",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Mostrar más ▼
                  </button>
                </div>
              )}
              </motion.div>
            </div>

            {/* Botones de acción */}
            <div style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "40px"
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "linear-gradient(45deg, #00c6ff, #ffb347)",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: "1",
                  maxWidth: "300px"
                }}
                onClick={() => navigate(`/libro/${libro.id}/leer`)}
              >
                Comenzar a leer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving || isSaved}
                style={{
                  background: isSaved 
                    ? "linear-gradient(45deg, #4CAF50, #45a049)"
                    : "linear-gradient(45deg, #3f51b5, #2196f3)",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: isSaved ? "default" : "pointer",
                  opacity: isSaved ? 0.9 : 1,
                  flex: "1",
                  maxWidth: "300px"
                }}
                onClick={handleSaveBook}
              >
                {saving ? "Guardando..." : isSaved ? "Guardado ✓" : "Guardar en biblioteca"}
              </motion.button>
            </div>

            {/* Sección de comentarios */}
            <div style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "15px",
              padding: "24px",
              backdropFilter: "blur(10px)"
            }}>
              <h3 style={{
                fontSize: "20px",
                marginBottom: "20px",
                color: "#00c6ff"
              }}>
                Comentarios
              </h3>
              {user ? (
                <Comments bookId={libro.id} user={user} />
              ) : (
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center"
                }}>
                  <p style={{ marginBottom: "16px", color: "#fff" }}>
                    Inicia sesión para comentar
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: "linear-gradient(45deg, #00c6ff, #ffb347)",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "30px",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Iniciar Sesión
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
          </div>

          {/* Sección de comentarios separada */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
            marginTop: "40px"
          }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "30px",
              background: "linear-gradient(45deg, #00c6ff, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Comentarios
            </h2>
            
            {user ? (
              <Comments bookId={libro.id} user={user} />
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "15px",
                padding: "30px",
                textAlign: "center"
              }}>
                <p style={{ 
                  marginBottom: "20px", 
                  color: "#fff",
                  fontSize: "18px"
                }}>
                  Inicia sesión para compartir tu opinión sobre este libro
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "linear-gradient(45deg, #00c6ff, #ffb347)",
                    border: "none",
                    padding: "16px 32px",
                    borderRadius: "30px",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}