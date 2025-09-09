# Architecture

- Frontend: React + Vite + Tailwind, React Router, Zustand, Plotly
- Backend: FastAPI, Qiskit (Aer), WebSocket
- Docker: Nginx serves frontend; reverse proxies API and WS to backend
- CI: GitHub Actions builds frontend and verifies backend deps
