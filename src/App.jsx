import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'


function App() {
  return (
    <div className="app">
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
