import typeColors from '../utils/typeColors'
import { getArtworkUrl, getShowdownUrl } from '../utils/pokemonSprites'
import '../Styles/MiniCard.css'

function MiniCard({ pokemon, onClick, viewMode = 'artwork' }) {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`
  const artworkUrl = getArtworkUrl(pokemon)
  const showdownUrl = getShowdownUrl(pokemon)
  const currentImgSrc = viewMode === 'showdown' ? showdownUrl : artworkUrl

  return (
    <div className="mini-card" onClick={() => onClick(pokemon)}>
      <div className="mini-card-bg-id">{formattedId}</div>
      <div className="mini-card-img-wrap">
        <img
          key={`${pokemon.id}-${viewMode}`}
          className={viewMode === 'showdown' ? 'mini-showdown-img' : ''}
          src={currentImgSrc}
          alt={pokemon.name}
          onError={(e) => {
            if (viewMode === 'showdown' && e.currentTarget.src !== artworkUrl) {
              e.currentTarget.src = artworkUrl
            }
          }}
        />
      </div>
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
