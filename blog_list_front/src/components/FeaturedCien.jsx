import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FeaturedCien({ pdfPath = '/libro1.pdf' }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const renderFirstPage = async () => {
      try {
        const pdfDoc = await pdfjsLib.getDocument({ url: pdfPath }).promise;
        if (!mounted) return;
        const page = await pdfDoc.getPage(1);
        if (!mounted) return;

        const viewport = page.getViewport({ scale: 1.0 });
        const targetWidth = Math.min(360, window.innerWidth * 0.28);
        const scale = Math.min(1.0, targetWidth / viewport.width);
        const scaled = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(scaled.width * outputScale);
        canvas.height = Math.floor(scaled.height * outputScale);
        canvas.style.width = `${Math.floor(scaled.width)}px`;
        canvas.style.height = `${Math.floor(scaled.height)}px`;

        const ctx = canvas.getContext('2d');
        ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        await page.render({ canvasContext: ctx, viewport: scaled }).promise;
        if (mounted) setLoading(false);
      } catch (e) {
        console.error('FeaturedCien render error', e);
        if (mounted) {
          setError('No se pudo cargar la portada.');
          setLoading(false);
        }
      }
    };

    renderFirstPage();

    return () => { mounted = false; };
  }, [pdfPath]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1.4rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: '#00c6ff', marginBottom: '0.6rem' }}>Destacado: Cien años de soledad</h3>
        <div style={{ display: 'inline-block', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,0,0,0.4)' }}>
          {loading && <div style={{ padding: 36, background: '#111', color: '#ffd8b0' }}>Cargando portada…</div>}
          {error && <div style={{ padding: 24, background: '#111', color: '#ff8a8a' }}>{error}</div>}
          <canvas ref={canvasRef} style={{ display: loading || error ? 'none' : 'block', background: '#fff' }} />
        </div>
        <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
          {/* Abrir el PDF directamente en nueva pestaña para carga rápida */}
          <a href="/libro1.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'linear-gradient(90deg,#ff7a00,#ffb347)', color: '#0b0b0b', padding: '0.6rem 1rem', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Leer ahora
            </button>
          </a>
          <a href="/libro/1" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#00c6ff', color: '#0b0b0b', padding: '0.6rem 1rem', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Ver detalles
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
