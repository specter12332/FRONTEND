import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useLibros } from "../hooks/useLibros";

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
function ModalLibro({ libro, onClose, navigate }) {
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
					onClick={() => navigate(`/libro/${libro.id}/leer`)}
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
const renderSeccionPrincipal = (onPortadaClick, modoClaro, librosActuales, navigate) => (
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
					background: librosActuales[0] && librosActuales[0].portada
						? `url(${librosActuales[0].portada}) center/cover no-repeat`
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
        {librosActuales && librosActuales.map((libro, idx) => (
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
        {librosActuales && librosActuales[0] && (
          <>
            <img src={librosActuales[0].portada} alt="destacado" style={{ width: 72, height: 100, objectFit: 'cover', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }} />
            <div>
              <div style={{ fontWeight: 700 }}>{librosActuales[0].titulo}</div>
              <div style={{ color: modoClaro ? '#475569' : '#cfefff' }}>{librosActuales[0].autor}</div>
              <div style={{ marginTop: '0.6rem' }}>
                <button onClick={() => navigate(`/libro/${librosActuales[0].id}/leer`)} style={{
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
          </>
        )}
      </div>
    </aside>
  </div>
);

export default function NuevoLibro({ modoClaro }) {
	const { user } = useContext(UserContext);
	const { agregarLibro, libros, obtenerLibro } = useLibros();
	const [librosActuales, setLibrosActuales] = useState([]);
	
	useEffect(() => {
		setLibrosActuales(libros);
	}, [libros]);
	const [titulo, setTitulo] = useState("");
	const [autor, setAutor] = useState("");
	const [portada, setPortada] = useState("");
	const [sinopsis, setSinopsis] = useState("");
	const [nuevo, setNuevo] = useState(false);
	const [libroSeleccionado, setLibroSeleccionado] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const nuevoLibro = {
			titulo: titulo,
			autor: autor,
			portada: portada,
			sinopsis: sinopsis,
			biografia: `Obra de ${autor}.`
		};
 		// add the book and get the created record back so we can show it immediately
 		const creado = agregarLibro(nuevoLibro);
 		// ensure local UI reflects the newly added book immediately
 		setLibrosActuales(prev => [creado, ...prev]);
 		setLibroSeleccionado(creado);
 		setNuevo(true);

 		// Limpiar el formulario después de un pequeño delay y mantener la selección breve
 		setTimeout(() => {
 			setTitulo("");
 			setAutor("");
 			setPortada("");
 			setSinopsis("");
 			setNuevo(false);
 			// cerrar modal automático opcional: comentar si no se desea
 			// setLibroSeleccionado(null);
 		}, 3000);
	};

	const handlePortadaClick = (libro) => {
		setLibroSeleccionado(libro);
	};

	const handleCloseModal = () => {
		setLibroSeleccionado(null);
	};

	if (user && user.role === "admin") {
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
					style={{
						background: modoClaro ? '#fff' : 'linear-gradient(180deg,#0b2430,#071726)',
						padding: '2rem',
						borderRadius: '16px',
						boxShadow: '0 12px 40px rgba(2,6,23,0.35)',
						width: '100%',
						maxWidth: '500px',
						marginBottom: '2rem'
					}}
					onSubmit={handleSubmit}
				>
					<div style={{ marginBottom: '1.5rem' }}>
						<input
							type="text"
							placeholder="Título del libro"
							value={titulo}
							onChange={(e) => setTitulo(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.8rem 1rem',
								borderRadius: '8px',
								border: '1px solid',
								borderColor: modoClaro ? 'rgba(0,198,255,0.3)' : 'rgba(0,198,255,0.2)',
								background: modoClaro ? '#fff' : 'rgba(11,36,48,0.8)',
								color: modoClaro ? '#072a40' : '#e6f7ff',
								fontSize: '1rem',
								marginBottom: '1rem'
							}}
						/>
						<input
							type="text"
							placeholder="Autor"
							value={autor}
							onChange={(e) => setAutor(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.8rem 1rem',
								borderRadius: '8px',
								border: '1px solid',
								borderColor: modoClaro ? 'rgba(0,198,255,0.3)' : 'rgba(0,198,255,0.2)',
								background: modoClaro ? '#fff' : 'rgba(11,36,48,0.8)',
								color: modoClaro ? '#072a40' : '#e6f7ff',
								fontSize: '1rem',
								marginBottom: '1rem'
							}}
						/>
							<input
							type="url"
							placeholder="URL de la portada"
							value={portada}
							onChange={(e) => setPortada(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.8rem 1rem',
								borderRadius: '8px',
								border: '1px solid',
								borderColor: modoClaro ? 'rgba(0,198,255,0.3)' : 'rgba(0,198,255,0.2)',
								background: modoClaro ? '#fff' : 'rgba(11,36,48,0.8)',
								color: modoClaro ? '#072a40' : '#e6f7ff',
								fontSize: '1rem',
								marginBottom: '1rem'
							}}
						/>
						<textarea
							placeholder="Sinopsis del libro"
							value={sinopsis}
							onChange={(e) => setSinopsis(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.8rem 1rem',
								borderRadius: '8px',
								border: '1px solid',
								borderColor: modoClaro ? 'rgba(0,198,255,0.3)' : 'rgba(0,198,255,0.2)',
								background: modoClaro ? '#fff' : 'rgba(11,36,48,0.8)',
								color: modoClaro ? '#072a40' : '#e6f7ff',
								fontSize: '1rem',
								minHeight: '120px',
								resize: 'vertical',
								fontFamily: 'inherit'
							}}
						/>
					</div>
					<button
						type="submit"
						style={{
							background: 'linear-gradient(90deg,#00c6ff,#0066a3)',
							color: '#fff',
							padding: '0.8rem 2rem',
							borderRadius: '8px',
							border: 'none',
							cursor: 'pointer',
							fontWeight: '600',
							width: '100%',
							fontSize: '1rem',
							transition: 'transform 0.2s, box-shadow 0.2s'
						}}
						onMouseOver={(e) => {
							e.target.style.transform = 'translateY(-2px)';
							e.target.style.boxShadow = '0 6px 20px rgba(0,198,255,0.4)';
						}}
						onMouseOut={(e) => {
							e.target.style.transform = 'translateY(0)';
							e.target.style.boxShadow = 'none';
						}}
					>
						Agregar Libro
					</button>
				</form>
				{nuevo && (
					<div style={{
						background: modoClaro ? '#fff' : 'linear-gradient(180deg,#0b2430,#071726)',
						padding: '2rem',
						borderRadius: '16px',
						boxShadow: '0 12px 40px rgba(2,6,23,0.35)',
						width: '100%',
						maxWidth: '500px',
						textAlign: 'center',
						animation: 'fadeInUp 0.5s'
					}}>
						<h3 style={{
							color: '#00c6ff',
							marginBottom: '1rem',
							fontSize: '1.2rem'
						}}>
							¡Libro agregado exitosamente!
						</h3>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '1.5rem',
							padding: '1rem',
							background: 'rgba(0,198,255,0.1)',
							borderRadius: '12px'
						}}>
							<img
								src={portada}
								alt={titulo}
								style={{
									width: '120px',
									height: '160px',
									objectFit: 'cover',
									borderRadius: '8px',
									boxShadow: '0 8px 24px rgba(0,198,255,0.2)'
								}}
							/>
							<div style={{ textAlign: 'left' }}>
								<h4 style={{
									color: modoClaro ? '#072a40' : '#e6f7ff',
									marginBottom: '0.5rem',
									fontSize: '1.1rem'
								}}>{titulo}</h4>
								<p style={{
									color: modoClaro ? '#475569' : '#cfefff'
								}}>{autor}</p>
							</div>
						</div>
					</div>
				)}
				<TituloLibrosNuevos modoClaro={modoClaro} />
				{renderSeccionPrincipal(handlePortadaClick, modoClaro, librosActuales, navigate)}
				<ModalLibro libro={libroSeleccionado} onClose={handleCloseModal} navigate={navigate} />
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
			{renderSeccionPrincipal(handlePortadaClick, modoClaro, librosActuales, navigate)}
			<ModalLibro libro={libroSeleccionado} onClose={handleCloseModal} navigate={navigate} />
		</div>
	);
}