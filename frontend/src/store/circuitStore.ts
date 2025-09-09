import { create } from 'zustand'

export type Gate = {
  name: string
  targets: number[]
  controls?: number[]
  params?: number[]
  step?: number
}

export type Circuit = {
  num_qubits: number
  gates: Gate[]
}

type CircuitState = {
  circuit: Circuit
  setCircuit: (c: Circuit) => void
  reset: (qubits?: number) => void
}

export const useCircuitStore = create<CircuitState>((set) => ({
  circuit: { num_qubits: 2, gates: [] },
  setCircuit: (circuit: Circuit) => set({ circuit }),
  reset: (qubits = 2) => set({ circuit: { num_qubits: qubits, gates: [] } }),
}))
