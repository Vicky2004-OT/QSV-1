import type { Circuit } from '../store/circuitStore'

export async function apiSimulate(circuit: Circuit, shots = 0) {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ circuit, shots }),
  })
  if (!res.ok) throw new Error('simulate failed')
  return res.json()
}

export async function apiState(circuit: Circuit) {
  const res = await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ circuit }),
  })
  if (!res.ok) throw new Error('state failed')
  return res.json()
}

export async function apiAnalysis(circuit: Circuit, target_statevector?: Array<number>) {
  const res = await fetch('/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ circuit, target_statevector }),
  })
  if (!res.ok) throw new Error('analysis failed')
  return res.json()
}
