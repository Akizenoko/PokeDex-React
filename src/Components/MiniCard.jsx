import typeColors from '../utils/typeColors'
import '../Styles/MiniCard.css'

function MiniCard({ pokemon, onClick }) {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`

  return (
    <div className="mini-card" onClick={() => onClick(pokemon)}>
      <div className="mini-card-bg-id">{formattedId}</div>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        alt={pokemon.name}
      />
      <div className="mini-card-info">
        <h3>{pokemon.name}</h3>
        <span className="mini-card-id">{formattedId}</span>
        <div className="mini-type-badges">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="mini-type-badge"
              style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MiniCard
