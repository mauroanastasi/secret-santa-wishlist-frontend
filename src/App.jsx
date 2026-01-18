import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { themes } from './config/themes'
import HomePage from './pages/HomePage'
import AddGiftPage from './pages/AddGiftPage'
import PublicWishlistPage from './pages/PublicWishlistPage'
import Snowfall from './components/Snowfall'
import { useEffect } from 'react'

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    const currentTheme = themes[theme];
    // Aggiorna le variabili CSS
    document.documentElement.style.setProperty('--gradient-start', currentTheme.gradientStart);
    document.documentElement.style.setProperty('--gradient-end', currentTheme.gradientEnd);

    // Aggiorna il background del body
    const gradient = `linear-gradient(180deg, ${currentTheme.gradientStart} 0%, ${currentTheme.gradientEnd} 100%)`;
    document.body.style.background = gradient;
  }, [theme]);

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
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
