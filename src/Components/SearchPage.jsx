import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Searchbar from './SearchBar.jsx'
import Card from './Card.jsx'

function SearchPage() {
  const [pokemonName, setpokemonName] = useState("pikachu")
  const [pokemon, setpokemon] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchPokemon = useCallback(async (nameToSearch) => {
    const query = (nameToSearch || pokemonName).trim().toLowerCase()
    if (!query) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`)
      const speciesResponse = await axios.get(response.data.species.url)
      const description = speciesResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      )?.flavor_text

      setpokemon({
        ...response.data,
        description: description ? description.replace(/[\f\n\r]/g, ' ') : '',
      })
    } catch {
      setError('Pokemon not found! Please check the spelling.')
      setpokemon(null)
    } finally {
      setLoading(false)
    }
  }, [pokemonName])

  useEffect(() => {
    let ignore = false
    async function loadInitial() {
      setLoading(true)
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu')
        const speciesResponse = await axios.get(response.data.species.url)
        const description = speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === 'en'
        )?.flavor_text
        if (!ignore) {
          setpokemon({
            ...response.data,
            description: description ? description.replace(/[\f\n\r]/g, ' ') : '',
          })
        }
      } catch {
        if (!ignore) {
          setError('Pokemon not found! Please check the spelling.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    loadInitial()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <>
      <Searchbar pokemonName={pokemonName} onPokemonChange={setpokemonName} onSearch={() => searchPokemon()} />
      {loading && (
        <p style={{ color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px', marginTop: '10px', textAlign: 'center' }}>
          Searching Pokédex...
        </p>
      )}
      {error && (
        <p style={{ color: '#fca5a5', fontWeight: '600', background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 20px', borderRadius: '12px', marginTop: '10px', textAlign: 'center', maxWidth: '480px', margin: '10px 16px 0 16px' }}>
          {error}
        </p>
      )}
      {!loading && pokemon && <Card pokemon={pokemon} />}
    </>
  )
}

export default SearchPage
