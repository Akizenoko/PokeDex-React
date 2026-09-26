import typeColors from '../utils/typeColors'
import '../Styles/Modal.css'

function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bg-id">{formattedId}</div>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>{pokemon.name}</h2>
          <span className="modal-id">{formattedId}</span>
        </div>

        <img
          className="modal-image"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          alt={pokemon.name}
        />

        <div className="modal-types">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="modal-type-badge"
              style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {pokemon.description && (
          <p className="modal-description">{pokemon.description}</p>
        )}

        <div className="modal-stats">
          <div className="modal-stat">
            <span className="stat-label">Height</span>
            <span className="stat-value">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div className="modal-stat">
            <span className="stat-label">Weight</span>
            <span className="stat-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal
