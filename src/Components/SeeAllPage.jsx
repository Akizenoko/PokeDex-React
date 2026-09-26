import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import MiniCard from './MiniCard.jsx'
import PokemonModal from './PokemonModal.jsx'
import typeColors from '../utils/typeColors'
import { formatName } from '../utils/formatters'
import '../Styles/SeeAll.css'

const typeList = Object.keys(typeColors)

function getPokemonIdFromUrl(url) {
  const matches = url?.match(/\/pokemon\/(\d+)\/?/)
  return matches ? parseInt(matches[1], 10) : 0
}

function SeeAllPage() {
  const [allPokemonList, setAllPokemonList] = useState([])
  const [typePokemonList, setTypePokemonList] = useState(null)
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('id_asc')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('artwork')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [jumpPage, setJumpPage] = useState('')
  const [displayedPokemon, setDisplayedPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeLoading, setTypeLoading] = useState(false)
  const limit = 20

  const typeCacheRef = useRef({})

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 250)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset page when type or sort changes
  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    if (newType === 'all') {
      setTypePokemonList(null)
    }
    setPage(1)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setPage(1)
  }

  const handleResetFilters = () => {
    setSelectedType('all')
    setTypePokemonList(null)
    setSearchTerm('')
    setDebouncedSearch('')
    setSortBy('id_asc')
    setPage(1)
  }

  // Fetch all pokemon names & URLs once on mount
  useEffect(() => {
    let active = true
    async function loadMasterList() {
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000')
        if (!active) return
        const items = res.data.results.map((p) => ({
          name: p.name,
          url: p.url,
          id: getPokemonIdFromUrl(p.url),
        }))
        setAllPokemonList(items)
      } catch (e) {
        console.error('Failed to load Pokémon list', e)
      }
    }
    loadMasterList()
    return () => {
      active = false
    }
  }, [])

  // Fetch list by type if selectedType !== 'all'
  useEffect(() => {
    if (selectedType === 'all') {
      return
    }

    if (typeCacheRef.current[selectedType]) {
      const cached = typeCacheRef.current[selectedType]
      const timer = setTimeout(() => setTypePokemonList(cached), 0)
      return () => clearTimeout(timer)
    }

    let active = true
    async function loadTypePokemon() {
      setTypeLoading(true)
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/type/${selectedType}`)
        if (!active) return
        const items = res.data.pokemon.map((item) => ({
          name: item.pokemon.name,
          url: item.pokemon.url,
          id: getPokemonIdFromUrl(item.pokemon.url),
        }))
        typeCacheRef.current[selectedType] = items
        setTypePokemonList(items)
      } catch (e) {
        console.error(`Failed to load ${selectedType} Pokémon`, e)
      } finally {
        if (active) setTypeLoading(false)
      }
    }
    loadTypePokemon()
    return () => {
      active = false
    }
  }, [selectedType])

  // Filter and sort the Pokémon list
  const filteredAndSorted = useMemo(() => {
    const sourceList = selectedType === 'all' ? allPokemonList : (typePokemonList || [])
    if (!sourceList.length) return []

    const query = debouncedSearch.trim().toLowerCase().replace(/^#/, '')

    let result = sourceList
    if (query) {
      result = sourceList.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query)
        const idMatch = String(p.id).includes(query)
        return nameMatch || idMatch
      })
    }

    const sorted = [...result]
    if (sortBy === 'id_asc') {
      sorted.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'id_desc') {
      sorted.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'name_asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name_desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name))
    }

    return sorted
  }, [allPokemonList, typePokemonList, selectedType, debouncedSearch, sortBy])

  const totalResults = filteredAndSorted.length
  const totalPages = Math.max(1, Math.ceil(totalResults / limit))
  const currentPage = Math.min(page, totalPages)

  // Fetch detailed data for the 20 items on current page
  useEffect(() => {
    let isMounted = true

    async function loadPageDetails() {
      if (!filteredAndSorted.length) {
        if (isMounted) {
          setDisplayedPokemon([])
          setLoading(false)
        }
        return
      }

      const startIndex = (currentPage - 1) * limit
      const pageItems = filteredAndSorted.slice(startIndex, startIndex + limit)

      setLoading(true)
      try {
        const details = await Promise.all(
          pageItems.map((p) => axios.get(p.url).then((res) => res.data))
        )

        const withDescriptions = await Promise.all(
          details.map(async (poke) => {
            try {
              const speciesRes = await axios.get(poke.species.url)
              const entry = speciesRes.data.flavor_text_entries.find(
                (e) => e.language.name === 'en'
              )
              const cleanDescription = entry?.flavor_text
                ? entry.flavor_text.replace(/[\f\n\r]/g, ' ')
                : ''
              return { ...poke, description: cleanDescription }
            } catch {
              return { ...poke, description: '' }
            }
          })
        )

        if (isMounted) {
          setDisplayedPokemon(withDescriptions)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error(err)
          setDisplayedPokemon([])
          setLoading(false)
        }
      }
    }

    loadPageDetails()

    return () => {
      isMounted = false
    }
  }, [filteredAndSorted, currentPage])

  const goToPage = (targetPage) => {
    const clamped = Math.max(1, Math.min(targetPage, totalPages))
    setPage(clamped)
  }

  const handleJump = (e) => {
    e.preventDefault()
    const target = parseInt(jumpPage, 10)
    if (!isNaN(target)) {
      goToPage(target)
      setJumpPage('')
    }
  }

  const hasActiveFilters =
    selectedType !== 'all' || searchTerm.trim() !== '' || sortBy !== 'id_asc'

  return (
    <div className="see-all">
      <div className="see-all-filter-panel">
        <div className="see-all-search-box">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="see-all-search-input"
            placeholder="Search by name or #ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="see-all-filter-group">
          <div className="filter-select-wrapper">
            <label htmlFor="type-filter" className="filter-label">
              Type:
            </label>
            <select
              id="type-filter"
              className="filter-select"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{
                borderColor:
                  selectedType !== 'all' && typeColors[selectedType]
                    ? typeColors[selectedType]
                    : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <option value="all">All Types</option>
              {typeList.map((t) => (
                <option key={t} value={t}>
                  {formatName(t)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label htmlFor="sort-filter" className="filter-label">
              Sort:
            </label>
            <select
              id="sort-filter"
              className="filter-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="id_asc">ID: Low to High</option>
              <option value="id_desc">ID: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          <div className="see-all-toggle-group">
            <span className="see-all-toggle-label">Sprite:</span>
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

          {hasActiveFilters && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="filter-results-info">
        <span className="results-count">
          {typeLoading ? (
            'Loading type...'
          ) : (
            <>
              Found <strong>{totalResults}</strong> Pokémon
              {selectedType !== 'all' && (
                <>
                  {' '}
                  of type{' '}
                  <span
                    className="active-type-pill"
                    style={{ backgroundColor: typeColors[selectedType] || '#777' }}
                  >
                    {selectedType}
                  </span>
                </>
              )}
            </>
          )}
        </span>
      </div>

      <div className="pokemon-grid">
        {loading || typeLoading ? (
          <p className="loading-text">Loading Pokémon...</p>
        ) : displayedPokemon.length > 0 ? (
          displayedPokemon.map((p) => (
            <MiniCard
              key={p.id}
              pokemon={p}
              onClick={setSelectedPokemon}
              viewMode={viewMode}
            />
          ))
        ) : (
          <div className="no-results-box">
            <p>No Pokémon found matching your criteria.</p>
            {hasActiveFilters && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {totalResults > limit && (
        <div className="pagination-wrapper">
          <div className="pagination">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => goToPage(1)}
              title="First Page"
            >
              « First
            </button>
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => goToPage(totalPages)}
              title="Last Page"
            >
              Last »
            </button>
          </div>

          {totalPages > 1 && (
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
          )}
        </div>
      )}

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        initialViewMode={viewMode}
      />
    </div>
  )
}

export default SeeAllPage
