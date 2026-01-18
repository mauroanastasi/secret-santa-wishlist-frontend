import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AddGiftPage from './pages/AddGiftPage'
import PublicWishlistPage from './pages/PublicWishlistPage'
import Snowfall from './components/Snowfall'

function App() {
  return (
    <div className="app">
      <Snowfall />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-gift" element={<AddGiftPage />} />
        <Route path="/edit-gift/:id" element={<AddGiftPage />} />
        <Route path="/wishlist/:secret_link" element={<PublicWishlistPage />} />
      </Routes>
    </div>
  )
}

export default App
