export default function BuscarLibros() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔍 Buscar Libros</h1>
      <p className="text-gray-300">Escribe el nombre de un libro para buscarlo.</p>
      <input type="text" placeholder="Buscar..." className="mt-4 w-full max-w-md p-2 bg-[#202123] border border-gray-600 rounded" />
    </div>
  );
}
