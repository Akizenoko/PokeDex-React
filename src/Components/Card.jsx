import typeColors from '../utils/typeColors'
import '../Styles/Card.css'

function Card({ pokemon }) {
    const formattedId = `#${String(pokemon?.id ?? '').padStart(3, '0')}`

    return (
        <div className='Card'>
            <div className='card-bg-id'>{formattedId}</div>

            <div className='Name'>
                <h1>{pokemon?.name}</h1>
                <span className='id-tag'>{formattedId}</span>
            </div>

            <div className='image-container'>
                <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`} 
                    alt={pokemon?.name} 
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