import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import SearchPage from './Components/SearchPage.jsx'
import SeeAllPage from './Components/SeeAllPage.jsx'
import './Styles/App.css'

function App() {
  return (
    <div className='body'>
      <div className='contents'>
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/all" element={<SeeAllPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
