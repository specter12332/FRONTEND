import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const portadas = [
  "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  "https://covers.openlibrary.org/b/id/8108696-L.jpg",
  "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  "https://covers.openlibrary.org/b/id/8235112-L.jpg",
  "https://covers.openlibrary.org/b/id/10523382-L.jpg"
];

function FeatureBox({ color, bg, icon, text }) {
  return (
    <div style={{
      background: bg,
      borderRadius: "10px",
      padding: "0.7em",
      minWidth: "140px",
      maxWidth: "180px",
      color: color,
      fontWeight: "bold",
      boxShadow: `0 2px 8px ${bg}`,
      fontSize: "0.95em",
      display: "flex",
      alignItems: "center",
      gap: "0.5em",
      transition: "transform 0.2s",
      cursor: "default",
      border: `2px solid ${color}`,
      marginBottom: "1em",
      justifyContent: "center"
    }}>
      <span style={{ fontSize: "1.3em" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function CarruselPortadas() {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActual(a => (a + 1) % portadas.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "2em",
      marginTop: "-2em",
      minHeight: "180px"
    }}>
      {portadas.map((url, idx) => (
        <img
          key={url}
          src={url}
          alt={`Libro ${idx + 1}`}
          style={{
            width: idx === actual ? "140px" : "90px",
            height: idx === actual ? "180px" : "110px",
            objectFit: "cover",
            borderRadius: "16px",
            boxShadow: idx === actual ? "0 8px 32px #00c6ff88" : "0 2px 12px #2228",
            border: idx === actual ? "4px solid #ffb347" : "2px solid #00c6ff",
            margin: "0 1em",
            opacity: idx === actual ? 1 : 0.5,
            transition: "all 0.6s cubic-bezier(.4,0,.2,1)"
          }}
        />
      ))}
    </div>
  );
}

export default function Inicio({ modoClaro, setModoClaro }) {
  const navigate = useNavigate();
  // Imagen de librería (puedes cambiar la URL por la que prefieras)
  const imagenLibreria = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80";
  const fondo = `url('${imagenLibreria}')`;
  const overlay = modoClaro
    ? "rgba(255,255,255,0.85)"
    : "rgba(34,36,38,0.85)";
  const colorTitulo = modoClaro ? "#222" : "#00c6ff";
  const colorSub = "#ffb347";
  const colorBox = modoClaro ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.04)";
  const colorText = modoClaro ? "#222" : "#fff";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: fondo,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "80px"
      }}
    >
      {/* Overlay para que la imagen no obstaculice el contenido */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
          backdropFilter: "blur(2px)",
          zIndex: 1,
          transition: "background 0.5s"
        }}
      />
      {/* Botón para ir a registro, más centrado en la pantalla */}
      <div
        style={{
          position: "fixed",
          top: "50%", // Cambia este valor
          right: "50px",
          transform: "translateY(-50%) translateX(-10%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2em",
          background: modoClaro
            ? "linear-gradient(135deg, #fffde4 0%, #e0f7fa 100%)"
            : "linear-gradient(135deg, #222 0%, #444 100%)",
          borderRadius: "20px",
          boxShadow: "0 6px 32px #00c6ff44",
          padding: "2.5em 2.5em",
          minWidth: "340px",
          maxWidth: "400px",
          border: "2.5px solid #00c6ff"
        }}
      >
        <span style={{
          color: "#00c6ff",
          fontWeight: "bold",
          fontSize: "1.45em",
          marginBottom: "0.4em",
          textAlign: "center",
          letterSpacing: "1px"
        }}>
          ¿Aún no tienes cuenta?
        </span>
        <span style={{
          color: modoClaro ? "#222" : "#fff",
          fontSize: "1.13em",
          textAlign: "center",
          marginBottom: "0.7em",
          lineHeight: 1.5
        }}>
          <strong>¡Únete a Lectura Infinita!</strong><br />
          Regístrate gratis y podrás:<br />
          <ul style={{
            textAlign: "left",
            margin: "1em auto 1em auto",
            paddingLeft: "1.2em",
            color: modoClaro ? "#222" : "#fff",
            fontSize: "1em"
          }}>
            <li>Guardar y organizar tu biblioteca digital</li>
            <li>Acceder a recursos y pruebas literarias</li>
            <li>Agregar y compartir tus libros favoritos</li>
            <li>Personalizar tu experiencia de lectura</li>
          </ul>
          <span style={{ color: "#00c6ff", fontWeight: "bold" }}>
            ¡Empieza tu aventura literaria ahora!
          </span>
        </span>
        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
            color: "#222",
            fontWeight: "bold",
            border: "none",
            fontSize: "1.15em",
            textAlign: "center",
            textDecoration: "none",
            boxShadow: "0 2px 12px #00c6ff44",
            cursor: "pointer",
            marginTop: "0.5em",
            letterSpacing: "1px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0 4px 16px #00c6ff66";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 12px #00c6ff44";
          }}
        >
          Registrarse
        </button>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "60px", // Puedes ajustar este valor
          width: "100%",
          maxWidth: "1300px", // antes: 1100px
          height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 2em"
        }}
      >
        <CarruselPortadas />
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.8em", // antes: 2.3em
            color: colorTitulo,
            textAlign: "center",
            letterSpacing: "3px",
            marginBottom: "0.3em", // más espacio
            textShadow: modoClaro ? "none" : "0 4px 24px #222",
            animation: "fadeInDown 1s",
            transition: "color 0.5s"
          }}
        >
          LECTURA INFINITA
        </h1>
        <span
          style={{
            display: "block",
            fontSize: "1.25em", // antes: 1.1em
            color: colorSub,
            fontWeight: "bold",
            marginBottom: "1.2em",
            textAlign: "center",
            letterSpacing: "1px",
            textShadow: modoClaro ? "none" : "0 2px 8px #222",
            animation: "fadeIn 1.5s",
            transition: "color 0.5s"
          }}
        >
          Tu universo de libros, conocimiento y aventura
        </span>
        <hr style={{
          width: "80px", // antes: 60px
          border: "3px solid #00c6ff", // antes: 2px
          marginBottom: "1.2em",
          borderRadius: "2px",
          opacity: 0.7
        }} />
        {/* FeatureBoxes en grid 2x2, más grandes */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "1.8em 2.5em", // más espacio
          marginBottom: "1.2em",
          maxWidth: 650, // antes: 500
          width: "100%",
          justifyItems: "center",
          alignItems: "center"
        }}>
          <div>
            <FeatureBox
              color="#00c6ff"
              bg="rgba(0,198,255,0.15)"
              icon="📚"
              text="Explora y busca libros por título, autor o género."
            />
          </div>
          <div>
            <FeatureBox
              color="#ffb347"
              bg="rgba(255,179,71,0.15)"
              icon="➕"
              text="Agrega nuevas obras a tu biblioteca personal."
            />
          </div>
          <div>
            <FeatureBox
              color="#00ffc6"
              bg="rgba(0,255,198,0.15)"
              icon="🗂️"
              text="Gestiona y organiza tu biblioteca digital."
            />
          </div>
          <div>
            <FeatureBox
              color="#ff47b3"
              bg="rgba(255,71,179,0.15)"
              icon="📝"
              text="Accede a recursos interactivos y pruebas literarias."
            />
          </div>
        </div>
        <hr style={{
          width: "80px", // antes: 60px
          border: "3px solid #ffb347", // antes: 2px
          marginBottom: "1em",
          borderRadius: "2px",
          opacity: 0.7
        }} />
        <p
          style={{
            color: colorText,
            fontSize: "1.18em", // antes: 1em
            textAlign: "center",
            marginBottom: "0.7em",
            maxWidth: 700, // antes: 600
            textShadow: modoClaro ? "none" : "0 1px 4px #222",
            lineHeight: 1.6,
            animation: "fadeInUp 1.5s",
          }}
        >
          <strong>LECTURA INFINITA</strong> es tu compañero en el viaje literario.<br />
          Descubre nuevas historias, reflexiona y comparte tu pasión por los libros.<br />
          <span style={{ color: "#ffb347", fontWeight: "bold" }}>
            ¡Empieza tu aventura hoy!
          </span>
        </p>
      </div>
      {/* Botón modo claro/oscuro en la esquina inferior derecha */}
      <button
        onClick={() => setModoClaro(m => !m)}
        style={{
          position: "fixed",
          right: "30px",
          bottom: "30px",
          background: modoClaro ? "#222" : "#fffde4",
          color: modoClaro ? "#fffde4" : "#222",
          border: "none",
          borderRadius: "50%",
          width: "54px",
          height: "54px",
          boxShadow: "0 2px 12px #2228",
          cursor: "pointer",
          fontSize: "2em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200
        }}
        title={modoClaro ? "Modo oscuro" : "Modo claro"}
      >
        {modoClaro ? "🌙" : "☀️"}
      </button>
      {/* Animaciones CSS */}
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeIn {
            from { opacity: 0;}
            to { opacity: 1;}
          }
          @keyframes pulse {
            0% { box-shadow: 0 4px 16px rgba(0,0,0,0.18);}
            50% { box-shadow: 0 8px 32px rgba(0,198,255,0.25);}
            100% { box-shadow: 0 4px 16px rgba(0,0,0,0.18);}
          }
        `}
      </style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "1em",
  fontWeight: "bold",
  fontSize: "1.1em",
  boxShadow: "0 2px 8px #00c6ff22"
};