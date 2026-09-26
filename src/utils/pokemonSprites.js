export function getArtworkUrl(pokemon) {
  if (!pokemon?.id) return ''
  return (
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  )
}

export function getShowdownUrl(pokemon) {
  if (!pokemon?.id) return ''
  return (
    pokemon?.sprites?.other?.showdown?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`
  )
}
