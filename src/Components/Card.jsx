import { useState } from 'react'
import typeColors from '../utils/typeColors'
import { getArtworkUrl, getShowdownUrl } from '../utils/pokemonSprites'
import { formatName } from '../utils/formatters'
import '../Styles/Card.css'

function Card({ pokemon }) {
    const [viewMode, setViewMode] = useState('artwork')
    const [moveFilter, setMoveFilter] = useState('')

    if (!pokemon) return null

    const formattedId = `#${String(pokemon?.id ?? '').padStart(3, '0')}`
    const primaryType = pokemon?.types?.[0]?.type?.name || 'normal'
    const primaryColor = typeColors[primaryType] || '#dc0a2d'

    const artworkUrl = getArtworkUrl(pokemon)
    const showdownUrl = getShowdownUrl(pokemon)
    const currentImgSrc = viewMode === 'showdown' ? showdownUrl : artworkUrl

    const filteredMoves = (pokemon?.moves || []).filter((m) =>
        m.move.name.toLowerCase().includes(moveFilter.trim().toLowerCase().replace(/\s+/g, '-'))
    )

    return (
        <div className='Card' style={{ '--type-theme-color': primaryColor }}>
            <div className='card-bg-id'>{formattedId}</div>

            <div className='card-layout-grid'>
                {/* Left Column: Visual Showcase & Core Info */}
                <div className='card-hero-panel'>
                    <div className='card-header'>
                        <div className='card-title-row'>
                            <h1 className='pokemon-name'>{formatName(pokemon?.name)}</h1>
                            <span className='id-tag'>{formattedId}</span>
                        </div>

                        <div className='type-badges'>
                            {pokemon?.types?.map((t) => (
                                <span
                                    key={t.type.name}
                                    className='type-badge'
                                    style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
                                >
                                    {formatName(t.type.name)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='image-toggle-group'>
                        <button
                            type='button'
                            className={`image-toggle-btn ${viewMode === 'artwork' ? 'active' : ''}`}
                            onClick={() => setViewMode('artwork')}
                        >
                            Artwork
                        </button>
                        <button
                            type='button'
                            className={`image-toggle-btn ${viewMode === 'showdown' ? 'active' : ''}`}
                            onClick={() => setViewMode('showdown')}
                        >
                            Showdown
                        </button>
                    </div>

                    <div className='image-container'>
                        <div className='image-glow-backdrop'></div>
                        <img
                            key={`${pokemon?.id}-${viewMode}`}
                            className={`pokemon-card-img ${viewMode === 'showdown' ? 'is-showdown' : ''}`}
                            src={currentImgSrc}
                            alt={pokemon?.name}
                            onError={(e) => {
                                if (viewMode === 'showdown' && e.currentTarget.src !== artworkUrl) {
                                    e.currentTarget.src = artworkUrl
                                }
                            }}
                        />
                    </div>

                    {(pokemon?.height !== undefined || pokemon?.weight !== undefined || pokemon?.base_experience !== undefined) && (
                        <div className='card-stats'>
                            {pokemon.height !== undefined && (
                                <div className='card-stat'>
                                    <span className='stat-label'>Height</span>
                                    <span className='stat-value'>{(pokemon.height / 10).toFixed(1)} m</span>
                                </div>
                            )}
                            {pokemon.weight !== undefined && (
                                <div className='card-stat'>
                                    <span className='stat-label'>Weight</span>
                                    <span className='stat-value'>{(pokemon.weight / 10).toFixed(1)} kg</span>
                                </div>
                            )}
                            {pokemon.base_experience !== undefined && (
                                <div className='card-stat'>
                                    <span className='stat-label'>Base XP</span>
                                    <span className='stat-value'>{pokemon.base_experience}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Descriptions, Abilities & Moves */}
                <div className='card-details-panel'>
                    {pokemon?.description && (
                        <div className='card-description-box'>
                            <span className='description-label'>Pokédex Entry</span>
                            <p className='description-text'>{pokemon.description}</p>
                        </div>
                    )}

                    {pokemon?.abilities && pokemon.abilities.length > 0 && (
                        <div className='card-detail-section'>
                            <span className='detail-section-title'>Abilities</span>
                            <div className='abilities-list'>
                                {pokemon.abilities.map((item) => (
                                    <span
                                        key={item.ability.name}
                                        className={`ability-badge ${item.is_hidden ? 'is-hidden' : ''}`}
                                    >
                                        {formatName(item.ability.name)}
                                        {item.is_hidden && <span className='hidden-tag'>Hidden</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {pokemon?.moves && pokemon.moves.length > 0 && (
                        <div className='card-detail-section moves-section'>
                            <div className='detail-section-header'>
                                <span className='detail-section-title'>
                                    Moves ({pokemon.moves.length})
                                </span>
                                {pokemon.moves.length > 6 && (
                                    <input
                                        type='text'
                                        className='move-search-input'
                                        placeholder='Filter moves...'
                                        value={moveFilter}
                                        onChange={(e) => setMoveFilter(e.target.value)}
                                    />
                                )}
                            </div>
                            <div className='moves-container'>
                                {filteredMoves.length > 0 ? (
                                    filteredMoves.map((item) => (
                                        <span key={item.move.name} className='move-badge'>
                                            {formatName(item.move.name)}
                                        </span>
                                    ))
                                ) : (
                                    <span className='no-moves-found'>No matching moves</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Card