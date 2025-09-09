import { useState } from 'react'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '🔬'
  },
  {
    id: 'circuit-builder',
    title: 'Circuit Builder',
    icon: '🔧'
  },
  {
    id: 'visualizer',
    title: 'Visualizer',
    icon: '📊'
  },
  {
    id: 'analysis',
    title: 'Analysis',
    icon: '📈'
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    icon: '📚'
  },
  {
    id: 'tips',
    title: 'Tips & Tricks',
    icon: '💡'
  }
]

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState('overview')

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to QSV - Quantum State Visualizer</h2>
              <p className="text-white/80 mb-4">
                QSV is a powerful web application for building quantum circuits, simulating quantum states, and visualizing quantum phenomena. 
                It combines an intuitive drag-and-drop interface with advanced quantum simulation capabilities powered by Qiskit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-400/30">
                <h3 className="font-semibold text-blue-200 mb-2">🎯 Key Features</h3>
                <ul className="text-sm text-blue-100 space-y-1">
                  <li>• Drag & drop circuit building</li>
                  <li>• Real-time Bloch sphere visualization</li>
                  <li>• Quantum state analysis</li>
                  <li>• Measurement simulation</li>
                  <li>• Circuit export (JSON/QASM)</li>
                </ul>
              </div>

              <div className="bg-green-600/20 p-4 rounded-lg border border-green-400/30">
                <h3 className="font-semibold text-green-200 mb-2">🚀 Getting Started</h3>
                <ol className="text-sm text-green-100 space-y-1">
                  <li>1. Start with the Circuit Builder</li>
                  <li>2. Drag gates to build your circuit</li>
                  <li>3. Use the Visualizer to see results</li>
                  <li>4. Analyze with advanced metrics</li>
                  <li>5. Export your work</li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-600/20 p-4 rounded-lg border border-yellow-400/30">
              <h3 className="font-semibold text-yellow-200 mb-2">⚛️ Quantum Gates Available</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div><span className="font-medium">H</span> - Hadamard</div>
                <div><span className="font-medium">X</span> - Pauli-X (NOT)</div>
                <div><span className="font-medium">Y</span> - Pauli-Y</div>
                <div><span className="font-medium">Z</span> - Pauli-Z</div>
                <div><span className="font-medium">RX</span> - X-Rotation</div>
                <div><span className="font-medium">RY</span> - Y-Rotation</div>
                <div><span className="font-medium">RZ</span> - Z-Rotation</div>
                <div><span className="font-medium">CNOT</span> - Controlled-X</div>
              </div>
            </div>
          </div>
        )

      case 'circuit-builder':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Circuit Builder Guide</h2>
              <p className="text-white/80 mb-4">
                Build quantum circuits using our intuitive drag-and-drop interface.
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass p-4 rounded-lg border border-white/20 shadow-sm">
                <h3 className="font-semibold text-white mb-3">🎯 Basic Operations</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">DRAG</span>
                    <div>
                      <p className="font-medium text-white">Adding Gates</p>
                      <p className="text-sm text-white/80">Drag any gate from the palette and drop it onto a circuit cell</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">CLICK</span>
                    <div>
                      <p className="font-medium text-white">Removing Gates</p>
                      <p className="text-sm text-white/80">Click on any placed gate to remove it from the circuit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">ANGLE</span>
                    <div>
                      <p className="font-medium text-white">Rotation Gates</p>
                      <p className="text-sm text-white/80">RX, RY, RZ gates will prompt for angle input with common presets</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">⚙️ Circuit Management</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Qubit Management</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Add Qubit:</strong> Increase circuit size</li>
                      <li>• <strong>Remove Qubit:</strong> Decrease circuit size</li>
                      <li>• View current qubit and gate count</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Export Options</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>JSON:</strong> QSV native format</li>
                      <li>• <strong>QASM:</strong> OpenQASM standard</li>
                      <li>• <strong>Clear All:</strong> Reset circuit</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2">💡 Pro Tips</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Gates are applied left-to-right (step 0 → step 11)</li>
                  <li>• Hover over drop zones to see visual feedback</li>
                  <li>• Use common angle presets for rotation gates</li>
                  <li>• The circuit grid shows 12 time steps by default</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'visualizer':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Visualizer Guide</h2>
              <p className="text-gray-600 mb-4">
                Explore quantum states through multiple visualization modes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">📊 Visualization Modes</h3>
                <div className="grid gap-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-medium text-blue-800">Bloch Sphere</h4>
                    <p className="text-sm text-gray-600">3D visualization of individual qubit states on the Bloch sphere</p>
                    <ul className="text-xs text-gray-500 mt-1">
                      <li>• Auto-rotation with adjustable speed</li>
                      <li>• Multiple qubits shown as separate vectors</li>
                      <li>• Interactive 3D controls</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-medium text-green-800">Probabilities</h4>
                    <p className="text-sm text-gray-600">Bar chart showing measurement probabilities for each basis state</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="font-medium text-purple-800">Density Matrix</h4>
                    <p className="text-sm text-gray-600">Matrix representation of the quantum state</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-medium text-red-800">Statevector</h4>
                    <p className="text-sm text-gray-600">Raw complex amplitudes of the quantum state</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="font-medium text-yellow-800">Counts</h4>
                    <p className="text-sm text-gray-600">Measurement results from quantum shots (QASM mode)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">⚙️ Simulation Modes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Statevector Mode</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Exact quantum simulation</li>
                      <li>• Perfect state information</li>
                      <li>• No measurement noise</li>
                      <li>• Best for educational purposes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">QASM Mode</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Realistic quantum simulation</li>
                      <li>• Shot-based measurements</li>
                      <li>• Statistical sampling</li>
                      <li>• Configurable shot count</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'analysis':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Features</h2>
              <p className="text-gray-600 mb-4">
                Advanced quantum state analysis and metrics.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">📈 Available Metrics</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-medium text-blue-800">Expectation Values</h4>
                    <p className="text-sm text-gray-600">Pauli X, Y, Z expectation values for each qubit</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-medium text-green-800">Entanglement Entropy</h4>
                    <p className="text-sm text-gray-600">Measure of quantum entanglement between qubit partitions</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="font-medium text-purple-800">State Fidelity</h4>
                    <p className="text-sm text-gray-600">Compare similarity between quantum states</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-medium text-red-800">Participation Ratio</h4>
                    <p className="text-sm text-gray-600">Measure of state localization in computational basis</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">🔬 Advanced Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Noise Simulation</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bit flip errors</li>
                      <li>• Depolarizing noise</li>
                      <li>• Amplitude damping</li>
                      <li>• Realistic quantum device modeling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Multi-Qubit Analysis</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Individual qubit Bloch vectors</li>
                      <li>• Partial trace calculations</li>
                      <li>• Bipartite entanglement</li>
                      <li>• Correlation analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tutorials':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutorials & Examples</h2>
              <p className="text-gray-600 mb-4">
                Learn quantum computing concepts with pre-built circuits.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">📚 Available Tutorials</h3>
                <div className="grid gap-3">
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800">Bell States</h4>
                    <p className="text-sm text-blue-600">Learn about quantum entanglement with Bell state preparation</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <h4 className="font-medium text-green-800">Superposition</h4>
                    <p className="text-sm text-green-600">Explore quantum superposition using Hadamard gates</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <h4 className="font-medium text-purple-800">Quantum Teleportation</h4>
                    <p className="text-sm text-purple-600">Understand quantum information transfer protocols</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">🎯 How to Use Tutorials</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li><span className="font-medium">1.</span> Navigate to the Tutorials page</li>
                  <li><span className="font-medium">2.</span> Select a tutorial from the available options</li>
                  <li><span className="font-medium">3.</span> The circuit will be automatically loaded</li>
                  <li><span className="font-medium">4.</span> Use the Visualizer to explore the results</li>
                  <li><span className="font-medium">5.</span> Modify the circuit to experiment</li>
                </ol>
              </div>
            </div>
          </div>
        )

      case 'tips':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tips & Tricks</h2>
              <p className="text-gray-600 mb-4">
                Maximize your quantum computing experience with these helpful tips.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">⚡ Performance Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Start small:</strong> Begin with 1-2 qubits to understand concepts</li>
                  <li>• <strong>Use statevector mode:</strong> For exact results without noise</li>
                  <li>• <strong>Optimize shots:</strong> Use 1000+ shots for reliable QASM statistics</li>
                  <li>• <strong>Save your work:</strong> Export circuits before making major changes</li>
                </ul>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">🎨 Visualization Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Bloch sphere:</strong> Disable auto-rotation for detailed inspection</li>
                  <li>• <strong>Multiple views:</strong> Switch between tabs to understand different aspects</li>
                  <li>• <strong>Zoom and pan:</strong> Use mouse controls in 3D visualizations</li>
                  <li>• <strong>Compare states:</strong> Use analysis mode to compare different circuits</li>
                </ul>
              </div>

              <div className="bg-white/95 p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">🧪 Experimentation Ideas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Beginner Experiments</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Single qubit rotations</li>
                      <li>• Hadamard + measurement</li>
                      <li>• Pauli gate effects</li>
                      <li>• Phase gate visualization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Advanced Experiments</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bell state preparation</li>
                      <li>• Quantum interference</li>
                      <li>• Entanglement analysis</li>
                      <li>• Noise effect studies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2">🚨 Common Pitfalls</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Remember: quantum gates are unitary (reversible)</li>
                  <li>• Measurement destroys superposition</li>
                  <li>• CNOT gate requires control and target qubits</li>
                  <li>• Rotation angles are in radians, not degrees</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass p-4 rounded-lg shadow-lg border border-white/20 sticky top-6">
              <h1 className="text-lg font-bold text-white mb-4">User Guide</h1>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white font-medium border border-blue-500'
                        : 'text-white/80 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="glass p-6 rounded-lg shadow-lg border border-white/20">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
