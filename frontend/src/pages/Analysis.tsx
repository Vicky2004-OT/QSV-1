import { useMemo } from 'react'
import { useCircuitStore } from '../store/circuitStore'

// Simple client-side quantum simulation for basic gates
function simulateCircuit(circuit: any) {
  if (!circuit || circuit.gates.length === 0) {
    return { probabilities: [], counts: {} }
  }

  const numQubits = circuit.num_qubits
  const numStates = Math.pow(2, numQubits)
  
  // Initialize state vector (all qubits in |0⟩)
  let stateVector = new Array(numStates).fill(0)
  stateVector[0] = 1 // |00...0⟩ state
  
  // Sort gates by step
  const sortedGates = [...circuit.gates].sort((a, b) => (a.step || 0) - (b.step || 0))
  
  // Apply basic gates (simplified simulation)
  for (const gate of sortedGates) {
    if (gate.name.toUpperCase() === 'H' && gate.targets?.length > 0) {
      const qubit = gate.targets[0]
      // Apply Hadamard gate (simplified)
      const newStateVector = new Array(numStates).fill(0)
      for (let i = 0; i < numStates; i++) {
        const bit = (i >> qubit) & 1
        if (bit === 0) {
          const flipped = i | (1 << qubit)
          newStateVector[i] += stateVector[i] / Math.sqrt(2)
          newStateVector[flipped] += stateVector[i] / Math.sqrt(2)
        } else {
          const flipped = i & ~(1 << qubit)
          newStateVector[i] += stateVector[flipped] / Math.sqrt(2)
          newStateVector[flipped] -= stateVector[flipped] / Math.sqrt(2)
        }
      }
      stateVector = newStateVector
    }
    // Add more gates as needed...
  }
  
  // Calculate probabilities
  const probabilities = stateVector.map(amp => Math.abs(amp) ** 2)
  
  // Generate mock measurement counts
  const counts: Record<string, number> = {}
  const shots = 1024
  for (let i = 0; i < numStates; i++) {
    if (probabilities[i] > 0.001) { // Only show significant probabilities
      const binaryState = i.toString(2).padStart(numQubits, '0')
      counts[binaryState] = Math.round(probabilities[i] * shots)
    }
  }
  
  return { probabilities, counts }
}

export default function Analysis() {
  const { circuit } = useCircuitStore()
  
  const { counts } = useMemo(() => {
    return simulateCircuit(circuit)
  }, [circuit])

  const labels = Object.keys(counts)
  const values = labels.map((k) => counts[k])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quantum Circuit Analysis</h1>
          <p className="text-gray-300">
            Basic analysis of your quantum circuit (simplified simulation)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Circuit Info */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Circuit Information</h2>
            
            <div className="space-y-2 text-gray-300">
              <div>Qubits: {circuit?.num_qubits || 0}</div>
              <div>Gates: {circuit?.gates?.length || 0}</div>
              <div>Depth: {Math.max(0, ...(circuit?.gates?.map(g => g.step || 0) || [0]))}</div>
            </div>

            {circuit?.gates && circuit.gates.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Gate Summary</h3>
                <div className="text-sm text-gray-300">
                  {Object.entries(
                    circuit.gates.reduce((acc, gate) => {
                      acc[gate.name] = (acc[gate.name] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([gate, count]) => (
                    <div key={gate}>{gate}: {count}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Measurement Counts */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Expected Measurement Counts</h3>
            {labels.length > 0 ? (
              <div className="space-y-2">
                {labels.map((label, i) => (
                  <div key={label} className="flex justify-between items-center text-gray-300">
                    <span className="font-mono">|{label}⟩</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(values[i] / Math.max(...values)) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right">{values[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Build a circuit to see measurement predictions
              </div>
            )}
          </div>
        </div>

        {circuit?.gates && circuit.gates.length === 0 && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <div className="text-yellow-300 text-center">
              <h3 className="text-lg font-semibold mb-2">No Circuit Built</h3>
              <p>Go to the Builder tab to create a quantum circuit, then return here for analysis.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
