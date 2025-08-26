export default function NuevoLibro() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📖 Agregar Nuevo Libro</h1>
      <p className="text-gray-300">Aquí puedes agregar un nuevo libro a tu biblioteca.</p>
      <form className="mt-6 space-y-4 max-w-md">
        <input type="text" placeholder="Título" className="w-full p-2 bg-[#202123] border border-gray-600 rounded" />
        <input type="text" placeholder="Autor" className="w-full p-2 bg-[#202123] border border-gray-600 rounded" />
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
