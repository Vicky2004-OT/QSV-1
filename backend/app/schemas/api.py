from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class CircuitPayload(BaseModel):
    qubits: int = Field(..., ge=1)
    gates: List[Dict[str, Any]] = Field(default_factory=list)
    # gates: { name: str, targets: List[int], controls?: List[int], params?: List[float], step?: int }


class SimulateRequest(BaseModel):
    circuit: CircuitPayload
    shots: int = 0


class StateRequest(BaseModel):
    circuit: CircuitPayload


class NoiseOptions(BaseModel):
    bit_flip_prob: float | None = None
    depolarizing_prob: float | None = None
    amplitude_damping_gamma: float | None = None


class AnalysisRequest(BaseModel):
    circuit: CircuitPayload
    target_statevector: Optional[List[complex]] = None
    noise: Optional[NoiseOptions] = None


class SimulateResponse(BaseModel):
    statevector: List[complex]
    probabilities: List[float]
    measurement_counts: Dict[str, int]
    analytics: Dict[str, Any]


class StateResponse(BaseModel):
    statevector: List[complex]
    density_matrix: List[List[complex]]


class AnalysisResponse(BaseModel):
    analytics: Dict[str, Any]
