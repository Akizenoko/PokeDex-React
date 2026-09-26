import '../Styles/Searchbar.css'

function Searchbar({ pokemonName, onPokemonChange, onSearch }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch()
        }
    }

    return (
        <div className='searchbody'>
            <input
                type="text"
                placeholder="Enter Pokemon name or ID..."
                value={pokemonName}
                onChange={(event) => onPokemonChange(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={onSearch}>Search</button>
        </div>
    )
}

export default Searchbar