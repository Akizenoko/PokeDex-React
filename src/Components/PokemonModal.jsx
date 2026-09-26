import { useState } from 'react'
import typeColors from '../utils/typeColors'
import { getArtworkUrl, getShowdownUrl } from '../utils/pokemonSprites'
import { formatName } from '../utils/formatters'
import '../Styles/Modal.css'

function PokemonModal({ pokemon, onClose, initialViewMode = 'artwork' }) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [moveFilter, setMoveFilter] = useState('')

  if (!pokemon) return null

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`
  const artworkUrl = getArtworkUrl(pokemon)
  const showdownUrl = getShowdownUrl(pokemon)
  const currentImgSrc = viewMode === 'showdown' ? showdownUrl : artworkUrl

  const filteredMoves = (pokemon.moves || []).filter((m) =>
    m.move.name.toLowerCase().includes(moveFilter.trim().toLowerCase().replace(/\s+/g, '-'))
  )

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

        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <div className="modal-detail-section">
            <span className="detail-section-title">Abilities</span>
            <div className="abilities-list">
              {pokemon.abilities.map((item) => (
                <span
                  key={item.ability.name}
                  className={`ability-badge ${item.is_hidden ? 'is-hidden' : ''}`}
                >
                  {formatName(item.ability.name)}
                  {item.is_hidden && <span className="hidden-tag">Hidden</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {pokemon.moves && pokemon.moves.length > 0 && (
          <div className="modal-detail-section">
            <div className="detail-section-header">
              <span className="detail-section-title">
                Moves ({pokemon.moves.length})
              </span>
              {pokemon.moves.length > 8 && (
                <input
                  type="text"
                  className="move-search-input"
                  placeholder="Filter moves..."
                  value={moveFilter}
                  onChange={(e) => setMoveFilter(e.target.value)}
                />
              )}
            </div>
            <div className="moves-container">
              {filteredMoves.length > 0 ? (
                filteredMoves.map((item) => (
                  <span key={item.move.name} className="move-badge">
                    {formatName(item.move.name)}
                  </span>
                ))
              ) : (
                <span className="no-moves-found">No matching moves</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonModal
