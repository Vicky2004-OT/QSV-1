from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, HTMLResponse
from typing import Any, Dict, List
import numpy as np

from .schemas.api import (
    SimulateRequest,
    StateRequest,
    AnalysisRequest,
    SimulateResponse,
    StateResponse,
    AnalysisResponse,
)
from .services.simulator import (
    simulate_statevector,
    simulate_counts,
    compute_density_matrix,
    build_noise_model,
    compute_expectations_xyz,
    compute_single_qubit_bloch_vectors,
    analyze_circuit_properties,
    compute_circuit_fidelity,
)
from .services.bloch_visualizer import generate_bloch_sphere_image, generate_interactive_bloch_html
from .routers.tutorials import router as tutorials_router
from .routers.export import router as export_router


def create_app() -> FastAPI:
    app = FastAPI(title="QSV - Quantum State Visualizer API", version="0.1.0")

    def _complex_to_pair_list(values):
        try:
            return [[float(x.real), float(x.imag)] for x in values]
        except Exception:
            return values

    def _complex_matrix_to_pair_list(matrix):
        try:
            return [[[float(x.real), float(x.imag)] for x in row] for row in matrix]
        except Exception:
            return matrix

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(tutorials_router)
    app.include_router(export_router)

    @app.get("/")
    async def root() -> Dict[str, str]:
        return {"message": "QSV API is running", "docs": "/docs", "health": "/health"}

    @app.get("/health")
    async def health() -> Dict[str, str]:
        return {"status": "ok"}

    @app.post("/api/simulate", response_model=SimulateResponse)
    async def simulate(req: SimulateRequest) -> JSONResponse:
        num_qubits = req.circuit.qubits
        gates = req.circuit.gates

        statevector, probabilities = simulate_statevector(num_qubits, gates)
        counts: Dict[str, int] = {}
        if req.shots and req.shots > 0:
            counts = simulate_counts(num_qubits, gates, req.shots)

        return JSONResponse(
            {
                "statevector": _complex_to_pair_list(statevector),
                "probabilities": probabilities,
                "measurement_counts": counts,
                "analytics": {},
            }
        )

    @app.post("/api/state", response_model=StateResponse)
    async def state(req: StateRequest) -> JSONResponse:
        num_qubits = req.circuit.qubits
        gates = req.circuit.gates
        statevector, _ = simulate_statevector(num_qubits, gates)
        density_matrix = compute_density_matrix(statevector)
        return JSONResponse({
            "statevector": _complex_to_pair_list(statevector),
            "density_matrix": _complex_matrix_to_pair_list(density_matrix),
        })

    @app.post("/api/analysis", response_model=AnalysisResponse)
    async def analysis(req: AnalysisRequest) -> JSONResponse:
        num_qubits = req.circuit.qubits
        gates = req.circuit.gates
        statevector, _ = simulate_statevector(num_qubits, gates)

        analytics: Dict[str, Any] = {
            "fidelity": None,
            "expectation_values": {},
            "entanglement_entropy": None,
        }

        if req.target_statevector:
            sv = np.array(statevector, dtype=np.complex128)
            tv = np.array(req.target_statevector, dtype=np.complex128)
            tv = tv / (np.linalg.norm(tv) + 1e-12)
            sv = sv / (np.linalg.norm(sv) + 1e-12)
            fidelity = float(np.abs(np.vdot(tv, sv)) ** 2)
            analytics["fidelity"] = fidelity

        analytics["expectation_values"] = compute_expectations_xyz(statevector, num_qubits)
        analytics["bloch_vectors"] = compute_single_qubit_bloch_vectors(statevector, num_qubits)
        
        # Enhanced circuit analysis
        circuit_analysis = analyze_circuit_properties(statevector, num_qubits)
        analytics["entanglement_entropies"] = circuit_analysis["entanglement_entropies"]
        analytics["participation_ratio"] = circuit_analysis["participation_ratio"]

        if req.noise:
            nm = build_noise_model(
                req.noise.bit_flip_prob,
                req.noise.depolarizing_prob,
                req.noise.amplitude_damping_gamma,
            )
            noisy_counts = simulate_counts(num_qubits, gates, shots=1024, noise_model=nm) if nm else {}
            analytics["noisy_counts_preview"] = noisy_counts

        return JSONResponse({"analytics": analytics})

    @app.post("/api/submit")
    async def submit_job(payload: Dict[str, Any]) -> JSONResponse:
        return JSONResponse({"job_id": "demo-job-id"})

    @app.get("/api/job/{job_id}")
    async def job_status(job_id: str) -> JSONResponse:
        return JSONResponse({"job_id": job_id, "status": "completed", "result": {}})

    @app.get("/api/bloch-sphere-html")
    async def get_bloch_sphere_html(num_qubits: int = 1, gates: str = "[]") -> HTMLResponse:
        """Generate interactive Bloch sphere visualization as HTML"""
        try:
            import json
            gates_list = json.loads(gates) if gates != "[]" else []
            
            # Get statevector first, then compute Bloch vectors
            statevector, _ = simulate_statevector(num_qubits, gates_list)
            bloch_vectors = compute_single_qubit_bloch_vectors(statevector, num_qubits)
            
            # Convert to format expected by visualizer
            vectors = []
            for bv in bloch_vectors:
                vectors.append({
                    'x': float(bv['x']),
                    'y': float(bv['y']), 
                    'z': float(bv['z']),
                    'label': bv['label']
                })
            
            # Generate interactive HTML
            html_content = generate_interactive_bloch_html(vectors, "Quantum State Bloch Sphere")
            
            return HTMLResponse(content=html_content)
            
        except Exception as e:
            error_html = f"""
            <html>
            <body style="background: white; padding: 20px; font-family: Arial;">
                <h2>Error generating Bloch sphere</h2>
                <p>{str(e)}</p>
            </body>
            </html>
            """
            return HTMLResponse(content=error_html, status_code=500)

    @app.post("/api/bloch-sphere")
    async def generate_bloch_sphere(payload: Dict[str, Any]) -> JSONResponse:
        """Generate Bloch sphere visualization as base64 image"""
        try:
            num_qubits = payload.get('num_qubits', 1)
            gates = payload.get('gates', [])
            rotation_angle = payload.get('rotation_angle', 0)
            
            # Get Bloch vectors from circuit
            bloch_vectors = compute_single_qubit_bloch_vectors(num_qubits, gates)
            
            # Convert to format expected by visualizer
            vectors = []
            for i, (x, y, z) in enumerate(bloch_vectors):
                vectors.append({
                    'x': float(x),
                    'y': float(y), 
                    'z': float(z),
                    'label': f'q{i}'
                })
            
            # Generate image with rotation
            image_base64 = generate_bloch_sphere_image(vectors, "Quantum State Bloch Sphere", rotation_angle)
            
            return JSONResponse({
                "image": image_base64,
                "vectors": vectors
            })
            
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

    @app.websocket("/ws/session")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                message = await websocket.receive_text()
                await websocket.send_text(message)
        except WebSocketDisconnect:
            pass

    return app


app = create_app()
