import { useState, useEffect, useMemo } from 'react'
import { useCircuitStore } from '../store/circuitStore'
import Plot from 'react-plotly.js'

export type BlochVector = { x: number; y: number; z: number; label?: string }

interface BlochSphereProps {
  vectors?: BlochVector[]
  autoRotate?: boolean
  speed?: number
}

// Client-side quantum state calculation
function calculateBlochVector(circuit: any): [number, number, number] {
  if (!circuit || circuit.gates.length === 0) {
    return [0, 0, 1] // |0⟩ state
  }

  const numQubits = circuit.num_qubits
  if (numQubits === 0) return [0, 0, 1]

  // Initialize state vector for first qubit in |0⟩
  let alpha = 1 // amplitude for |0⟩
  let beta = 0  // amplitude for |1⟩
  let phase = 0 // global phase

  // Sort gates by step and apply only single-qubit gates to first qubit
  const sortedGates = [...circuit.gates].sort((a, b) => (a.step || 0) - (b.step || 0))
  
  for (const gate of sortedGates) {
    // Only process gates that target the first qubit (qubit 0)
    if (!gate.targets?.includes(0)) continue
    
    const gateName = gate.name.toUpperCase()
    
    switch (gateName) {
      case 'H': // Hadamard gate
        const newAlpha = (alpha + beta) / Math.sqrt(2)
        const newBeta = (alpha - beta) / Math.sqrt(2)
        alpha = newAlpha
        beta = newBeta
        break
        
      case 'X': // Pauli-X gate
        [alpha, beta] = [beta, alpha]
        break
        
      case 'Y': // Pauli-Y gate
        // Y gate swaps and adds phase: |0⟩ → i|1⟩, |1⟩ → -i|0⟩
        [alpha, beta] = [-beta, alpha]
        break
        
      case 'Z': // Pauli-Z gate
        beta = -beta
        break
        
      case 'RX': // Rotation around X-axis
        const theta_x = gate.params?.[0] || 0
        const cos_half_x = Math.cos(theta_x / 2)
        const sin_half_x = Math.sin(theta_x / 2)
        const newAlpha_x = cos_half_x * alpha - sin_half_x * beta
        const newBeta_x = cos_half_x * beta - sin_half_x * alpha
        alpha = newAlpha_x
        beta = newBeta_x
        break
        
      case 'RY': // Rotation around Y-axis
        const theta_y = gate.params?.[0] || 0
        const cos_half_y = Math.cos(theta_y / 2)
        const sin_half_y = Math.sin(theta_y / 2)
        const newAlpha_y = cos_half_y * alpha - sin_half_y * beta
        const newBeta_y = cos_half_y * beta + sin_half_y * alpha
        alpha = newAlpha_y
        beta = newBeta_y
        break
        
      case 'RZ': // Rotation around Z-axis
        const theta_z = gate.params?.[0] || 0
        // RZ gate adds phase: e^(-iθ/2)|0⟩ and e^(iθ/2)|1⟩
        // For real calculation, we track phase separately
        phase += theta_z / 2
        break
    }
  }

  // Calculate Bloch vector coordinates
  // For a state α|0⟩ + β|1⟩, the Bloch vector is:
  const alphaMag = Math.abs(alpha)
  const betaMag = Math.abs(beta)
  const alphaPhase = Math.atan2(0, alpha) // Assuming real for simplicity
  const betaPhase = Math.atan2(0, beta) + phase
  
  // Bloch sphere coordinates
  const x = 2 * alphaMag * betaMag * Math.cos(betaPhase - alphaPhase)
  const y = 2 * alphaMag * betaMag * Math.sin(betaPhase - alphaPhase)
  const z = alphaMag * alphaMag - betaMag * betaMag

  return [x, y, z]
}

export default function BlochSphere({ }: BlochSphereProps) {
  const { circuit } = useCircuitStore()
  const [blochVector, setBlochVector] = useState<[number, number, number]>([0, 0, 1])
  const [loading, setLoading] = useState(false)

  // Update Bloch vector when circuit changes
  useEffect(() => {
    const updateBlochVector = () => {
      setLoading(true)
      try {
        const vec = calculateBlochVector(circuit)
        setBlochVector(vec)
      } catch (error) {
        console.error('Error updating Bloch vector:', error)
        setBlochVector([0, 0, 1]) // Default to |0⟩
      } finally {
        setLoading(false)
      }
    }

    updateBlochVector()
  }, [circuit])

  // Create Plotly figure exactly like Streamlit
  const plotlyData = useMemo(() => {
    // Create sphere surface exactly like Streamlit
    const u = Array.from({ length: 60 }, (_, i) => (i * 2 * Math.PI) / 60)
    const v = Array.from({ length: 30 }, (_, i) => (i * Math.PI) / 30)
    
    const x: number[][] = []
    const y: number[][] = []
    const z: number[][] = []
    
    for (let i = 0; i < u.length; i++) {
      x[i] = []
      y[i] = []
      z[i] = []
      for (let j = 0; j < v.length; j++) {
        x[i][j] = Math.cos(u[i]) * Math.sin(v[j])
        y[i][j] = Math.sin(u[i]) * Math.sin(v[j])
        z[i][j] = Math.cos(v[j])
      }
    }

    const [bx, by, bz] = blochVector
    const axisLen = 1.1

    return [
      // Sphere surface
      {
        type: 'surface' as const,
        x: x,
        y: y,
        z: z,
        opacity: 0.2,
        showscale: false,
        colorscale: 'Blues'
      },
      // X axis
      {
        type: 'scatter3d' as const,
        x: [-axisLen, axisLen],
        y: [0, 0],
        z: [0, 0],
        mode: 'lines' as const,
        name: 'X',
        line: { color: 'red', width: 4 }
      },
      // Y axis
      {
        type: 'scatter3d' as const,
        x: [0, 0],
        y: [-axisLen, axisLen],
        z: [0, 0],
        mode: 'lines' as const,
        name: 'Y',
        line: { color: 'green', width: 4 }
      },
      // Z axis
      {
        type: 'scatter3d' as const,
        x: [0, 0],
        y: [0, 0],
        z: [-axisLen, axisLen],
        mode: 'lines' as const,
        name: 'Z',
        line: { color: 'blue', width: 4 }
      },
      // Bloch vector
      {
        type: 'scatter3d' as const,
        x: [0, bx],
        y: [0, by],
        z: [0, bz],
        mode: 'lines+markers' as const,
        name: 'State',
        line: { color: 'yellow', width: 6 },
        marker: { size: 8, color: 'yellow' }
      }
    ]
  }, [blochVector])

  const layout = {
    title: 'Bloch Sphere',
    scene: {
      xaxis: { title: 'X', range: [-1.2, 1.2] },
      yaxis: { title: 'Y', range: [-1.2, 1.2] },
      zaxis: { title: 'Z', range: [-1.2, 1.2] },
      aspectmode: 'cube' as const,
      bgcolor: 'rgba(0,0,0,0)'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
    margin: { l: 0, r: 0, t: 40, b: 0 }
  }

  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Bloch Sphere...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px]">
      <Plot
        data={plotlyData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
