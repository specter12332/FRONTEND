import React, { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500); // 2.5 segundos
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "linear-gradient(135deg, #00c6ff 0%, #ffb347 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <h1 style={{
        color: "#fff",
        fontSize: "3em",
        fontWeight: "bold",
        letterSpacing: "3px",
        textShadow: "0 4px 24px #222",
        animation: "fadeInDown 1s"
      }}>
        LECTURA INFINITA
      </h1>
      <span style={{
        color: "#222",
        fontSize: "1.3em",
        fontWeight: "bold",
        marginTop: "1em",
        animation: "fadeIn 2s"
      }}>
        Tu universo de libros, conocimiento y aventura
      </span>
      <div style={{
        marginTop: "2em",
        width: "60px",
        height: "6px",
        borderRadius: "3px",
        background: "#fff",
        animation: "loadingBar 2.5s linear"
      }} />
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeIn {
            from { opacity: 0;}
            to { opacity: 1;}
          }
          @keyframes loadingBar {
            0% { width: 0; background: #fff;}
            100% { width: 60px; background: #ffb347;}
          }
        `}
      </style>
    </div>
  );
}