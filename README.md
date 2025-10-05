# QSV — Quantum State Visualizer

An interactive web application to design quantum circuits, simulate quantum states, and visualize results through dynamic Bloch spheres and circuit renderings.

QSV bridges classical frontend visualization with quantum backend computation, powered by TypeScript and Qiskit.

Quick Start
Backend (Python + Qiskit)
# Create and activate virtual environment
python -m venv backend/.venv
source backend/.venv/bin/activate  # (use backend\.venv\Scripts\activate on Windows)

# Install dependencies
pip install -r backend/requirements.txt

# Run backend server
./backend/scripts/dev.sh


The backend handles quantum circuit simulation and Qiskit-based computations, exposing results via a REST API.

# Frontend (TypeScript + Vite)
cd frontend
npm install
npm run dev


The frontend renders Bloch spheres, quantum gate visualizations, and interactive circuit builders entirely on the client side using TypeScript and 3D visualization libraries such as Three.js or Plotly.js.

Live Demo: https://qsv-1.vercel.app/visualizer

# Docker Setup
docker compose up --build


Frontend: http://localhost:5173

Backend API: http://localhost:8000

# Documentation

API.md – Backend endpoints and Qiskit integration

UserGuide.md – How to create circuits and visualize results

Architecture.md – System design and frontend-backend interaction flow

# Tech Stack

Frontend: TypeScript, HTML5, CSS3, Node.js, Vite, 3D Visualization (Three.js / Plotly.js)
Backend: Python, Flask / FastAPI, Qiskit, NumPy
Deployment: Vercel (Frontend), Localhost / Docker (Backend)
Version Control: Git + GitHub
