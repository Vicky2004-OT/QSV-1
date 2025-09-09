# QSV — Quantum State Visualizer

Multi-page web app to build circuits, simulate states, and visualize results.

## Quick Start

- Backend:
  - python -m venv backend/.venv && source backend/.venv/bin/activate
  - pip install -r backend/requirements.txt
  - ./backend/scripts/dev.sh
- Frontend:
  - cd frontend && npm install
  - npm run dev

## Docker

- docker compose up --build
- Frontend: http://localhost:5173
- API: http://localhost:8000

## Docs

- See API.md, UserGuide.md, Architecture.md
