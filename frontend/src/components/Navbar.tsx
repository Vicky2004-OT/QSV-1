import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-white/10 text-white' : 'hover:bg-white/15 dark:hover:bg-white/10 text-white/90'}`

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="glass container mx-auto mt-4 px-4 py-3 rounded-xl flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-white">QSV</Link>
        <nav className="flex gap-2">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/builder" className={navLinkClass}>Builder</NavLink>
          <NavLink to="/visualizer" className={navLinkClass}>Visualizer</NavLink>
          <NavLink to="/tutorials" className={navLinkClass}>Tutorials</NavLink>
          <NavLink to="/analysis" className={navLinkClass}>Analysis</NavLink>
          <NavLink to="/guide" className={navLinkClass}>Guide</NavLink>
          <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </nav>
      </div>
    </header>
  )
}
