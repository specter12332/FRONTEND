export const librosRepo = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    año: 1967,
    género: "Realismo mágico",
    páginas: 417,
    idioma: "Español",
    editorial: "Editorial Sudamericana",
    portada: "/images/cien_anos_portada.jpg",
    sinopsis:
      "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
    premios: ["Premio Rómulo Gallegos 1972"],
    rating: 4.9,
  // El PDF real está en `public/libro1.pdf`; usar ruta raíz para que pdf.js reciba el archivo
  pdf: "/libro1.pdf"
  },
  {
    id: 2,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    portada: "/images/don_quijote.jpg",
  // Ajustar rutas estáticas a /libro2.pdf si los archivos están en `public/` (o mover los PDFs a /public/pdfs/)
  pdf: "/libro2.pdf",
    // ...
  }
];