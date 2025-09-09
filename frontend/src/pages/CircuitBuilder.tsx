import { useCircuitStore, type Gate } from '../store/circuitStore'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import QASMDisplay from '../components/QASMDisplay'

const PALETTE: Array<{ name: string; color: string }> = [
  { name: 'H', color: 'bg-blue-200 border-blue-400 text-blue-900' },
  { name: 'X', color: 'bg-red-200 border-red-400 text-red-900' },
  { name: 'Y', color: 'bg-green-200 border-green-400 text-green-900' },
  { name: 'Z', color: 'bg-purple-200 border-purple-400 text-purple-900' },
  { name: 'RX', color: 'bg-orange-200 border-orange-400 text-orange-900' },
  { name: 'RY', color: 'bg-yellow-200 border-yellow-400 text-yellow-900' },
  { name: 'RZ', color: 'bg-pink-200 border-pink-400 text-pink-900' },
  { name: 'CNOT', color: 'bg-indigo-200 border-indigo-400 text-indigo-900' },
]

// Draggable Gate Component
function DraggableGate({ gate }: { gate: { name: string; color: string } }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `gate-${gate.name}`,
    data: { type: 'gate', name: gate.name }
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 border rounded text-center text-sm cursor-grab active:cursor-grabbing font-bold ${gate.color} hover:shadow-md transition-shadow`}
    >
      {gate.name}
    </div>
  )
}

// Droppable Circuit Cell Component
function DroppableCell({ qubit, step, gate, onGateRemove }: {
  qubit: number;
  step: number;
  gate?: Gate;
  onGateRemove: (qubit: number, step: number) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${qubit}-${step}`,
    data: { type: 'cell', qubit, step }
  })

  const gateColor = gate ? PALETTE.find(p => p.name === gate.name)?.color || 'bg-gray-100' : ''

  return (
    <td ref={setNodeRef} className="border border-white/20 p-1 text-center glass">
      <button
        className={`w-full h-10 border rounded text-xs transition-colors ${
          isOver ? 'bg-blue-500 border-blue-400 text-white' : 
          gate ? `${gateColor} font-bold` : 
          'glass hover:bg-white/10 border-white/20 text-white/80'
        }`}
        onClick={() => gate ? onGateRemove(qubit, step) : undefined}
      >
        {gate ? gate.name : '+'}
      </button>
    </td>
  )
}

export default function CircuitBuilder() {
  const { circuit, setCircuit } = useCircuitStore()
  const [activeGate, setActiveGate] = useState<string | null>(null)
  const [showAngleModal, setShowAngleModal] = useState(false)
  const [pendingGate, setPendingGate] = useState<{name: string, qubit: number, step: number} | null>(null)
  const [angle, setAngle] = useState<number>(Math.PI / 4)

  // Removed unused functions - using inline handlers instead

  const addGate = (name: string, q: number, step: number, params?: number[]) => {
    // Check if gate needs angle parameter
    if (['RX', 'RY', 'RZ'].includes(name.toUpperCase()) && !params) {
      setPendingGate({ name, qubit: q, step })
      setShowAngleModal(true)
      return
    }
    
    // Remove existing gate at this position first
    const filteredGates = circuit.gates.filter(g => !(g.step === step && g.targets?.includes(q)))
    const g: Gate = { name, targets: [q], step, params: params || [] }
    setCircuit({ ...circuit, gates: [...filteredGates, g] })
  }

  const confirmAngle = () => {
    if (pendingGate) {
      addGate(pendingGate.name, pendingGate.qubit, pendingGate.step, [angle])
      setShowAngleModal(false)
      setPendingGate(null)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'gate') {
      setActiveGate(active.data.current.name)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveGate(null)

    if (!over || !active.data.current || !over.data.current) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData.type === 'gate' && overData.type === 'cell') {
      addGate(activeData.name, overData.qubit, overData.step)
    }
  }

  const clearCell = (q: number, step: number) => {
    setCircuit({ ...circuit, gates: circuit.gates.filter(g => !(g.step === step && g.targets?.includes(q))) })
  }

  const steps = 12
  const cells: Record<string, Gate | undefined> = {}
  for (const g of circuit.gates) {
    if (g.step != null && g.targets && g.targets.length > 0) {
      const key = `${g.targets[0]}:${g.step}`
      cells[key] = g
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="glass p-4 rounded-lg border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Circuit ({circuit.num_qubits} qubits, {circuit.gates.length} gates)</h3>
          <div className="flex gap-2">
            <button onClick={() => setCircuit({ ...circuit, num_qubits: Math.min(8, circuit.num_qubits + 1) })} className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">+ Qubit</button>
            <button onClick={() => setCircuit({ ...circuit, num_qubits: Math.max(1, circuit.num_qubits - 1), gates: circuit.gates.filter(g => !g.targets.some(t => t >= circuit.num_qubits - 1)) })} className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">- Qubit</button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-3 glass p-4 border border-white/20 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-white">Gate Palette</h3>
            <div className="grid grid-cols-4 gap-2">
              {PALETTE.map((gate) => (
                <DraggableGate key={gate.name} gate={gate} />
              ))}
            </div>
            <div className="text-xs text-white/60 mt-3">
              Drag gates from here to circuit cells below
            </div>
          </aside>

          <section className="col-span-6 glass p-4 border border-white/20 rounded-lg shadow-lg">
            <div className="font-semibold mb-2 text-white">Quantum Circuit</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-white/20 p-2 text-left font-medium text-white bg-black/20">Qubit</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="border border-white/20 p-2 text-center font-medium text-xs text-white bg-black/20">Step {i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: circuit.num_qubits }).map((_, q) => (
                    <tr key={q}>
                      <td className="border border-white/20 p-2 font-medium text-white glass">q{q}</td>
                      {Array.from({ length: steps }).map((_, s) => {
                        const key = `${q}:${s}`
                        const g = cells[key]
                        return (
                          <DroppableCell
                            key={s}
                            qubit={q}
                            step={s}
                            gate={g}
                            onGateRemove={clearCell}
                          />
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="col-span-3 p-4 border border-gray-300 rounded-lg shadow-lg bg-white/95 backdrop-blur-sm space-y-4">
            <div>
              <div className="font-semibold mb-2 text-gray-800">Circuit Actions</div>
              <button 
                className="w-full px-3 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50 mb-2"
                onClick={() => setCircuit({ ...circuit, gates: [] })}
              >
                Clear All Gates
              </button>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-gray-800">Export</div>
              <div className="space-y-2">
                <button 
                  className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 bg-white hover:bg-gray-50" 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(circuit, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'circuit.json'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Export JSON
                </button>
              </div>
            </div>

            {/* Measurement Section */}
            <div>
              <div className="font-semibold mb-2 text-gray-800">Measurement</div>
              <button 
                className="w-full px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={() => {
                  // Add measurement to all qubits at the end of the circuit
                  const maxStep = Math.max(0, ...circuit.gates.map(g => g.step || 0))
                  const measurementGates = Array.from({ length: circuit.num_qubits }, (_, i) => ({
                    id: `measure-${i}-${Date.now()}`,
                    name: 'MEASURE',
                    targets: [i],
                    controls: [],
                    step: maxStep + 1,
                    params: []
                  }))
                  
                  setCircuit({
                    ...circuit,
                    gates: [...circuit.gates, ...measurementGates]
                  })
                }}
              >
                Add Measurements
              </button>
              <p className="text-xs text-gray-600 mt-1">
                Adds measurement operations to all qubits
              </p>
            </div>

            {/* QASM Code Display Panel */}
            <div>
              <div className="font-semibold mb-2 text-gray-800">QASM Code</div>
              <QASMDisplay circuit={circuit} />
            </div>
          </aside>
        </div>
        
        <DragOverlay>
          {activeGate ? (
            <div className="px-3 py-2 border rounded text-center text-sm bg-blue-100 border-blue-300 shadow-lg">
              {activeGate}
            </div>
          ) : null}
        </DragOverlay>
        
        {/* Angle Input Modal */}
        {showAngleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Set Rotation Angle</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Angle (radians): {angle.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min={-Math.PI * 2}
                    max={Math.PI * 2}
                    step={0.01}
                    value={angle}
                    onChange={(e) => setAngle(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-2π</span>
                    <span>0</span>
                    <span>2π</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Common angles:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'π/4', value: Math.PI / 4 },
                      { label: 'π/2', value: Math.PI / 2 },
                      { label: 'π', value: Math.PI },
                      { label: '2π', value: 2 * Math.PI }
                    ].map(({ label, value }) => (
                      <button
                        key={label}
                        onClick={() => setAngle(value)}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={confirmAngle}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Gate
                  </button>
                  <button
                    onClick={() => {
                      setShowAngleModal(false)
                      setPendingGate(null)
                    }}
                    className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  )
}
