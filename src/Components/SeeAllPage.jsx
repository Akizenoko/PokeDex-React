import { useState, useEffect } from 'react'
import axios from 'axios'
import MiniCard from './MiniCard.jsx'
import PokemonModal from './PokemonModal.jsx'
import '../Styles/SeeAll.css'

function SeeAllPage() {
  const [pokemonList, setPokemonList] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(1302)
  const [jumpPage, setJumpPage] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [viewMode, setViewMode] = useState('artwork')
  const limit = 20

  useEffect(() => {
    fetchPokemon()
  }, [offset])

  async function fetchPokemon() {
    setLoading(true)
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      if (response.data.count) {
        setTotalCount(response.data.count)
      }
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
  const totalPages = Math.ceil(totalCount / limit)

  const goToPage = (targetPage) => {
    const clampedPage = Math.max(1, Math.min(targetPage, totalPages))
    setOffset((clampedPage - 1) * limit)
  }

  const handleJump = (e) => {
    e.preventDefault()
    const targetPage = parseInt(jumpPage, 10)
    if (!isNaN(targetPage)) {
      goToPage(targetPage)
      setJumpPage('')
    }
  }

  return (
    <div className="see-all">
      <div className="see-all-controls">
        <div className="see-all-toggle-group">
          <span className="see-all-toggle-label">Sprites:</span>
          <button
            type="button"
            className={`see-all-toggle-btn ${viewMode === 'artwork' ? 'active' : ''}`}
            onClick={() => setViewMode('artwork')}
          >
            Artwork
          </button>
          <button
            type="button"
            className={`see-all-toggle-btn ${viewMode === 'showdown' ? 'active' : ''}`}
            onClick={() => setViewMode('showdown')}
          >
            Showdown
          </button>
        </div>
      </div>

      <div className="pokemon-grid">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          pokemonList.map((p) => (
            <MiniCard
              key={p.id}
              pokemon={p}
              onClick={setSelectedPokemon}
              viewMode={viewMode}
            />
          ))
        )}
      </div>

      <div className="pagination-wrapper">
        <div className="pagination">
          <button
            disabled={offset === 0 || loading}
            onClick={() => goToPage(1)}
            title="First Page"
          >
            « First
          </button>
          <button
            disabled={offset === 0 || loading}
            onClick={() => goToPage(page - 1)}
          >
            Prev
          </button>
          <span className="page-indicator">Page {page} of {totalPages}</span>
          <button
            disabled={offset + limit >= totalCount || loading}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
          <button
            disabled={offset + limit >= totalCount || loading}
            onClick={() => goToPage(totalPages)}
            title="Last Page"
          >
            Last »
          </button>
        </div>

        <form className="skip-page-form" onSubmit={handleJump}>
          <label htmlFor="skip-page-input">Skip to page:</label>
          <div className="skip-page-input-group">
            <input
              id="skip-page-input"
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Page #"
            />
            <button type="submit" disabled={!jumpPage || loading}>
              Go
            </button>
          </div>
        </form>
      </div>

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        initialViewMode={viewMode}
      />
    </div>
  )
}

export default SeeAllPage
