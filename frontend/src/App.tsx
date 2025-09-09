import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CircuitBuilder from './pages/CircuitBuilder'
import Visualizer from './pages/Visualizer'
import Tutorials from './pages/Tutorials'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'
import About from './pages/About'
import UserGuide from './pages/UserGuide'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground" style={{
        backgroundImage: 'url(/quantum-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/builder" element={<CircuitBuilder />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/guide" element={<UserGuide />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
