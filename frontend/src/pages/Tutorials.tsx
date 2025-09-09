import { useState } from 'react'
import { useCircuitStore } from '../store/circuitStore'

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  theory: string
  steps: string[]
  circuit: any
  externalLink?: string
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'superposition',
    title: 'Quantum Superposition with Hadamard Gate',
    description: 'Learn how to create superposition using the Hadamard gate - the foundation of quantum computing.',
    difficulty: 'Beginner',
    theory: `
**What is Superposition?**

Quantum superposition is a fundamental principle where a quantum system can exist in multiple states simultaneously until measured. Unlike classical bits that are either 0 or 1, quantum bits (qubits) can be in a combination of both states.

**The Hadamard Gate**

The Hadamard gate is one of the most important gates in quantum computing. It creates an equal superposition of |0⟩ and |1⟩ states:
- |0⟩ → (|0⟩ + |1⟩)/√2 (called |+⟩ state)
- |1⟩ → (|0⟩ - |1⟩)/√2 (called |-⟩ state)

When measured, a qubit in superposition has a 50% probability of collapsing to |0⟩ and 50% to |1⟩.

**Mathematical Representation**

The Hadamard gate matrix is:
H = (1/√2) [[1, 1], [1, -1]]

This corresponds to a π rotation around the Z-axis followed by π/2 around the Y-axis on the Bloch sphere.
    `,
    steps: [
      'Start with a single qubit initialized to |0⟩ state',
      'Apply a Hadamard (H) gate to create superposition',
      'Add measurement operations to observe the probabilistic outcomes',
      'Run the circuit multiple times to see the 50/50 distribution',
      'Visualize the qubit state on the Bloch sphere'
    ],
    circuit: {
      num_qubits: 1,
      gates: [
        { id: 'h1', name: 'H', targets: [0], controls: [], step: 0, params: [] },
        { id: 'm1', name: 'MEASURE', targets: [0], controls: [], step: 1, params: [] }
      ]
    }
  },
  {
    id: 'bell-state',
    title: 'Bell States and Quantum Entanglement',
    description: 'Create maximally entangled two-qubit states that demonstrate the mysterious quantum entanglement.',
    difficulty: 'Beginner',
    theory: `
**What are Bell States?**

Bell states are the four maximally entangled two-qubit quantum states, named after physicist John Stewart Bell. They represent the simplest examples of quantum entanglement where measuring one qubit instantly determines the state of the other, regardless of distance.

**The Four Bell States:**

1. |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 - Both qubits have same measurement outcome
2. |Φ⁻⟩ = (|00⟩ - |11⟩)/√2 - Both qubits have same outcome with phase difference
3. |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2 - Qubits have opposite measurement outcomes
4. |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2 - Opposite outcomes with phase difference

**Creating the First Bell State**

The most common Bell state |Φ⁺⟩ is created using:
1. Hadamard gate on the first qubit (creates superposition)
2. CNOT gate with first qubit as control, second as target

This creates perfect correlation: if you measure 0 on the first qubit, you'll always get 0 on the second, and vice versa for 1.

**Applications**

Bell states are fundamental to quantum teleportation, quantum cryptography, and quantum error correction protocols.
    `,
    steps: [
      'Initialize two qubits in |00⟩ state',
      'Apply Hadamard gate to the first qubit (control)',
      'Apply CNOT gate with first qubit as control, second as target',
      'Add measurements to both qubits',
      'Observe the correlated measurement outcomes (00 or 11 only)',
      'Visualize both qubits on separate Bloch spheres'
    ],
    circuit: {
      num_qubits: 2,
      gates: [
        { id: 'h1', name: 'H', targets: [0], controls: [], step: 0, params: [] },
        { id: 'cnot1', name: 'CNOT', targets: [1], controls: [0], step: 1, params: [] },
        { id: 'm1', name: 'MEASURE', targets: [0], controls: [], step: 2, params: [] },
        { id: 'm2', name: 'MEASURE', targets: [1], controls: [], step: 2, params: [] }
      ]
    }
  },
  {
    id: 'quantum-interference',
    title: 'Quantum Interference and Phase',
    description: 'Explore how quantum phases create constructive and destructive interference patterns.',
    difficulty: 'Intermediate',
    theory: `
**Quantum Interference**

Quantum interference occurs when quantum amplitudes add together, either constructively (amplifying probability) or destructively (canceling probability). This is fundamentally different from classical interference and is key to quantum algorithms.

**Phase and the Bloch Sphere**

Quantum states have both amplitude and phase. While global phase is unobservable, relative phases between different computational basis states create measurable interference effects.

**The Mach-Zehnder Interferometer**

This circuit demonstrates quantum interference:
1. Create superposition with Hadamard
2. Apply phase rotation (RZ gate)
3. Apply second Hadamard to recombine paths
4. Measure to observe interference pattern

**Phase Gates**

- RZ(θ): Rotates around Z-axis by angle θ
- S gate: RZ(π/2) - adds π/2 phase
- T gate: RZ(π/4) - adds π/4 phase

The interference pattern depends on the phase difference, allowing control over measurement probabilities.
    `,
    steps: [
      'Start with qubit in |0⟩ state',
      'Apply first Hadamard to create superposition',
      'Apply RZ gate to introduce phase (try different angles)',
      'Apply second Hadamard to create interference',
      'Measure and observe how phase affects probability',
      'Try RZ(0), RZ(π/2), RZ(π) to see different outcomes'
    ],
    circuit: {
      num_qubits: 1,
      gates: [
        { id: 'h1', name: 'H', targets: [0], controls: [], step: 0, params: [] },
        { id: 'rz1', name: 'RZ', targets: [0], controls: [], step: 1, params: [Math.PI/2] },
        { id: 'h2', name: 'H', targets: [0], controls: [], step: 2, params: [] },
        { id: 'm1', name: 'MEASURE', targets: [0], controls: [], step: 3, params: [] }
      ]
    },
    externalLink: 'https://qiskit.org/textbook/ch-algorithms/quantum-phase-estimation.html'
  },
  {
    id: 'deutsch-algorithm',
    title: 'Deutsch Algorithm - First Quantum Advantage',
    description: 'Implement the first quantum algorithm that demonstrates exponential speedup over classical computing.',
    difficulty: 'Advanced',
    theory: `
**The Deutsch Problem**

Given a black-box function f that takes 1 bit input and produces 1 bit output, determine if f is constant (always returns 0 or always returns 1) or balanced (returns 0 for one input and 1 for the other).

**Classical Solution**

Classically, you need to evaluate f(0) and f(1) - requiring 2 function calls in the worst case.

**Quantum Solution**

The Deutsch algorithm solves this with just 1 quantum function call using superposition and interference:

1. Prepare qubits in |+⟩|-⟩ state
2. Apply quantum oracle Uf
3. Apply Hadamard to first qubit
4. Measure first qubit

**The Oracle**

The oracle Uf implements: |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩

For this tutorial, we'll implement f(x) = x (balanced function) using a CNOT gate.

**Result Interpretation**

- Measure |0⟩: f is constant
- Measure |1⟩: f is balanced

This demonstrates quantum parallelism - evaluating f on all inputs simultaneously.
    `,
    steps: [
      'Initialize two qubits: |0⟩|0⟩',
      'Apply X gate to second qubit: |0⟩|1⟩',
      'Apply Hadamard to both qubits: |+⟩|-⟩',
      'Apply oracle (CNOT for balanced function f(x)=x)',
      'Apply Hadamard to first qubit',
      'Measure first qubit - should always give |1⟩ (balanced)',
      'Try different oracles to see constant vs balanced results'
    ],
    circuit: {
      num_qubits: 2,
      gates: [
        { id: 'x1', name: 'X', targets: [1], controls: [], step: 0, params: [] },
        { id: 'h1', name: 'H', targets: [0], controls: [], step: 1, params: [] },
        { id: 'h2', name: 'H', targets: [1], controls: [], step: 1, params: [] },
        { id: 'cnot1', name: 'CNOT', targets: [1], controls: [0], step: 2, params: [] },
        { id: 'h3', name: 'H', targets: [0], controls: [], step: 3, params: [] },
        { id: 'm1', name: 'MEASURE', targets: [0], controls: [], step: 4, params: [] }
      ]
    },
    externalLink: 'https://qiskit.org/textbook/ch-algorithms/deutsch-jozsa.html'
  }
]

export default function Tutorials() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const setCircuit = useCircuitStore((s) => s.setCircuit)

  const loadTutorial = (tutorial: Tutorial) => {
    setCircuit(tutorial.circuit)
    setSelectedTutorial(tutorial)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedTutorial) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedTutorial(null)}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Tutorials
          </button>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedTutorial.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                  {selectedTutorial.difficulty}
                </span>
              </div>
              <button
                onClick={() => loadTutorial(selectedTutorial)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Load Circuit
              </button>
            </div>

            <p className="text-gray-300 text-lg mb-8">{selectedTutorial.description}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Theory Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Theory</h2>
                <div className="bg-white/5 rounded-lg p-6 text-gray-300 whitespace-pre-line">
                  {selectedTutorial.theory}
                </div>
                
                {selectedTutorial.externalLink && (
                  <div className="mt-4">
                    <a 
                      href={selectedTutorial.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      📚 Learn More (External Link)
                    </a>
                  </div>
                )}
              </div>

              {/* Steps Section */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Implementation Steps</h2>
                <div className="space-y-3">
                  {selectedTutorial.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Next Steps</h3>
                  <p className="text-gray-300 text-sm">
                    Click "Load Circuit" to automatically build this circuit in the Builder tab. 
                    Then switch to the Visualizer to see the Bloch sphere representation, 
                    or go to Analysis to see the measurement outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quantum Computing Tutorials</h1>
          <p className="text-gray-300">
            Learn quantum computing concepts through interactive tutorials. Each tutorial includes theory, 
            step-by-step instructions, and hands-on circuit building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {TUTORIALS.map((tutorial) => (
            <div key={tutorial.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{tutorial.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{tutorial.description}</p>
              
              <button
                onClick={() => setSelectedTutorial(tutorial)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Tutorial
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Learning Path Recommendation</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🟢</div>
              <h3 className="font-semibold text-green-300">Beginner</h3>
              <p className="text-sm text-gray-300">Start with Superposition, then Bell States</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🟡</div>
              <h3 className="font-semibold text-yellow-300">Intermediate</h3>
              <p className="text-sm text-gray-300">Learn Quantum Interference and Phase</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔴</div>
              <h3 className="font-semibold text-red-300">Advanced</h3>
              <p className="text-sm text-gray-300">Implement Quantum Algorithms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
