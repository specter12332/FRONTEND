import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const librosRepo = [
	{
		id: 1,
		titulo: "Cien años de soledad",
		autor: "Gabriel García Márquez",
		portada: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
		nuevo: false,
	},
	{
		id: 2,
		titulo: "El principito",
		autor: "Antoine de Saint-Exupéry",
		portada: "https://covers.openlibrary.org/b/id/8108696-L.jpg",
		nuevo: false,
	},
	{
		id: 3,
		titulo: "Don Quijote de la Mancha",
		autor: "Miguel de Cervantes",
		portada: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
		nuevo: false,
	},
	{
		id: 4,
		titulo: "Rayuela",
		autor: "Julio Cortázar",
		portada: "https://covers.openlibrary.org/b/id/8235112-L.jpg",
		nuevo: true,
	},
	{
		id: 5,
		titulo: "New England Recipes",
		autor: "Autor desconocido",
		portada: "https://covers.openlibrary.org/b/id/8235113-L.jpg",
		nuevo: true,
	},
];

export default function BuscarLibros() {
	const [busqueda, setBusqueda] = useState("");

	const librosFiltrados = librosRepo.filter(libro =>
		libro.titulo.toLowerCase().includes(busqueda.toLowerCase())
	);

	return (
		<div
			style={{
				minHeight: "80vh",
				padding: "2em 0",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				background: "transparent",
			}}
		>
			<h1
				style={{
					color: "#00c6ff",
					fontWeight: "bold",
					fontSize: "2em",
					marginBottom: "0.7em",
					letterSpacing: "1px",
				}}
			>
				Buscar Libros
			</h1>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.5em",
					marginBottom: "2em",
				}}
			>
				<input
					type="text"
					placeholder="Buscar por título..."
					value={busqueda}
					onChange={e => setBusqueda(e.target.value)}
					style={{
						padding: "0.8em 1em",
						borderRadius: "8px",
						border: "2px solid #00c6ff",
						fontSize: "1.1em",
						minWidth: "260px",
						outline: "none",
					}}
				/>
				<FaSearch style={{ color: "#00c6ff", fontSize: "1.5em" }} />
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "2em",
					width: "100%",
					maxWidth: "1200px",
					justifyItems: "center",
				}}
			>
				{librosFiltrados.map(libro => (
					<div
						key={libro.id}
						style={{
							background: "#003366",
							borderRadius: "18px",
							boxShadow: "0 4px 16px #00c6ff44",
							padding: "2em 1em 1.5em 1em",
							textAlign: "center",
							position: "relative",
							width: "300px",
							minHeight: "420px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "flex-start",
						}}
					>
						<div style={{ position: "relative", marginBottom: "1em" }}>
							<img
								src={libro.portada}
								alt={libro.titulo}
								style={{
									width: "140px",
									height: "200px",
									objectFit: "cover",
									borderRadius: "10px",
									boxShadow: "0 2px 8px #00c6ff44",
								}}
							/>
							{libro.nuevo && (
								<span
									style={{
										position: "absolute",
										top: "8px",
										left: "8px",
										background:
											"linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
										color: "#222",
										fontWeight: "bold",
										fontSize: "1em",
										padding: "4px 12px",
										borderRadius: "8px",
										boxShadow: "0 2px 8px #00c6ff44",
									}}
								>
									New
								</span>
							)}
						</div>
						<h2
							style={{
								color: "#00c6ff",
								fontWeight: "bold",
								fontSize: "1.3em",
								marginBottom: "0.3em",
							}}
						>
							{libro.titulo}
						</h2>
						<p
							style={{
								color: "#fff",
								fontSize: "1.1em",
								marginBottom: "1.2em",
							}}
						>
							{libro.autor}
						</p>
						<a
							href={`/libro/${libro.id}`}
							style={{
								display: "inline-block",
								marginTop: "auto",
								padding: "12px 38px",
								borderRadius: "10px",
								fontWeight: "bold",
								fontSize: "1.15em",
								background:
									"linear-gradient(90deg, #00c6ff 0%, #ffb347 100%)",
								color: "#222",
								textDecoration: "none",
								boxShadow: "0 2px 8px #00c6ff44",
								letterSpacing: "1px",
								border: "none",
								cursor: "pointer",
								transition:
									"transform 0.2s, box-shadow 0.2s",
							}}
							onMouseOver={e => {
								e.currentTarget.style.transform = "scale(1.07)";
								e.currentTarget.style.boxShadow = "0 4px 16px #ffb347";
							}}
							onMouseOut={e => {
								e.currentTarget.style.transform = "scale(1)";
								e.currentTarget.style.boxShadow = "0 2px 8px #00c6ff44";
							}}
						>
							📖 Leer
						</a>
					</div>
				))}
				{librosFiltrados.length === 0 && (
					<p
						style={{
							color: "#00c6ff",
							gridColumn: "1/-1",
							textAlign: "center",
						}}
					>
						No se encontraron libros.
					</p>
				)}
			</div>
		</div>
	);
}
