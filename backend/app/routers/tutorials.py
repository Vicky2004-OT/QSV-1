from pathlib import Path
from typing import List, Dict, Any
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/tutorials", tags=["tutorials"])

EXAMPLES_DIR = Path(__file__).resolve().parents[2] / "examples"


def _load_manifest() -> List[Dict[str, Any]]:
    manifest_path = EXAMPLES_DIR / "manifest.json"
    if not manifest_path.exists():
        return []
    return json.loads(manifest_path.read_text())


@router.get("/")
async def list_tutorials() -> List[Dict[str, Any]]:
    return _load_manifest()


@router.get("/{tutorial_id}")
async def get_tutorial(tutorial_id: str) -> Dict[str, Any]:
    file_path = EXAMPLES_DIR / f"{tutorial_id}.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Tutorial not found")
    data = json.loads(file_path.read_text())
    return data
