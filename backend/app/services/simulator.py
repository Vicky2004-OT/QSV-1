from __future__ import annotations

from typing import Any, Dict, List, Tuple

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, DensityMatrix, Pauli, partial_trace
from qiskit_aer import Aer
from qiskit_aer.noise import NoiseModel, pauli_error, amplitude_damping_error
from qiskit import transpile


def build_qiskit_circuit(num_qubits: int, gates: List[Dict[str, Any]]) -> QuantumCircuit:
    qc = QuantumCircuit(num_qubits, num_qubits)

    gates_sorted = sorted(gates, key=lambda g: g.get('step', 0))

    for g in gates_sorted:
        name = g.get('name')
        targets: List[int] = g.get('targets', [])
        controls: List[int] = g.get('controls', [])
        params: List[float] = g.get('params', [])

        if name is None or not targets:
            continue

        if name.upper() in {"X", "Y", "Z", "H", "S", "T"}:
            for t in targets:
                getattr(qc, name.lower())(t)
        elif name.upper() == "RX":
            theta = params[0] if params else 0.0
            for t in targets:
                qc.rx(theta, t)
        elif name.upper() == "RY":
            theta = params[0] if params else 0.0
            for t in targets:
                qc.ry(theta, t)
        elif name.upper() == "RZ":
            theta = params[0] if params else 0.0
            for t in targets:
                qc.rz(theta, t)
        elif name.upper() in {"U", "U3"}:
            th, ph, lm = (params + [0.0, 0.0, 0.0])[:3]
            for t in targets:
                qc.u(th, ph, lm, t)
        elif name.upper() in {"CX", "CNOT"}:
            for ctrl in controls:
                for t in targets:
                    qc.cx(ctrl, t)
        elif name.upper() == "CZ":
            for ctrl in controls:
                for t in targets:
                    qc.cz(ctrl, t)
        elif name.upper() == "SWAP":
            if len(targets) >= 2:
                qc.swap(targets[0], targets[1])
        elif name.upper() in {"CCX", "TOFFOLI"}:
            if len(controls) >= 2 and len(targets) >= 1:
                qc.ccx(controls[0], controls[1], targets[0])
        elif name.upper() == "MEASURE":
            for t in targets:
                qc.measure(t, t)
        elif name.upper() == "RESET":
            for t in targets:
                qc.reset(t)
        elif name.upper() == "BARRIER":
            qc.barrier()
        elif name.upper() in {"P", "PHASE"}:
            # Phase gate
            phase = params[0] if params else 0.0
            for t in targets:
                qc.p(phase, t)
        elif name.upper() == "U1":
            # U1 gate (phase gate)
            phase = params[0] if params else 0.0
            for t in targets:
                qc.p(phase, t)
        elif name.upper() == "U2":
            # U2 gate
            phi = params[0] if len(params) > 0 else 0.0
            lam = params[1] if len(params) > 1 else 0.0
            for t in targets:
                qc.u(np.pi/2, phi, lam, t)
        elif name.upper() in {"CRX", "CRY", "CRZ"}:
            # Controlled rotation gates
            theta = params[0] if params else 0.0
            for ctrl in controls:
                for t in targets:
                    if name.upper() == "CRX":
                        qc.crx(theta, ctrl, t)
                    elif name.upper() == "CRY":
                        qc.cry(theta, ctrl, t)
                    elif name.upper() == "CRZ":
                        qc.crz(theta, ctrl, t)
        else:
            continue

    return qc


def build_noise_model(bit_flip_prob: float | None, depolarizing_prob: float | None, amplitude_damping_gamma: float | None) -> NoiseModel | None:
    if not any([bit_flip_prob, depolarizing_prob, amplitude_damping_gamma]):
        return None
    nm = NoiseModel()
    if bit_flip_prob and bit_flip_prob > 0:
        p = float(bit_flip_prob)
        x_error = pauli_error([('X', p), ('I', 1 - p)])
        nm.add_all_qubit_quantum_error(x_error, ['x'])
    if depolarizing_prob and depolarizing_prob > 0:
        p = float(depolarizing_prob)
        dep_err = pauli_error([('X', p/3), ('Y', p/3), ('Z', p/3), ('I', 1 - p)])
        nm.add_all_qubit_quantum_error(dep_err, ['x', 'y', 'z', 'h', 'cx'])
    if amplitude_damping_gamma and amplitude_damping_gamma > 0:
        g = float(amplitude_damping_gamma)
        ad = amplitude_damping_error(g)
        nm.add_all_qubit_quantum_error(ad, ['id', 'u', 'x', 'y', 'z'])
    return nm


def simulate_statevector(num_qubits: int, gates: List[Dict[str, Any]]) -> Tuple[List[complex], List[float]]:
    qc = build_qiskit_circuit(num_qubits, gates)
    qc_sv = qc.remove_final_measurements(inplace=False)
    sv = Statevector.from_instruction(qc_sv)
    state = sv.data.astype(np.complex128)
    probs = np.abs(state) ** 2
    return state.tolist(), probs.tolist()


def simulate_counts(num_qubits: int, gates: List[Dict[str, Any]], shots: int, noise_model: NoiseModel | None = None) -> Dict[str, int]:
    qc = build_qiskit_circuit(num_qubits, gates)
    # Ensure measurements exist
    if not qc.cregs:
        qc.measure(range(num_qubits), range(num_qubits))
    backend = Aer.get_backend('aer_simulator')
    if noise_model is not None:
        backend.set_options(noise_model=noise_model)
    # Transpile for backend to avoid result key issues across versions
    tqc = transpile(qc, backend)
    job = backend.run(tqc, shots=shots)
    result = job.result()
    # Try multiple ways to get counts robustly
    try:
        counts_any = result.get_counts()
    except Exception:
        counts_any = None
    if isinstance(counts_any, list):
        if counts_any:
            return dict(counts_any[0])
        return {}
    if isinstance(counts_any, dict):
        return dict(counts_any)
    # Attempt by experiment index or circuit reference
    try:
        return dict(result.get_counts(0))
    except Exception:
        try:
            return dict(result.get_counts(tqc))
        except Exception:
            return {}


def compute_density_matrix(statevector: List[complex]) -> List[List[complex]]:
    sv = Statevector(np.array(statevector, dtype=np.complex128))
    dm = DensityMatrix(sv)
    return dm.data.tolist()


def _pauli_string(num_qubits: int, target: int, axis: str) -> Pauli:
    axis_map = { 'X': 'X', 'Y': 'Y', 'Z': 'Z' }
    s = ''.join(axis_map[axis] if i == target else 'I' for i in range(num_qubits))
    return Pauli(s)


def compute_expectations_xyz(statevector: List[complex], num_qubits: int) -> Dict[str, List[float]]:
    sv = Statevector(np.array(statevector, dtype=np.complex128))
    xs: List[float] = []
    ys: List[float] = []
    zs: List[float] = []
    for q in range(num_qubits):
        px = _pauli_string(num_qubits, q, 'X')
        py = _pauli_string(num_qubits, q, 'Y')
        pz = _pauli_string(num_qubits, q, 'Z')
        xs.append(float(np.real(sv.expectation_value(px))))
        ys.append(float(np.real(sv.expectation_value(py))))
        zs.append(float(np.real(sv.expectation_value(pz))))
    return { 'X': xs, 'Y': ys, 'Z': zs }


def compute_single_qubit_bloch_vectors(statevector: List[complex], num_qubits: int) -> List[Dict[str, float]]:
    """Compute Bloch sphere coordinates for each qubit by tracing out others."""
    sv = Statevector(np.array(statevector, dtype=np.complex128))
    dm = DensityMatrix(sv)
    
    bloch_vectors = []
    for qubit_idx in range(num_qubits):
        # Trace out all qubits except the target one
        other_qubits = [i for i in range(num_qubits) if i != qubit_idx]
        if other_qubits:
            reduced_dm = partial_trace(dm, other_qubits)
        else:
            reduced_dm = dm
        
        # Convert to numpy array for Pauli matrix calculations
        rho = np.array(reduced_dm.data)
        
        # Pauli matrices
        pauli_x = np.array([[0, 1], [1, 0]], dtype=complex)
        pauli_y = np.array([[0, -1j], [1j, 0]], dtype=complex)
        pauli_z = np.array([[1, 0], [0, -1]], dtype=complex)
        
        # Bloch vector components
        bx = float(np.real(np.trace(rho @ pauli_x)))
        by = float(np.real(np.trace(rho @ pauli_y)))
        bz = float(np.real(np.trace(rho @ pauli_z)))
        
        bloch_vectors.append({
            'x': bx,
            'y': by, 
            'z': bz,
            'qubit': qubit_idx,
            'label': f'q{qubit_idx}'
        })
    
    return bloch_vectors


def compute_circuit_fidelity(statevector1: List[complex], statevector2: List[complex]) -> float:
    """Compute fidelity between two quantum states."""
    sv1 = np.array(statevector1, dtype=np.complex128)
    sv2 = np.array(statevector2, dtype=np.complex128)
    
    # Normalize states
    sv1 = sv1 / (np.linalg.norm(sv1) + 1e-12)
    sv2 = sv2 / (np.linalg.norm(sv2) + 1e-12)
    
    # Compute fidelity
    fidelity = float(np.abs(np.vdot(sv1, sv2)) ** 2)
    return fidelity


def compute_entanglement_entropy(statevector: List[complex], num_qubits: int, partition: List[int]) -> float:
    """Compute entanglement entropy for a given partition of qubits."""
    if not partition or len(partition) >= num_qubits:
        return 0.0
        
    sv = Statevector(np.array(statevector, dtype=np.complex128))
    dm = DensityMatrix(sv)
    
    # Trace out qubits not in partition
    trace_out = [i for i in range(num_qubits) if i not in partition]
    if trace_out:
        reduced_dm = partial_trace(dm, trace_out)
    else:
        reduced_dm = dm
    
    # Compute eigenvalues
    eigenvals = np.linalg.eigvals(reduced_dm.data)
    eigenvals = eigenvals[eigenvals > 1e-12]  # Remove near-zero eigenvalues
    
    # Compute von Neumann entropy
    entropy = -np.sum(eigenvals * np.log2(eigenvals + 1e-12))
    return float(entropy)


def analyze_circuit_properties(statevector: List[complex], num_qubits: int) -> Dict[str, Any]:
    """Comprehensive analysis of quantum circuit properties."""
    sv_array = np.array(statevector, dtype=np.complex128)
    
    # Basic properties
    probabilities = (np.abs(sv_array) ** 2).tolist()
    
    # Bloch vectors for each qubit
    bloch_vectors = compute_single_qubit_bloch_vectors(statevector, num_qubits)
    
    # Entanglement measures
    entanglement_entropies = {}
    if num_qubits > 1:
        # Bipartite entanglement for different cuts
        for i in range(1, num_qubits):
            partition = list(range(i))
            entropy = compute_entanglement_entropy(statevector, num_qubits, partition)
            entanglement_entropies[f'cut_{i}'] = entropy
    
    # Participation ratio (measure of localization)
    participation_ratio = 1.0 / np.sum(np.array(probabilities) ** 2) if probabilities else 1.0
    
    return {
        'probabilities': probabilities,
        'bloch_vectors': bloch_vectors,
        'entanglement_entropies': entanglement_entropies,
        'participation_ratio': float(participation_ratio),
        'num_nonzero_amplitudes': int(np.sum(np.abs(sv_array) > 1e-12))
    }
