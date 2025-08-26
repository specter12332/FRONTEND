export default function AdminPanel() {
  return (
    <div className="p-6 text-white bg-[#343541] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      <ul className="space-y-3">
        <li className="p-3 bg-[#202123] rounded">📚 Gestionar libros</li>
        <li className="p-3 bg-[#202123] rounded">👥 Ver usuarios registrados</li>
        <li className="p-3 bg-[#202123] rounded">📊 Estadísticas</li>
      </ul>
    </div>
  );
}
