
import { Link } from "react-router-dom";

export default function TopMenu() {
	return (
		<header className="w-full bg-[#202123] text-[#ECECF1] px-8 py-4 border-b border-gray-700">
			<div className="text-2xl font-bold flex items-center gap-2 mb-2">
				📚 Mi Biblioteca
			</div>
			<nav className="flex gap-6 items-center mt-2">
				<Link to="/nuevo" className="hover:text-[#4ade80] font-medium">Nuevo libro</Link>
				<Link to="/buscar" className="hover:text-[#4ade80] font-medium">Buscar libros</Link>
				<Link to="/biblioteca" className="hover:text-[#4ade80] font-medium">Biblioteca</Link>
			</nav>
		</header>
	);
}
