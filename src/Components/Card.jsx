import { useState } from 'react'
import typeColors from '../utils/typeColors'
import { getArtworkUrl, getShowdownUrl } from '../utils/pokemonSprites'
import '../Styles/Card.css'

function Card({ pokemon }) {
    const [viewMode, setViewMode] = useState('artwork')
    const formattedId = `#${String(pokemon?.id ?? '').padStart(3, '0')}`

    const artworkUrl = getArtworkUrl(pokemon)
    const showdownUrl = getShowdownUrl(pokemon)
    const currentImgSrc = viewMode === 'showdown' ? showdownUrl : artworkUrl

    return (
        <div className='Card'>
            <div className='card-bg-id'>{formattedId}</div>

            <div className='Name'>
                <h1>{pokemon?.name}</h1>
                <span className='id-tag'>{formattedId}</span>
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

            <div className='Information'>
                <div className='type-badges'>
                    {pokemon?.types?.map((type) => (
                        <span
                            key={type.type.name}
                            className='type-badge'
                            style={{ backgroundColor: typeColors[type.type.name] || '#777' }}
                        >
                            {type.type.name}
                        </span>
                    ))}
                </div>
                {pokemon?.description && (
                    <p className='description-text'>{pokemon.description}</p>
                )}
                {(pokemon?.height !== undefined || pokemon?.weight !== undefined) && (
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default Card