import BlochSphere from '../components/BlochSphere'

export default function Visualizer() {

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quantum State Visualizer</h1>
          <p className="text-gray-300">Interactive Bloch Sphere Visualization</p>
        </div>

        <div className="w-full">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Bloch Sphere</h2>
            <div className="min-h-[500px]">
              <BlochSphere vectors={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}