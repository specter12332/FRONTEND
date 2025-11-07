import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const librosNuevos = [
	{
		id: 1,
		titulo: "Libro 1",
		autor: "Autor 1",
		portada: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
		sinopsis:
			"Sinopsis de Libro 1. Una historia fascinante sobre aventuras y descubrimientos.",
		biografia:
			"Autor 1 es un escritor reconocido por sus novelas de misterio y aventura.",
	},
	{
		id: 2,
		titulo: "Libro 2",
		autor: "Autor 2",
		portada: "https://covers.openlibrary.org/b/id/8108696-L.jpg",
		sinopsis:
			"Sinopsis de Libro 2. Un relato inspirador sobre la superación personal.",
		biografia:
			"Autor 2 ha publicado varios libros motivacionales y es conferencista internacional.",
	},
	{
		id: 3,
		titulo: "Libro 3",
		autor: "Autor 3",
		portada: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
		sinopsis:
			"Sinopsis de Libro 3. Una novela que explora los misterios de la mente humana.",
		biografia:
			"Autor 3 es psicólogo y escritor, especializado en novelas de suspenso psicológico.",
	},
];

// Modal para mostrar detalles del libro
function ModalLibro({ libro, onClose }) {
	if (!libro) return null;
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "rgba(0,0,0,0.45)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 999,
			}}
		>
			<div
				style={{
					background: "#fff",
					borderRadius: "24px",
					boxShadow: "0 8px 32px #00c6ff55",
					padding: "2em",
					maxWidth: "400px",
					width: "90%",
					position: "relative",
					animation: "fadeInUp 0.5s",
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: "16px",
						right: "16px",
						background: "transparent",
						border: "none",
						fontSize: "1.5em",
						cursor: "pointer",
						color: "#00c6ff",
					}}
					aria-label="Cerrar"
				>
					×
				</button>
				<img
					src={libro.portada}
					alt={libro.titulo}
					style={{
						width: "120px",
						height: "170px",
						objectFit: "cover",
						borderRadius: "12px",
						boxShadow: "0 4px 16px #00c6ff44",
						display: "block",
						margin: "0 auto 1em auto",
					}}
				/>
				<h2
					style={{
						textAlign: "center",
						color: "#00c6ff",
						marginBottom: "0.5em",
					}}
				>
					{libro.titulo}
				</h2>
				<h4
					style={{
						textAlign: "center",
						color: "#222",
						marginBottom: "1em",
					}}
				>
					Autor: {libro.autor}
				</h4>
				<div style={{ marginBottom: "1em" }}>
					<strong>Sinopsis:</strong>
					<p
						style={{
							color: "#444",
							margin: "0.5em 0",
						}}
					>
						{libro.sinopsis}
					</p>
				</div>
				<div style={{ marginBottom: "1em" }}>
					<strong>Biografía del autor:</strong>
					<p
						style={{
							color: "#444",
							margin: "0.5em 0",
						}}
					>
						{libro.biografia}
					</p>
				</div>
				<button
					style={{
						background:
							"linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
						color: "#222",
						fontWeight: "bold",
						fontSize: "1.1em",
						padding: "0.7em 2em",
						border: "none",
						borderRadius: "12px",
						cursor: "pointer",
						boxShadow: "0 2px 8px #00c6ff44",
					}}
					onClick={() =>
						(window.location.href = `/libro/${libro.id}/leer`)
					}
				>
					Comenzar a leer
				</button>
				<style>
					{`
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(40px);}
              100% { opacity: 1; transform: translateY(0);}
            }
          `}
				</style>
			</div>
		</div>
	);
}

// Título con animación de gradiente y entrada suave
const TituloLibrosNuevos = ({ modoClaro }) => (
	<div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "1.6em" }}>
		<h2
			className="titulo-nuevo-libro"
			style={{
				fontSize: "2.2em",
				fontWeight: 600,
				letterSpacing: "0.6px",
				textAlign: "center",
				margin: 0,
				padding: "0.15em 0.6em",
				borderRadius: "8px",
				boxShadow: "none",
				backdropFilter: "none",
				animation: "fadeInUp 0.9s",
				fontFamily: 'PlayfairDisplay, Georgia, serif',
				color: modoClaro ? '#0b2b3a' : '#072a40',
			}}
		>
			Nuevas lecturas seleccionadas
		</h2>
		<style>
			{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px);} 
          100% { opacity: 1; transform: translateY(0);} 
        }
        .titulo-nuevo-libro {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}
		</style>
	</div>
);

// Tarjetas con animación de entrada y hover suave
// Galería izquierda + panel derecho (diseño tipo 'feature card')
const renderSeccionPrincipal = (onPortadaClick, modoClaro) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '2rem',
    alignItems: 'start',
    width: '100%',
    maxWidth: 1100,
    margin: '0 auto 2rem',
    padding: '1rem',
  }}>
    {/* Galería izquierda */}
    <div style={{ position: 'relative', minHeight: 320 }}>
			<div style={{
				position: 'absolute',
				inset: 0,
				borderRadius: 20,
				overflow: 'hidden',
				boxShadow: '0 12px 48px rgba(2,6,23,0.45)',
				zIndex: 0
			}}>
				{/* Imagen de fondo grande (blur ligero). Si no hay portada, usar degradado de respaldo */}
				<div style={{
					width: '100%',
					height: '100%',
					background: librosNuevos[0] && librosNuevos[0].portada
						? `url(${librosNuevos[0].portada}) center/cover no-repeat`
						: 'linear-gradient(135deg,#eef2f6,#dbeafe) ',
					filter: 'blur(3px) brightness(0.75)'
				}} />
			</div>
			<div style={{
				position: 'relative',
				display: 'flex',
				gap: '1.6rem',
				padding: '2rem',
				zIndex: 1,
				alignItems: 'center',
				justifyContent: 'center'
			}}>
        {librosNuevos.map((libro, idx) => (
					<div key={libro.id} onClick={() => onPortadaClick(libro)} style={{
            width: 140,
            cursor: 'pointer',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 30px rgba(2,6,23,0.35)',
            transition: 'transform 0.28s, box-shadow 0.28s',
            textAlign: 'center',
          }}>
						<img src={libro.portada} alt={libro.titulo} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} onError={(e)=>{e.currentTarget.style.opacity=0.9}} />
            <div style={{ padding: '0.6rem' }}>
              <div style={{ fontWeight: 700, color: '#072a40' }}>{libro.titulo}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{libro.autor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Panel derecho: feature card */}
    <aside style={{
      background: modoClaro ? '#fff' : 'linear-gradient(180deg,#0b2430,#071726)',
      color: modoClaro ? '#072a40' : '#e6f7ff',
      borderRadius: 16,
      padding: '1.4rem',
      boxShadow: '0 12px 40px rgba(2,6,23,0.35)',
      alignSelf: 'start'
    }}>
      <h3 style={{ margin: 0, fontFamily: 'PlayfairDisplay, Georgia, serif', fontSize: '1.4rem' }}>Lectura recomendada</h3>
      <p style={{ marginTop: '0.6rem', color: modoClaro ? '#334155' : '#cfefff' }}>Seleccionamos para ti una lectura destacada cada semana. Haz clic en la portada para abrir el libro y empezar a leer.</p>
      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', alignItems: 'center' }}>
        <img src={librosNuevos[0].portada} alt="destacado" style={{ width: 72, height: 100, objectFit: 'cover', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }} />
        <div>
          <div style={{ fontWeight: 700 }}>{librosNuevos[0].titulo}</div>
          <div style={{ color: modoClaro ? '#475569' : '#cfefff' }}>{librosNuevos[0].autor}</div>
          <div style={{ marginTop: '0.6rem' }}>
            <button onClick={() => window.location.href = `/libro/${librosNuevos[0].id}/leer`} style={{
              background: 'linear-gradient(90deg,#00c6ff,#0066a3)',
              color: '#fff',
              padding: '0.6rem 1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700
            }}>Comenzar a leer</button>
          </div>
        </div>
      </div>
    </aside>
	</div>
);

export default function NuevoLibro({ modoClaro, usuario }) {
	const [titulo, setTitulo] = useState("");
	const [autor, setAutor] = useState("");
	const [portada, setPortada] = useState("");
	const [nuevo, setNuevo] = useState(false);
	const [libroSeleccionado, setLibroSeleccionado] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setNuevo(true);
	};

	const handlePortadaClick = (libro) => {
		setLibroSeleccionado(libro);
	};

	const handleCloseModal = () => {
		setLibroSeleccionado(null);
	};

	if (usuario.rol === "admin") {
		return (
			<div
				style={{
					minHeight: "80vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-start",
					paddingTop: "60px",
				}}
			>
				<h2
					style={{
						color: modoClaro ? "#222" : "#00c6ff",
						fontSize: "2em",
						marginBottom: "1.5em",
					}}
				>
					Agrega un Nuevo Libro
				</h2>
				<form
					className="mt-6 space-y-4 max-w-md"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						placeholder="Título"
						className="w-full p-2 bg-[#202123] border border-gray-600 rounded"
						value={titulo}
						onChange={(e) => setTitulo(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Autor"
						className="w-full p-2 bg-[#202123] border border-gray-600 rounded"
						value={autor}
						onChange={(e) => setAutor(e.target.value)}
						required
					/>
					<input
						type="url"
						placeholder="URL de la portada"
						className="w-full p-2 bg-[#202123] border border-gray-600 rounded"
						value={portada}
						onChange={(e) => setPortada(e.target.value)}
						required
					/>
					<button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
						Guardar
					</button>
				</form>
				{nuevo && (
					<div className="mt-6 text-center">
						<p className="text-green-400 font-bold mb-2">
							¡Libro nuevo agregado!
						</p>
						{portada && (
							<img
								src={portada}
								alt="Portada del libro"
								style={{
									maxWidth: 200,
									margin: "0 auto",
									borderRadius: 8,
								}}
							/>
						)}
					</div>
				)}
				<TituloLibrosNuevos modoClaro={modoClaro} />
				{renderSeccionPrincipal(handlePortadaClick, modoClaro)}
				<ModalLibro libro={libroSeleccionado} onClose={handleCloseModal} />
			</div>
		);
	}

	// Usuario: solo ve la lista de libros nuevos con portada y etiqueta "New"
	return (
		<div
			style={{
				minHeight: "80vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				paddingTop: "60px",
			}}
		>
			<TituloLibrosNuevos modoClaro={modoClaro} />
			{renderSeccionPrincipal(handlePortadaClick, modoClaro)}
			<ModalLibro libro={libroSeleccionado} onClose={handleCloseModal} />
		</div>
	);
}
