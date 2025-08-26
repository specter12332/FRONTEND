export default function Biblioteca() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📚 Mi Biblioteca</h1>
      <p className="text-gray-300">Lista de todos los libros guardados.</p>
      <div className="mt-6 space-y-2">
        <div className="p-3 bg-[#202123] rounded">Libro 1 - Autor</div>
        <div className="p-3 bg-[#202123] rounded">Libro 2 - Autor</div>
      </div>
    </div>
  );
}
