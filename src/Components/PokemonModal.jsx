import { useState } from 'react'
import typeColors from '../utils/typeColors'
import { getArtworkUrl, getShowdownUrl } from '../utils/pokemonSprites'
import '../Styles/Modal.css'

function PokemonModal({ pokemon, onClose, initialViewMode = 'artwork' }) {
  if (!pokemon) return null
  const [viewMode, setViewMode] = useState(initialViewMode)
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`

  const artworkUrl = getArtworkUrl(pokemon)
  const showdownUrl = getShowdownUrl(pokemon)
  const currentImgSrc = viewMode === 'showdown' ? showdownUrl : artworkUrl

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bg-id">{formattedId}</div>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>{pokemon.name}</h2>
          <span className="modal-id">{formattedId}</span>
        </div>

        <div className="modal-toggle-group">
          <button
            type="button"
            className={`modal-toggle-btn ${viewMode === 'artwork' ? 'active' : ''}`}
            onClick={() => setViewMode('artwork')}
          >
            Artwork
          </button>
          <button
            type="button"
            className={`modal-toggle-btn ${viewMode === 'showdown' ? 'active' : ''}`}
            onClick={() => setViewMode('showdown')}
          >
            Showdown
          </button>
        </div>

        <div className="modal-image-container">
          <img
            key={`${pokemon.id}-${viewMode}`}
            className={`modal-image ${viewMode === 'showdown' ? 'is-showdown' : ''}`}
            src={currentImgSrc}
            alt={pokemon.name}
            onError={(e) => {
              if (viewMode === 'showdown' && e.currentTarget.src !== artworkUrl) {
                e.currentTarget.src = artworkUrl
              }
            }}
          />
        </div>

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
