import React, { useState, useEffect } from "react";
import './LectorPDF.css';

import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// Debug flag (set true when you need verbose logs)
const pdfDebug = false;
if (pdfDebug) {
  console.log('PDF.js worker configured');
  window.pdfjsLib = pdfjsLib;
}

export default function LectorPDF({ archivo = "/libro1.pdf", useIframe = false }) {
  // Usar el archivo proporcionado directamente
  const pdfFile = archivo;
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [pageTexts, setPageTexts] = useState([]);
  const [renderCanvas, setRenderCanvas] = useState(false);
  const [fallbackViewer, setFallbackViewer] = useState(false);
  const [fileStatus, setFileStatus] = useState(null);
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
    setFallbackViewer(false); // Reset fallback state

    // Asegurarse de que la ruta es absoluta y relativa a /public
    const pdfPath = archivo.startsWith('/') ? archivo : `/${archivo}`;
    if (useIframe) {
      // If caller requests iframe viewer (for files that pdf.js can't handle), test file accessibility then enable fallback
      try {
        fetch(archivo, { method: 'HEAD' })
          .then(res => {
            if (!isMounted) return;
            setFileStatus(res.status);
            setFallbackViewer(true);
            setLoading(false);
          })
          .catch(err => {
            console.error('LectorPDF: HEAD fetch failed', err);
            if (!isMounted) return;
            setFileStatus('error');
            setFallbackViewer(true);
            setLoading(false);
          });
      } catch (e) {
        console.error('LectorPDF: unexpected error testing file', e);
        if (isMounted) {
          setFileStatus('error');
          setFallbackViewer(true);
          setLoading(false);
        }
      }
      return;
    }
    pdfjsLib.getDocument({
      url: pdfPath,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.196/cmaps/',
      cMapPacked: true,
      enableXfa: true,
      useWorkerFetch: true,
      withCredentials: true,
      password: '', // Para PDFs protegidos sin contraseña
    }).promise.then(async (pdfDoc) => {
        if (!isMounted) return;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setError(null); // Clear any previous errors
        // Extraer texto de cada página. Usar normalizeWhitespace para mejorar espacios y guiones.
        const texts = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });
          
          // Try to extract text with enhanced options
          const content = await page.getTextContent({
            normalizeWhitespace: true,
            disableCombineTextItems: false,
            includeMarkedContent: true
          });
          
          // Map items preserving some layout
          const pageText = content.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          texts.push(pageText);
        }
        if (isMounted) {
          setPageTexts(texts);
          // If extraction produced no meaningful text, render pages as canvases (useful for scanned PDFs)
          const hasText = texts.some(t => t && t.toString().trim().length > 10);
          if (!hasText) {
            console.warn('LectorPDF: text extraction returned empty content, rendering pages as canvases');
            setRenderCanvas(true);
            // Do not set fallbackViewer here; we can render the pages via pdf.js even if text extraction failed.
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('LectorPDF: error loading PDF', err);
        if (isMounted) {
          // show detailed error to help debugging and enable fallback viewer
          setError(`No se pudo cargar el PDF: ${err && err.message ? err.message : String(err)}`);
          // test file accessibility before enabling fallback
          fetch(archivo, { method: 'HEAD' })
            .then(res => {
                if (pdfDebug) console.log('LectorPDF: HEAD on error', archivo, res.status);
              if (!isMounted) return;
              setFileStatus(res.status);
              setFallbackViewer(true);
              setLoading(false);
            })
            .catch(fetchErr => {
              console.error('LectorPDF: HEAD fetch failed on error', fetchErr);
              if (!isMounted) return;
              setFileStatus('error');
              setFallbackViewer(true);
              setLoading(false);
            });
        }
      });
    return () => { isMounted = false; };
  }, [archivo, useIframe]);

  // Cuando debemos renderizar como canvas (scanned/encrypted PDFs), dibujar cada página
  useEffect(() => {
    if (!pdf || !renderCanvas) return;
    let cancelled = false;

    const renderAllPages = async () => {
      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return;
        try {
          const page = await pdf.getPage(i);
          const canvasId = `pdf-canvas-${encodeURIComponent(archivo)}-${i}`;
          const canvas = document.getElementById(canvasId);
          if (!canvas) continue;

          // Calculate scale to fit the available width while honoring devicePixelRatio
          const parent = canvas.parentElement || canvas;
          const availableWidth = Math.max(300, parent.clientWidth || 800);
          const unscaledViewport = page.getViewport({ scale: 1.0 });
          const scale = Math.min(availableWidth / unscaledViewport.width, 2.0);
          const viewport = page.getViewport({ scale });

          const outputScale = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          const ctx = canvas.getContext('2d');
          ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        } catch (e) {
          if (pdfDebug) console.error('Canvas render error for page', i, e);
        }
      }
    };

    renderAllPages();
    return () => { cancelled = true; };
  }, [pdf, renderCanvas, archivo]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem 1rem',
      background: '#070709',
      minHeight: '100vh'
    }}>

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
          <main className="lector-main">
            <div 
              className="lector-container" 
              style={{
                paddingRight: 8,
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none'
              }}

            >
              {loading && <div style={{ color: '#ffb57f', fontWeight: 700, textAlign: 'center' }}>Cargando libro…</div>}
              {error && <div style={{ color: '#ff6a6a', fontWeight: 700, textAlign: 'center' }}>{error}</div>}
              {fallbackViewer && (
                <div style={{ width: '100%', height: '70vh', background: '#000', display: 'flex', alignItems: 'stretch' }}>
                  {/* Renderizar iframe si parece un PDF; no depender únicamente del HEAD (puede fallar por CORS localmente) */}
                  {archivo && String(archivo).toLowerCase().endsWith('.pdf') ? (
                    <iframe title="PDF fallback" src={archivo} style={{ width: '100%', height: '100%', border: 'none' }} />
                  ) : (
                    <div style={{ padding: 20, color: '#ffd8b0' }}>
                      <p><strong>No se pudo mostrar el PDF directamente.</strong></p>
                      <p>Estado del archivo: {String(fileStatus)}</p>
                      <p>Puedes abrir el PDF en una nueva pestaña para comprobar si está disponible:</p>
                      <p>
                        <a href={archivo} target="_blank" rel="noopener noreferrer" style={{ color: '#ffb347', background: '#0b0b0b', padding: '0.4rem 0.6rem', borderRadius: 6, textDecoration: 'none' }}>Abrir {archivo}</a>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {!loading && !error && !fallbackViewer && (
                (
                  renderCanvas ? (
                    // Render pages as canvases inside articles so scrolling/guardado funciona
                    Array.from({ length: numPages }).map((_, idx) => (
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
                          >
                            Guardar página
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <canvas id={`pdf-canvas-${encodeURIComponent(archivo)}-${idx+1}`} style={{ maxWidth: '100%', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }} />
                        </div>
                      </article>
                    ))
                  ) : (
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
                          hyphens: 'none',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility',
                          fontVariantLigatures: 'common-ligatures',
                          letterSpacing: '0.01em'
                        }}>{text}</div>
                      </article>
                    ))
                  )
                )
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

