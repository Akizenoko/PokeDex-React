import { NavLink } from 'react-router-dom'
import pokeballImg from '../assets/pokeball.png'
import '../Styles/Navbar.css'

function NavBar() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <nav className='Navbar'>
      <div
        className='navbar-brand'
        onClick={handleReload}
        title="Refresh Pokédex"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleReload()}
      >
        <img src={pokeballImg} alt="Pokeball" className='navbar-pokeball' />
        <span className='navbar-title'>Pokedex</span>
      </div>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            Search Pokemon
          </NavLink>
        </li>
        <li>
          <NavLink to="/all" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            See All Pokemon
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar