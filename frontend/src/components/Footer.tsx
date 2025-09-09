export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="glass container mx-auto px-4 py-6 rounded-xl text-sm text-white/80">
        © {new Date().getFullYear()} QSV — Quantum State Visualizer
      </div>
    </footer>
  )
}
