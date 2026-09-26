import { useState, useEffect } from 'react'
import axios from 'axios'
import MiniCard from './MiniCard.jsx'
import PokemonModal from './PokemonModal.jsx'
import '../Styles/SeeAll.css'

function SeeAllPage() {
  const [pokemonList, setPokemonList] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const limit = 20

  useEffect(() => {
    fetchPokemon()
  }, [offset])

  async function fetchPokemon() {
    setLoading(true)
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      const details = await Promise.all(
        response.data.results.map((p) => axios.get(p.url).then((res) => res.data))
      )

      // Fetch descriptions from the species endpoint for each pokemon
      const withDescriptions = await Promise.all(
        details.map(async (poke) => {
          try {
            const speciesRes = await axios.get(poke.species.url)
            const entry = speciesRes.data.flavor_text_entries.find(
              (e) => e.language.name === 'en'
            )
            const cleanDescription = entry?.flavor_text ? entry.flavor_text.replace(/[\f\n\r]/g, ' ') : ''
            return { ...poke, description: cleanDescription }
          } catch {
            return { ...poke, description: '' }
          }
        })
      )

      setPokemonList(withDescriptions)
    } catch (err) {
      setPokemonList([])
    }
    setLoading(false)
  }

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(1302 / limit)

  return (
    <div className="see-all">
      <div className="pokemon-grid">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          pokemonList.map((p) => (
            <MiniCard key={p.id} pokemon={p} onClick={setSelectedPokemon} />
          ))
        )}
      </div>
      <div className="pagination">
        <button disabled={offset === 0} onClick={() => setOffset(offset - limit)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={offset + limit >= 1302} onClick={() => setOffset(offset + limit)}>Next</button>
      </div>

      <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}

export default SeeAllPage
