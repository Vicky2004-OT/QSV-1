# API

Base URL: `/api`

- POST `/simulate` → { circuit, shots? } → statevector, probabilities, measurement_counts
- POST `/state` → { circuit } → statevector, density_matrix
- POST `/analysis` → { circuit, target_statevector? } → analytics
- POST `/export/qasm` → CircuitPayload → OpenQASM string
- POST `/export/json` → CircuitPayload → echo JSON
- GET `/tutorials` → list of tutorials
- GET `/tutorials/{id}` → tutorial JSON
