import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6 pt-16">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight headline text-white">
          Quantum State Visualizer
        </h1>
        <p className="text-white/90 max-w-3xl mx-auto text-lg">
          Build circuits, simulate states, and explore quantum phenomena in an immersive, high-performance interface.
        </p>
        <div className="flex justify-center gap-4">
          <Link className="px-6 py-3 rounded-xl btn-primary" to="/builder">Circuit Builder</Link>
          <Link className="px-6 py-3 rounded-xl glass text-white" to="/visualizer">State Visualizer</Link>
          <Link className="px-6 py-3 rounded-xl glass text-white" to="/tutorials">Tutorials</Link>
        </div>
      </section>

      <section className="container mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">About QSV</h2>
          <p className="text-white/90 max-w-4xl mx-auto text-lg leading-relaxed">
            The Quantum State Visualizer (QSV) is a comprehensive platform for learning and experimenting with quantum computing. 
            Build quantum circuits with an intuitive drag-and-drop interface, visualize quantum states on interactive Bloch spheres, 
            and analyze circuit behavior with real-time simulations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl text-white">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="font-semibold mb-2 text-white">Interactive Learning</h3>
            <p className="text-sm text-white/90">
              Comprehensive tutorials covering quantum superposition, entanglement, interference, and quantum algorithms. 
              Learn by doing with step-by-step guided circuits.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl text-white">
            <div className="text-4xl mb-4">⚛️</div>
            <h3 className="font-semibold mb-2 text-white">Visual Quantum States</h3>
            <p className="text-sm text-white/90">
              Real-time Bloch sphere visualization shows how quantum gates transform qubit states. 
              See superposition, phase, and entanglement in beautiful 3D representations.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl text-white">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-semibold mb-2 text-white">Circuit Simulation</h3>
            <p className="text-sm text-white/90">
              Build complex quantum circuits with drag-and-drop gates, export to QASM format, 
              and analyze measurement outcomes with probability distributions.
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">Perfect for Students & Researchers</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Whether you're new to quantum computing or exploring advanced algorithms, QSV provides the tools 
            to understand quantum mechanics through hands-on experimentation and visualization.
          </p>
          <div className="flex justify-center gap-4">
            <Link className="px-6 py-3 rounded-xl btn-primary" to="/tutorials">Start Learning</Link>
            <Link className="px-6 py-3 rounded-xl glass text-white border border-white/20" to="/builder">Build Circuits</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
