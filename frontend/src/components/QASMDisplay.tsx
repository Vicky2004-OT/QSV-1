import { useMemo } from 'react'
import type { Circuit } from '../store/circuitStore'

interface QASMDisplayProps {
  circuit: Circuit
}

// Client-side QASM generation without backend dependency
function generateQASM(circuit: Circuit): string {
  if (!circuit || circuit.gates.length === 0) {
    return ''
  }

  let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\n`
  qasm += `qreg q[${circuit.num_qubits}];\n`
  
  // Check if we have measurements
  const hasMeasurements = circuit.gates.some(g => g.name.toUpperCase() === 'MEASURE')
  if (hasMeasurements) {
    qasm += `creg c[${circuit.num_qubits}];\n`
  }
  qasm += '\n'

  // Sort gates by step
  const sortedGates = [...circuit.gates].sort((a, b) => (a.step || 0) - (b.step || 0))

  for (const gate of sortedGates) {
    const name = gate.name.toUpperCase()
    const targets = gate.targets || []
    const controls = gate.controls || []
    const params = gate.params || []

    if (targets.length === 0) continue

    switch (name) {
      case 'H':
        targets.forEach(t => qasm += `h q[${t}];\n`)
        break
      case 'X':
        targets.forEach(t => qasm += `x q[${t}];\n`)
        break
      case 'Y':
        targets.forEach(t => qasm += `y q[${t}];\n`)
        break
      case 'Z':
        targets.forEach(t => qasm += `z q[${t}];\n`)
        break
      case 'RX':
        const rx_angle = params[0] || 0
        targets.forEach(t => qasm += `rx(${rx_angle}) q[${t}];\n`)
        break
      case 'RY':
        const ry_angle = params[0] || 0
        targets.forEach(t => qasm += `ry(${ry_angle}) q[${t}];\n`)
        break
      case 'RZ':
        const rz_angle = params[0] || 0
        targets.forEach(t => qasm += `rz(${rz_angle}) q[${t}];\n`)
        break
      case 'CNOT':
      case 'CX':
        if (controls.length > 0) {
          controls.forEach(c => {
            targets.forEach(t => qasm += `cx q[${c}],q[${t}];\n`)
          })
        }
        break
      case 'CZ':
        if (controls.length > 0) {
          controls.forEach(c => {
            targets.forEach(t => qasm += `cz q[${c}],q[${t}];\n`)
          })
        }
        break
      case 'MEASURE':
        targets.forEach(t => qasm += `measure q[${t}] -> c[${t}];\n`)
        break
      case 'S':
        targets.forEach(t => qasm += `s q[${t}];\n`)
        break
      case 'T':
        targets.forEach(t => qasm += `t q[${t}];\n`)
        break
      case 'SWAP':
        if (targets.length >= 2) {
          qasm += `swap q[${targets[0]}],q[${targets[1]}];\n`
        }
        break
      default:
        // For unknown gates, add as comment
        qasm += `// Unknown gate: ${name}\n`
    }
  }

  return qasm
}

export default function QASMDisplay({ circuit }: QASMDisplayProps) {
  const qasmCode = useMemo(() => generateQASM(circuit), [circuit])

  if (!qasmCode) {
    return (
      <div className="bg-gray-100 border rounded p-3 min-h-[120px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Add gates to see QASM code</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 border rounded p-3 min-h-[120px] max-h-[300px] overflow-auto">
      <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">
        {qasmCode}
      </pre>
    </div>
  )
}
