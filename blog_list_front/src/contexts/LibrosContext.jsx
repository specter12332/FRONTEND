import React, { createContext, useState, useEffect } from 'react';

export const LibrosContext = createContext();

// Recuperar libros del localStorage o usar los iniciales
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

const getLibrosIniciales = () => {
  try {
    const librosGuardados = localStorage.getItem('libros');
    if (librosGuardados) {
      return JSON.parse(librosGuardados);
    }
  } catch (error) {
    console.error('Error al cargar libros del localStorage:', error);
  }
  return librosIniciales;
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

export function LibrosProvider({ children }) {
  const [libros, setLibros] = useState(getLibrosIniciales());

  // Guardar en localStorage cada vez que cambie el estado de libros
  useEffect(() => {
    try {
      localStorage.setItem('libros', JSON.stringify(libros));
    } catch (error) {
      console.error('Error al guardar libros en localStorage:', error);
    }
  }, [libros]);

  const agregarLibro = (nuevoLibro) => {
    setLibros(librosActuales => {
      const nuevoId = librosActuales.length > 0 
        ? Math.max(...librosActuales.map(l => l.id)) + 1 
        : 1;
      
      return [{
        ...nuevoLibro,
        id: nuevoId,
        nuevo: true,
        fechaAgregado: new Date().toISOString()
      }, ...librosActuales];
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
    setLibros(librosActuales => librosActuales.filter(libro => libro.id !== id));
  };

  return (
    <LibrosContext.Provider value={{ 
      libros, 
      agregarLibro, 
      buscarLibros,
      eliminarLibro
    }}>
      {children}
    </LibrosContext.Provider>
  );
};