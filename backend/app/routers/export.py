from fastapi import APIRouter
from fastapi.responses import PlainTextResponse, JSONResponse
from ..schemas.api import CircuitPayload
from ..services.simulator import build_qiskit_circuit

try:
    from qiskit.qasm2 import dumps as qasm2_dumps  # Qiskit >= 1.0
except Exception:  # pragma: no cover
    qasm2_dumps = None  # type: ignore

router = APIRouter(prefix="/api/export", tags=["export"])


@router.post("/qasm", response_class=PlainTextResponse)
async def export_qasm(payload: CircuitPayload) -> str:
    qc = build_qiskit_circuit(payload.qubits, payload.gates)
    if qasm2_dumps:
        return qasm2_dumps(qc)
    return qc.qasm()  # fallback for older versions


@router.post("/json", response_class=JSONResponse)
async def export_json(payload: CircuitPayload):
    return JSONResponse(payload.model_dump())
