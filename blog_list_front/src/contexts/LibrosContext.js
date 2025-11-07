import React, { createContext, useState, useEffect } from 'react';

const LibrosContext = createContext();

const librosIniciales = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    portada: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    sinopsis: "Una historia épica de la familia Buendía a lo largo de siete generaciones en el pueblo mítico de Macondo.",
    biografia: "Gabriel García Márquez fue un escritor colombiano, ganador del Premio Nobel de Literatura en 1982.",
    nuevo: false,
  },
  {
    id: 2,
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    portada: "https://covers.openlibrary.org/b/id/8108696-L.jpg",
    sinopsis: "Un principito visita diferentes planetas y aprende lecciones valiosas sobre la vida y el amor.",
    biografia: "Antoine de Saint-Exupéry fue un escritor y aviador francés.",
    nuevo: false,
  },
  {
    id: 3,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    portada: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    sinopsis: "Las aventuras de un hidalgo que, enloquecido por la lectura de novelas de caballerías, decide convertirse en caballero andante.",
    biografia: "Miguel de Cervantes fue un novelista, poeta y dramaturgo español.",
    nuevo: false,
  }
];

function LibrosProvider({ children }) {
  const [libros, setLibros] = useState(() => {
    try {
      const stored = localStorage.getItem('libros');
      return stored ? JSON.parse(stored) : librosIniciales;
    } catch {
      return librosIniciales;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('libros', JSON.stringify(libros));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [libros]);

  const agregarLibro = (nuevoLibro) => {
    setLibros(prevLibros => {
      const maxId = Math.max(...prevLibros.map(l => l.id), 0);
      const libroConId = {
        ...nuevoLibro,
        id: maxId + 1,
        nuevo: true,
        fechaAgregado: new Date().toISOString()
      };
      return [libroConId, ...prevLibros];
    });
  };

  const buscarLibros = (query) => {
    if (!query) return libros;
    const queryLower = query.toLowerCase();
    return libros.filter(libro =>
      libro.titulo.toLowerCase().includes(queryLower) ||
      libro.autor.toLowerCase().includes(queryLower)
    );
  };

  const eliminarLibro = (id) => {
    setLibros(prevLibros => prevLibros.filter(libro => libro.id !== id));
  };

  const value = {
    libros,
    agregarLibro,
    buscarLibros,
    eliminarLibro
  };

  return (
    <LibrosContext.Provider value={value}>
      {children}
    </LibrosContext.Provider>
  );
}

export { LibrosContext, LibrosProvider };