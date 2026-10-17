/*
  SearchBar: caja de búsqueda controlada. El texto lo guarda la página (value) y se
  le avisa con onCambio(texto) en cada tecla, así el listado se filtra en vivo.
*/
export default function SearchBar({ value, onCambio, placeholder = 'Buscar productos...' }) {
  return (
    <input
      type="search"
      className="form-control"
      aria-label="Buscar"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onCambio(e.target.value)}
    />
  )
}
