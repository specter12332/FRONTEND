import React, { useState, useEffect } from "react";

import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function LectorPDF({ archivo = "/sample.pdf" }) {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [pageTexts, setPageTexts] = useState([]);
  const [lastPage, setLastPage] = useState(() => {
    const saved = localStorage.getItem(`lastPage-${archivo}`);
    return saved ? parseInt(saved, 10) : 1;
  });

  // Cargar y extraer texto del PDF
  useEffect(() => {
    let isMounted = true;
  setLoading(true);
  setError(null);
  setPdf(null);
  setPageTexts([]);
  setNumPages(0);
    pdfjsLib.getDocument(archivo).promise
      .then(async (pdfDoc) => {
        if (!isMounted) return;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        // Extraer texto de cada página
        const texts = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          texts.push(pageText);
        }
        if (isMounted) {
          setPageTexts(texts);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('No se pudo cargar el PDF.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [archivo]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem 1rem',
      background: '#070709',
      minHeight: '100vh'
    }}>
      <style>{`
        /* Load fonts quickly from Google Fonts - move to index.html for production */
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Merriweather:wght@300;700&display=swap');
        .lector-container::-webkit-scrollbar { width: 10px; }
        .lector-container::-webkit-scrollbar-thumb { background: rgba(255,122,0,0.9); border-radius: 8px; }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: 980,
        background: 'linear-gradient(180deg, #0c0f14 0%, #0b0e13 100%)',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(2,6,23,0.6)',
        padding: '2rem',
        color: '#eef6f8',
        border: '1px solid rgba(255,122,0,0.06)'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{
            margin: 0,
            fontFamily: 'Impact, "Bebas Neue", Arial, sans-serif',
            fontSize: '4rem',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#ff7a00',
            textTransform: 'uppercase',
            transform: 'skew(-5deg)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1',
            padding: '20px 0'
          }}>Cien años de soledad</h1>
        </header>

        <div style={{
          display: 'flex',
          gap: '1.6rem'
        }}>
          <main style={{ flex: 1 }}>
            <div 
              className="lector-container" 
              style={{
                maxHeight: '78vh',
                overflowY: 'auto',
                paddingRight: 12,
                WebkitOverflowScrolling: 'touch'
              }}

            >
              {loading && <div style={{ color: '#ffb57f', fontWeight: 700, textAlign: 'center' }}>Cargando libro…</div>}
              {error && <div style={{ color: '#ff6a6a', fontWeight: 700, textAlign: 'center' }}>{error}</div>}
              {!loading && !error && (
                pageTexts.map((text, idx) => (
                  <article key={idx} style={{ marginBottom: '2.4rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.6rem'
                    }}>
                      <h2 style={{
                        fontFamily: 'Merriweather, Georgia, serif',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#ffd8b0',
                      }}>Página {idx + 1}</h2>
                      <button
                        onClick={() => {
                          setLastPage(idx + 1);
                          localStorage.setItem(`lastPage-${archivo}`, idx + 1);
                          alert(`Página ${idx + 1} guardada como marcador`);
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ff7a00',
                          color: '#ff7a00',
                          padding: '0.3rem 0.6rem',
                          borderRadius: 4,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#ff7a00';
                          e.target.style.color = '#0b0b0b';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#ff7a00';
                        }}
                      >
                        Guardar página
                      </button>
                    </div>
                    <div style={{
                      fontFamily: 'Merriweather, Georgia, serif',
                      fontSize: '18px',
                      lineHeight: 1.9,
                      color: '#eef6f8',
                      textAlign: 'justify',
                      hyphens: 'auto'
                    }}>{text}</div>
                  </article>
                ))
              )}
            </div>
          </main>

          {/* Right column: small info / CTA - keeps layout like reference */}
          <aside style={{ width: 260, flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(180deg,#071018,#0b1520)',
              borderRadius: 10,
              padding: '1rem',
              border: '1px solid rgba(255,122,0,0.08)'
            }}>
              <h3 style={{
                margin: 0,
                fontFamily: 'Oswald, Arial, sans-serif',
                fontSize: '1rem',
                color: '#ffb57f'
              }}>Marcador de lectura</h3>
              <div style={{ 
                marginTop: '0.8rem',
                padding: '0.8rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255,122,0,0.2)'
              }}>
                <p style={{ 
                  color: '#cfeff6',
                  fontSize: '0.95rem',
                  marginBottom: '0.8rem'
                }}>
                  {lastPage ? 
                    `Tienes guardada la página ${lastPage}` : 
                    'No has guardado ninguna página.\nUsa el botón "Guardar página" junto al número de página para crear un marcador.'}
                </p>
                {lastPage && (
                  <button onClick={() => {
                    const articles = document.querySelectorAll('article');
                    if (articles[lastPage - 1]) {
                      articles[lastPage - 1].scrollIntoView({ behavior: 'smooth' });
                    }
                  }} style={{
                    width: '100%',
                    background: 'linear-gradient(90deg,#ff7a00,#ffb347)',
                    color: '#0b0b0b',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                    Ir a la página guardada
                  </button>
                )}
              </div>
              <button onClick={() => {
                const container = document.querySelector('.lector-container');
                if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
              }} style={{
                marginTop: '0.8rem',
                width: '100%',
                background: 'linear-gradient(90deg,#ff7a00,#ffb347)',
                color: '#0b0b0b',
                border: 'none',
                padding: '0.6rem',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer'
              }}>Ir al inicio</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

