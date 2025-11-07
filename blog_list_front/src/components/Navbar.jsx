// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Simulación de datos de usuario (reemplaza por tu lógica real)
const usuario = {
  correo: "usuario@email.com",
  librosLeidos: 12,
  racha: 5,
};

export default function Navbar({ modoClaro, setModoClaro }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMenu, setShowMenu] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowMenu(false);
    navigate("/login");
  };

  // small accessibility controls (font size) and theme toggle in dropdown
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('baseFontSize');
    return saved ? parseInt(saved, 10) : 16;
  });

  useEffect(() => {
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('baseFontSize', fontSize);
  }, [fontSize]);

  const goLogin = () => navigate('/login');
  const goRegister = () => navigate('/register');
  const goProfile = () => navigate('/perfil');

  return (
    <nav
      style={{
        width: "100%",
        background: "var(--bg-dark)",
        padding: "0.8em 2.5em", // agrega espacio a los lados
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100
      }}
    >
      <Link to="/" style={{
        color: "var(--accent)",
        fontWeight: "bold",
        fontSize: "1.5em",
        letterSpacing: "2px",
        textDecoration: "none"
      }}>
        LECTURA INFINITA
      </Link>
      <div style={{
        display: "flex",
        gap: "2em",
        alignItems: "center"
      }}>
  <Link to="/" style={linkStyle}>Inicio</Link>
  <Link to="/nuevo" style={linkStyle}>Nuevo libro</Link>
  <Link to="/buscar" style={linkStyle}>Buscar libros</Link>
  <Link to="/biblioteca" style={linkStyle}>Biblioteca</Link>
  {/* Lectura crítica: eliminado */}
        {/* Botón modo claro/oscuro */}
        <button
          onClick={() => setModoClaro(m => !m)}
          style={{
            background: modoClaro ? "var(--card-bg)" : "transparent",
            color: modoClaro ? "var(--text-dark)" : "var(--accent-light)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            boxShadow: "0 2px 8px #2228",
            cursor: "pointer",
            fontSize: "1.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "1em"
          }}
          title={modoClaro ? "Modo oscuro" : "Modo claro"}
        >
          🌙
        </button>
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setMostrarPerfil(!mostrarPerfil)}
            style={{
              borderRadius: "50%",
              width: 40,
              height: 40,
              background: modoClaro ? "var(--card-bg)" : "transparent",
              border: "2px solid var(--accent)",
              cursor: "pointer",
              marginLeft: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            title="Perfil"
          >
            {/* Ícono SVG de usuario */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={modoClaro ? "var(--text-dark)" : "var(--card-bg)"}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 16-4 16 0" />
            </svg>
          </button>
          {mostrarPerfil && createPortal(
            <div
              style={{
                // Use fixed so the dropdown escapes any local stacking contexts
                position: "fixed",
                right: 24,
                top: 70,
                background: modoClaro ? "var(--card-bg)" : "var(--bg-dark)",
                color: modoClaro ? "var(--text-dark)" : "var(--card-bg)",
                border: "1px solid var(--accent)",
                borderRadius: 8,
                boxShadow: "0 12px 36px rgba(2,6,23,0.25)",
                minWidth: 260,
                zIndex: 40000, // asegurar que quede por encima del cuadro de registro
                padding: 14,
              }}
            >
              {/* If user is logged in show profile + settings, otherwise show login/register CTA */}
              {user ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{user.name || 'Usuario'}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email || user.correo}</div>
                    </div>
                  </div>
                  <hr style={{ margin: '10px 0', borderColor: 'rgba(0,0,0,0.06)' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={goProfile} style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)', background: 'transparent', cursor: 'pointer' }}>Perfil</button>
                    <button onClick={() => navigate('/ajustes')} style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#0b0b0b', cursor: 'pointer' }}>Ajustes</button>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <small style={{ color: 'var(--muted)' }}>Tamaño de texto</small>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setFontSize(s => Math.max(13, s - 1))} style={{ padding: '6px 8px' }}>A-</button>
                        <button onClick={() => setFontSize(s => Math.min(22, s + 1))} style={{ padding: '6px 8px' }}>A+</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <small style={{ color: 'var(--muted)' }}>Tema</small>
                      <button onClick={() => setModoClaro(m => !m)} style={{ padding: '6px 10px', background: 'var(--accent)', borderRadius: 6, border: 'none', cursor: 'pointer' }}>{modoClaro ? 'Modo claro' : 'Modo oscuro'}</button>
                    </div>
                  </div>
                  <hr style={{ margin: '10px 0', borderColor: 'rgba(0,0,0,0.06)' }} />
                  <button onClick={handleLogout} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 6, cursor: 'pointer' }}>Cerrar sesión</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Bienvenido</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 12 }}>Accede a tu cuenta para guardar y continuar tu lectura donde la dejaste.</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={goLogin} style={{ flex: 1, padding: '8px 10px', borderRadius: 6, background: 'var(--accent)', border: 'none', color: '#0b0b0b', fontWeight: 700 }}>Iniciar sesión</button>
                    <button onClick={goRegister} style={{ flex: 1, padding: '8px 10px', borderRadius: 6, background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', fontWeight: 700 }}>Registrarse</button>
                  </div>
                  <hr style={{ margin: '10px 0', borderColor: 'rgba(0,0,0,0.06)' }} />
                  <div style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Fuente</span>
                      <span style={{ fontFamily: 'Oswald, Arial, sans-serif' }}>Oswald</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Tamaño</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setFontSize(s => Math.max(13, s - 1))}>A-</button>
                        <button onClick={() => setFontSize(s => Math.min(22, s + 1))}>A+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>,
            document.body
          )}
        </div>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: 'var(--card-bg)',
  background: 'transparent',
  fontWeight: '700',
  textDecoration: 'none',
  fontSize: '1.05em',
  padding: '0.25em 0.6em',
  borderRadius: '6px',
  transition: 'color 0.14s ease, transform 0.14s ease',
};
